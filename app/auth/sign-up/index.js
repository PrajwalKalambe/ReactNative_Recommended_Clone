import { View, Text,TextInput, StyleSheet, TouchableOpacity, ToastAndroid,Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRouter} from 'expo-router'
// import { CheckBox } from 'react-native-elements'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons';
import {auth} from './../../../configs/FirebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth';import { getDatabase, ref, set } from "firebase/database";

export default function SignUp() {
  const router=useRouter();
  const navigation=useNavigation();
  const [email,setEmail]=useState();
  const [password,setPassword]=useState();
  const [fullName,setFullName]=useState();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(()=>{
    navigation.setOptions({
      headerShown:false
    })
  },[])

  const OnCreateAccount = () => {
    if (!email || !password || !fullName) {
      // ToastAndroid.show("Please enter all Details!!", ToastAndroid.BOTTOM);
      Alert.alert('Error', 'Please enter all Details!!');
      return;
    }
  
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        console.log(user);
  
        // Add user data to Realtime Database
        const db = getDatabase();
        set(ref(db, 'users/' + user.uid), {
          fullName: fullName,
          email: email,
          isAdmin: isAdmin
        });
        console.log("user register successfully");
        // ToastAndroid.show("User Registered Successfully !!!", ToastAndroid.BOTTOM);
        // ToastAndroid.show("user register sucessfully",ToastAndroid.CENTER);
        Alert.alert('success', 'User Registered Successfully !!!!!');

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage, errorCode);
        // ToastAndroid.show("Registration failed: " + errorMessage, ToastAndroid.BOTTOM);
        Alert.alert('error', 'registeration failed !!!!!');

      });
  }

  return (
    
    <View style={{
      padding:25,
      paddingTop:60,
      backgroundColor:Colors.WHITE,
      height:'100%'
    }}>
      <TouchableOpacity onPress={()=>router.back()}>
      <Ionicons name="arrow-back-circle-sharp" size={30} color="black" />
      </TouchableOpacity>
      <Text style={{
        fontFamily:'outfit-Bold',
        fontSize:30,
        marginTop:50
      }}>Create New Account</Text>

      {/* User full name */}
      <View style={{
        marginTop:60
      }}>
        <Text style={{
          fontFamily:'outfit',
          fontSize:22,
          paddingLeft:10,
          padding:5
        }}>Full Name</Text>
        <TextInput placeholder='Enter Full Name' 
          onChangeText={(value)=>setFullName(value)}
        style={styles.input}></TextInput>
      </View>
      {/* Email */}
      <View style={{
        marginTop:20
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


    {/* Is admin  */}
        
    <View style={styles.container}>
  <TouchableOpacity 
    style={styles.checkbox} 
    onPress={() => setIsAdmin(!isAdmin)}
  >
    {isAdmin && <View style={styles.checkmark} />}
  </TouchableOpacity>
  <Text style={{
    padding: 20,
    fontSize: 20,
    paddingLeft: 5,
    marginTop: 13
  }}>Is Admin</Text>
</View>
    
      {/* Create Account button */}
      <TouchableOpacity 
        onPress={OnCreateAccount}
      style={{
        padding:15,
        backgroundColor:Colors.PRIMARY,
        borderRadius:15,
        marginTop:0
      }}>
        <Text style={{
          color:Colors.WHITE,
          textAlign:'center',
          fontSize:22
        }}>Create Account</Text>
      </TouchableOpacity>

      {/* Sign In button */}
      <TouchableOpacity 
      onPress={()=>router.replace('auth/sign-in')}
      style={{
        padding:15,
        backgroundColor:Colors.WHITE,
        borderRadius:15,
        marginTop:10,
        borderWidth:1
      }}>
        <Text style={{
          color:Colors.PRIMARY,
          textAlign:'center',
          fontSize:20
        }}>Sign In</Text>
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
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop:15
  },
  checkmark: {
    width: 14,
    height: 14,
    backgroundColor: '#000',
  
  },
  label: {
    fontSize: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginRight:10,
    padding:10
  },
})