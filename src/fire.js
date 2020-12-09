import firebase from 'firebase'
var config = {
    apiKey: "AIzaSyBvfCuiR4jBJPcLJNC9bhjsvjJf3GX0rLY",
    authDomain: "texteditor-73b07.firebaseapp.com",
    databaseURL: "https://texteditor-73b07.firebaseio.com",
    projectId: "texteditor-73b07",
    storageBucket: "texteditor-73b07.appspot.com",
    messagingSenderId: "146339650667",
    appId: "1:146339650667:web:34daa5f4e8e630297f652e",
    measurementId: "G-Z7NWD9XCED"
  };
var fire = firebase.initializeApp(config);
export default fire;