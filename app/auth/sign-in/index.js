import { View, Text, TextInput,StyleSheet, TouchableOpacity, ToastAndroid ,Alert} from 'react-native'
import React, { useEffect, useState } from 'react'
import {router, useNavigation, useRouter} from 'expo-router'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../configs/FirebaseConfig';
import { getDatabase, ref, get } from "firebase/database";

export default function SignIn() {
  const navigation=useNavigation();
  const router=useRouter();

  const [email,setEmail]=useState();
  const [password,setPassword]=useState();

  useEffect(()=>{
    navigation.setOptions({
      headerShown:false
    })
  },[])
  const checkIsAdmin = (userId) => {
    const db = getDatabase();
    const userRef = ref(db, 'users/' + userId);
  
    return get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        return userData.isAdmin === true;
      } else {
        console.log("No user data found");
        return false;
      }
    }).catch((error) => {
      console.error("Error checking admin status:", error);
      return false;
    });
  };
  const onsignIn=()=>{
    
    if(!email&&!password){
      //ToastAndroid.show("Please enter Email and Password !!",ToastAndroid.BOTTOM);
      Alert.alert('Error', 'Please enter Email and Password !!');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in .
    const user = userCredential.user;
    // router.replace('user/UserPage')
    console.log(user);
    // Assuming you have the user's ID
    const userId = auth.currentUser.uid;
    
    checkIsAdmin(userId).then((isAdmin) => {
      if (isAdmin) {
        console.log("User is an admin");
        router.replace('admin/AdminPage')
    // Perform admin-specific actions
  } else {
    console.log("User is not an admin");
    router.replace('user/UserPage')
    // Perform regular user actions
  }
});
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode,errorMessage);
    if(errorCode=='auth/invalid-credential'){
      // ToastAndroid.show("Invalid Credentials",ToastAndroid.BOTTOM);
      Alert.alert('Error', 'Invalid Credentials !!');

    }
  });
  }


  return (
    <View style={{
      padding:25,
      backgroundColor:Colors.WHITE,
      height:'100%',
      paddingTop:80
    }}>
      <TouchableOpacity onPress={()=>router.back()}>
      <Ionicons name="arrow-back-circle-sharp" size={24} color="black" />
      </TouchableOpacity>
      
      <Text style={{
        fontFamily:'outfit-Bold',
        marginTop:10,
        fontSize:30
      }}>Let's Sign You In</Text>
      <Text style={{
        fontFamily:'outfit',
        fontSize:30,
        color:Colors.GRAY,
        marginTop:20
      }}>Welcome Back</Text>
      <Text style={{
        fontFamily:'outfit',
        fontSize:30,
        color:Colors.GRAY,
        marginTop:10
      }}>You've been missed!!</Text>

      {/* Email */}
      <View style={{
        marginTop:70
      }}>
        <Text style={{
          fontFamily:'outfit',
          fontSize:22,
          paddingLeft:10,
          padding:5
        }}>Email</Text>
        <TextInput placeholder='Enter Email' 
          onChangeText={(value)=>setEmail(value)}
        style={styles.input}></TextInput>
      </View>

      {/* Password */}
      <View style={{
        marginTop:30
      }}>
        <Text style={{
          fontFamily:'outfit',
          fontSize:22,
          paddingLeft:10,
          padding:5
        }}>Password</Text>
        <TextInput secureTextEntry={true} 
        onChangeText={(value)=>setPassword(value)}
        placeholder='Enter Password' style={styles.input}></TextInput>
      </View>

      {/* Sign in button */}
      <TouchableOpacity 
      onPress={onsignIn}
      style={{
        padding:15,
        backgroundColor:Colors.PRIMARY,
        borderRadius:15,
        marginTop:90
      }}>
        <Text style={{
          color:Colors.WHITE,
          textAlign:'center',
          fontSize:22
        }}>Sign In</Text>
      </TouchableOpacity>

      {/* Create account button */}
      <TouchableOpacity 
      onPress={()=>router.replace('auth/sign-up')}
      style={{
        padding:15,
        backgroundColor:Colors.WHITE,
        borderRadius:15,
        marginTop:20,
        borderWidth:1
      }}>
        <Text style={{
          color:Colors.PRIMARY,
          textAlign:'center',
          fontSize:20
        }}>Create Account</Text>
      </TouchableOpacity>
    </View>
  )
}


const styles=StyleSheet.create({
  input:{
    padding:15,
    borderRadius:15,
    fontFamily:'outfit',
    borderWidth:1,
    borderColor:Colors.GRAY
  }
})