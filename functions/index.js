const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
// Allowlist: prefer ADMIN_UID env var; for local dev we optionally read .firebaserc adminUid
let ALLOWED_ADMIN_UIDS = [];
if(process.env.ADMIN_UID){
  ALLOWED_ADMIN_UIDS = process.env.ADMIN_UID.split(',').map(s=>s.trim()).filter(Boolean);
} else {
  // try to read .firebaserc if present (local dev convenience)
  try{
    const fs = require('fs');
    const path = require('path');
    const cfgPath = path.join(process.cwd(), '.firebaserc');
    if(fs.existsSync(cfgPath)){
      const cfg = JSON.parse(fs.readFileSync(cfgPath,'utf8'));
      if(cfg && cfg.adminUid) ALLOWED_ADMIN_UIDS.push(cfg.adminUid);
    }
  }catch(e){ /* ignore */ }
}

// Cloud Function: admin-only toggle for gpt5 flag
exports.toggleGpt5 = functions.https.onCall(async (data, context) => {
  if(!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be signed in');
  const uid = context.auth.uid;
  const token = context.auth.token || {};

  // Allow if user has custom claim 'admin' (recommended) or uid is in allowlist
  const isAdminClaim = !!token.admin;
  const isAllowlisted = ALLOWED_ADMIN_UIDS.includes(uid);
  if(!isAdminClaim && !isAllowlisted){
    throw new functions.https.HttpsError('permission-denied', 'User is not an admin');
  }

  const enabled = data.enabled === true;
  await admin.firestore().collection('settings').doc('global').set({ gpt5_mini_enabled: enabled }, { merge: true });
  return { ok: true, enabled };
});

// Scheduled function that runs daily and creates reminder documents for tasks due soon
exports.dailyTaskReminder = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const db = admin.firestore();
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7); // 7 days ahead
  const usersSnap = await db.collection('users').get();
  for(const u of usersSnap.docs){
    const uid = u.id;
    try{
      const metaSnap = await db.collection('users').doc(uid).collection('meta').doc('dashboard').get();
      const data = metaSnap.exists && metaSnap.data() && metaSnap.data().data ? metaSnap.data().data : {};
      const tasks = (data.my_home && data.my_home.tasks) || [];
      const reminders = tasks.filter(t=> t.due && new Date(t.due) <= target && new Date(t.due) >= now);
      for(const r of reminders){
        // create a reminder doc for user
        await db.collection('users').doc(uid).collection('reminders').add({ taskId: r.id, title: r.title, due: r.due, createdAt: admin.firestore.FieldValue.serverTimestamp(), sent: false });
      }
    }catch(e){ console.error('error processing user', uid, e); }
  }
  return null;
});
