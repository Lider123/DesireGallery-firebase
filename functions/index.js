'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

exports.sendNotification = functions.firestore.document("notifications/{userLogin}").onWrite(async (change, context) => {
  const userLogin = context.params.userLogin;
  console.log("Sending notification to user ", userLogin);

  const userRef = db.collection("users").doc(userLogin);
  userRef.get().then(doc => {
    const data = doc.data();
    const tokens = data["messageTokens"];
    const payload = {
      notification: {
        title: "DesireGallery",
        body: "You have a new comment!",
        icon: "default"
      }
    };
    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i];
      console.log("Sending message to token", token);
      admin.messaging().sendToDevice(token, payload).then(response => {
        console.log("Notification has been sent. Results:", response.results);
        return response;
      })
        .catch(error => {
          console.log(`Failed to send notification: ${error}`);
        });
    }
    return 0;
  })
    .catch(error => {
      console.log(`An error occurred while getting user${userLogin}: ${error}`);
    })
});
