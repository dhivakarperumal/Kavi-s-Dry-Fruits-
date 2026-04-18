const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = "e558dlsVwoUHlZgLJNfJES8BRlx1";

admin
  .auth()
  .setCustomUserClaims(uid, { role: "admin" })
  .then(() => {
    console.log(`Admin role set for ${uid}`);
  })
  .catch((err) => {
    console.error("Error setting admin role:", err);
  });
