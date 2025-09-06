// api/getHomeData.js
import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  try {
    const snapshot = await db.collection("homes").get();
    const homes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json(homes);
  } catch (err) {
    console.error("Error reading data:", err);
    return res.status(500).json({ message: "Error reading details" });
  }
}
