import { View, Text,Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { Colors } from '@/constants/Colors'
import { useNavigation, useRouter } from 'expo-router'

export default function login() {
    const router=useRouter();
    const navigation=useNavigation();
    useEffect(()=>{
        navigation.setOptions({
          headerShown:false
        })
      },[])
  return (
    <View>
      <Image source={require('.\\..\\assets\\images\\login.jpg')}
      
        style={{
            width:'100%',
            height:550
        }}
      
      />
    <View style={styles.container}>
        <Text style={{
        fontSize:25,
        fontFamily:'outfit-Bold',
        textAlign:"center",
        marginTop:10,
        padding:25
    }}>Recommendation Clone</Text>
    <Text style={{
        fontFamily:'outfit',
        fontSize:20,
        textAlign:'center',
        color:Colors.GRAY,
        marginTop:20
    }}>Get similar and related image of the product..</Text>

    <TouchableOpacity style={styles.button}
        onPress={()=>router.push('auth/sign-in')}
        // onPress={()=>router.push('data/readCSV')}
        //onPress={()=>router.push('user/UserPage')}
        //onPress={()=>router.push('data/uploadCSV')}
        //onPress={()=>router.push('admin/AdminPage')}
    >
        <Text style={{
            color:Colors.WHITE,
            textAlign:'center',
            fontFamily:'outfit',
            fontSize:23
        }}>Get Started</Text>
    </TouchableOpacity>
    </View>
    
    </View>
  )
}


const styles = StyleSheet.create({
    container:{
        backgroundColor:Colors.WHITE,
        marginTop:-20,
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        height:'100%'
    },
    button:{
        padding:15,
        width:'90%',
        margin:15,
        backgroundColor:Colors.PRIMARY,
        borderRadius:99,
        marginTop:'12%'
    }
})