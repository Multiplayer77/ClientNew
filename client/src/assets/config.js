import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyDi9rJ4Yp3sPbqvuU5lbPRaN221TNai49U",
  authDomain: "oray-and-taraje.firebaseapp.com",
  databaseURL: "https://oray-and-taraje.firebaseio.com",
  projectId: "oray-and-taraje",
  storageBucket: "oray-and-taraje.appspot.com",
  messagingSenderId: "940305233875"
};

const firebaseApp = firebase.initializeApp(config);
export default firebaseApp
