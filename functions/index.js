'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendNotification = functions.firestore.document("notifications/{userLogin}/{notificationId}").onWrite(async (change, context) => {
  const userLogin = context.params.userLogin;
  const notificationId = context.params.notificationId;

  console.log("Sending notification to user ", userLogin);

  const getDeviceTokensPromise = admin.firestore().doc(`users/${userLogin}/notificationTokens`).once("value");
  return getDeviceTokensPromise.then(result => {
    const tokenId = result.val();
    const payload = {
      notification: {
        title: "DesireGallery",
        body: "You have a new comment!",
        icon: "default"
      }
    };

    return admin.messaging().sendToDevice(tokenId, payload).then(response => {
      console.log("Notification has been sent");
      return response;
    });
  }).catch(error => {
    console.log(error);
  })
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
