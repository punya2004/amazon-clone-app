import firebase from 'firebase';

 const firebaseapp = firebase.initializeApp({
    apiKey: "AIzaSyBKttLQnZ8sFRqoCeydPRdllzuUkAPD9Hc",
    authDomain: "app-74e2a.firebaseapp.com",
    projectId: "app-74e2a",
    storageBucket: "app-74e2a.appspot.com",
    messagingSenderId: "961928679046",
    appId: "1:961928679046:web:b54190068d59bad2c88b07"
 }) 
 
const auth = firebaseapp.auth();

export default firebaseapp;
export { auth }
