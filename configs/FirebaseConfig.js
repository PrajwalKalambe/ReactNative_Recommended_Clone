import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBRuhO-cnA9OMIaFbxjvcHyjw9oxKdt2H4",
  authDomain: "recommendvision.firebaseapp.com",
  databaseURL: "https://recommendvision-default-rtdb.firebaseio.com",
  projectId: "recommendvision",
  storageBucket: "recommendvision.appspot.com",
  messagingSenderId: "693961857647",
  appId: "1:693961857647:web:30cb5688972eb4a9b90b9a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);