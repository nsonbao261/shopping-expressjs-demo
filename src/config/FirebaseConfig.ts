import admin from 'firebase-admin';

export const bucket = admin.initializeApp({
    credential: admin.credential.cert("./firebase.json"),
    storageBucket: "gs://froschboardgame-1197d.appspot.com",
}).storage().bucket();