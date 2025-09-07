// Stripe backend for subscription checkout
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.raw({ type: 'application/json' }));

const stripe = Stripe(process.env.STRIPE_SECRET_KEY || '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');

// Initialize Firebase Admin SDK (replace with your service account file)
admin.initializeApp({
  credential: admin.credential.cert(require('../data-41fa8-firebase-adminsdk-fbsvc-892ea58cdd.json')),
});
const db = admin.firestore();

// Example product/pricing IDs (replace with your Stripe Dashboard IDs)
const PRICES = {
  basic: 'price_basic_id',
  pro: 'price_pro_id',
  advanced: 'price_advanced_id'
};

app.post('/create-checkout-session', async (req, res) => {
  const { plan, email } = req.body;
  if (!PRICES[plan]) return res.status(400).json({ error: 'Invalid plan' });
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [{ price: PRICES[plan], quantity: 1 }],
      success_url: 'http://localhost:4000/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:4000/cancel',
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stripe webhook endpoint
app.post('/webhook', bodyParser.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, 'whsec_your_webhook_secret'); // Replace with your webhook secret
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  // Handle checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_email;
    const plan = Object.keys(PRICES).find(key => PRICES[key] === session.display_items?.[0]?.price?.id || PRICES[key] === session.line_items?.[0]?.price?.id);
    if (email && plan) {
      // Store plan in Firestore
      await db.collection('users').doc(email).set({ plan }, { merge: true });
    }
  }
  res.json({ received: true });
});

app.get('/success', (req, res) => {
  res.send('<h2>Payment successful! Your subscription is active.</h2>');
});
app.get('/cancel', (req, res) => {
  res.send('<h2>Payment canceled. You can try again.</h2>');
});

app.listen(4000, () => console.log('Stripe backend running on port 4000'));
