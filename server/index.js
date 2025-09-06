// server/index.js
// Small Express server to proxy prompts to an LLM provider securely.
// Features:
// - Optional Firebase ID token verification
// - Rate limiting
// - Configurable provider via env: OPENAI_API_KEY or PROVIDER_URL
// - Simple input validation

require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '64kb' }));

const PORT = process.env.PORT || 3000;

// Basic rate limiter
const limiter = rateLimit({ windowMs: 60 * 1000, max: process.env.RATE_LIMIT_PER_MIN || 60 });
app.use(limiter);

// Optional Firebase token verification
let verifyIdToken = null;
// firebaseAdmin will be non-null when FIREBASE_ADMIN_SDK_JSON is provided; we keep it
// so we can optionally write logs to Firestore server-side.
let firebaseAdmin = null;
if(process.env.FIREBASE_ADMIN_SDK_JSON){
  try{
    firebaseAdmin = require('firebase-admin');
    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_JSON);
    firebaseAdmin.initializeApp({ credential: firebaseAdmin.credential.cert(serviceAccount) });
    verifyIdToken = async (token) => {
      try{ return await firebaseAdmin.auth().verifyIdToken(token); } catch(e){ return null; }
    }
    console.log('Firebase admin initialized for ID token verification');
  }catch(e){ console.warn('Failed to init firebase-admin:', e.message); }
}

// Health
app.get('/health', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'dev' }));

// /api/llm endpoint - expects { prompt, userId }
app.post('/api/llm', async (req, res) => {
  try{
    const { prompt } = req.body || {};
    if(!prompt || typeof prompt !== 'string' || prompt.length < 2) return res.status(400).json({ error: 'invalid prompt' });

    // optional verify firebase id token from header
    if(process.env.REQUIRE_FIREBASE_ID && req.headers.authorization){
      const token = req.headers.authorization.replace(/^Bearer\s+/i, '');
      const verified = verifyIdToken? await verifyIdToken(token) : null;
      if(!verified) return res.status(401).json({ error: 'invalid id token' });
      // you can use verified.uid for additional checks
    }

    // If OPENAI_API_KEY provided, call OpenAI completions (example using /v1/chat/completions)
    if(process.env.OPENAI_API_KEY){
      const openaiUrl = process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';
      const body = {
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [{ role: 'system', content: 'You are NestMate assistant. Answer concisely and politely.' }, { role: 'user', content: prompt }],
        max_tokens: 400,
        temperature: 0.2
      };
      const r = await fetch(openaiUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }, body: JSON.stringify(body)
      });
      if(!r.ok) return res.status(500).json({ error: 'LLM provider error', status: r.status });
      const j = await r.json();
      // try to pick best text
      const reply = (j.choices && j.choices[0] && (j.choices[0].message?.content || j.choices[0].text)) || j.result || JSON.stringify(j);
      // optional server-side logging
      try{
            if(firebaseAdmin){
              const dbAdmin = firebaseAdmin.firestore();
              const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
              dbAdmin.collection('logs').add({
                prompt: String(prompt).slice(0, 1000),
                reply: String(reply).slice(0, 2000),
                userId: req.body.userId || null,
                ts: Date.now(),
                tookMs: Date.now() - req._startTime,
                ip, ua: req.headers['user-agent'] || null
              }).catch(()=>{});
            }
      }catch(e){ console.warn('LLM log write failed', e); }
      return res.json({ reply });
  // capture start time for timing logs
  app.use((req,res,next)=>{ req._startTime = Date.now(); next(); });

    }

    // If PROVIDER_URL set, proxy to that provider
    if(process.env.PROVIDER_URL){
      const r = await fetch(process.env.PROVIDER_URL, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ prompt }) });
      const j = await r.json();
      const reply = j.reply || j.text || j.output || null;
      try{
        if(firebaseAdmin){
          const dbAdmin = firebaseAdmin.firestore();
          dbAdmin.collection('logs').add({ prompt, reply, userId: req.body.userId || null, ts: Date.now() }).catch(()=>{});
        }
      }catch(e){ /* ignore logging errors */ }
      return res.json({ reply });
    }

    return res.status(400).json({ error: 'no provider configured' });
  }catch(err){
    console.error('LLM proxy error', err);
    return res.status(500).json({ error: 'server error' });
  }
});

app.listen(PORT, ()=> console.log(`LLM proxy listening on ${PORT}`));
