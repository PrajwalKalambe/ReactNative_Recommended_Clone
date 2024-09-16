import { View, Text, StyleSheet, TouchableOpacity,Platform,Button, TextInput,Alert, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '@/constants/Colors'
import { useNavigation, useRouter } from 'expo-router';
import axios from 'axios';

export default function AdminPage() {
  
    const [productName, setProductName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [fileDetails, setFileDetails] = useState(null);
    const router=useRouter();
    const navigation=useNavigation();
    useEffect(()=>{
        navigation.setOptions({
          headerShown:false
        })
      },[])
    const addURL=async()=>{
      try {
        // Create an object with the data
        const productData = {
          productName: productName,
          imageUrl: imageUrl
        };
        
        // Make the POST request using axios
        const response = await axios.post('http://127.0.0.1:5000/AddProductRN', productData, {
          headers: {
            'Content-Type': 'application/json',
          },
         
        });
        
        // Handle the response
        console.log('Response:', response.data);
        Alert.alert('Success', 'Product added successfully');
        
        // Clear the input fields
        setProductName('');
        setImageUrl('');
      } catch (error) {
        console.error('Error adding product:', error);
        Alert.alert('Error', 'Failed to add product');
      }
    }



    const handleFileChange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const fileDetails = {
          uri: URL.createObjectURL(file),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
        };
        setFileDetails(fileDetails);
      }
    };
  
    const submitDocument = async () => {
      if (fileDetails) {
        const formData = new FormData();
        formData.append('csvFile', fileDetails.file);
  
        try {
          const response = await fetch('http://127.0.0.1:5000/uploadCSVRN', {
            method: 'POST',
            body: formData,
          });
          const result = await response.json();
          console.log('Response from Flask:', result);
          Alert.alert('Success', 'CSV file uploaded successfully!');
          
        } catch (error) {
          console.error('Error submitting file:', error);
        }
      } else {
        Alert.alert('No File Selected!!');
        console.log('No file selected');
      }
    };
  
    
  
  return (
    <View>
      <Text style={styles.txt}>ADD CSV FILE</Text>
      <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={styles.fileInput}
        />
      ) : (
        <Button title="Pick a Document" onPress={pickDocument} />
      )}
      {fileDetails && (
        <View style={styles.fileDetails}>
          
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={submitDocument} ><Text style={{fontSize:20,color:'white',textAlign:'center'}}>Submit</Text></TouchableOpacity>
    </View>




      <View style={{
        backgroundColor:Colors.WHITE,height:'40%'
      }}>
            <Text style={styles.txt}>ADD PRODUCT URL</Text>
            <TextInput
        style={{ borderColor: 'Black', borderWidth: 1 ,width:'80%' , height:50,padding:5,borderRadius:20 , margin:40 ,marginTop:20,marginBottom:10}}
        placeholder="   Add Product Name..."
        value={productName}
        onChangeText={setProductName}
        
      />
            <TextInput
        style={{ borderColor: 'Black', borderWidth: 1 ,width:'80%' , height:50,padding:5,borderRadius:20 , margin:40 ,marginTop:10,marginBottom:20}}
        placeholder="   Add Product URL..."
        value={imageUrl}
        onChangeText={setImageUrl}
        
      />
      <TouchableOpacity 
      onPress={addURL}
      style={styles.button}>
        <Text style={{
          color:Colors.WHITE,
          textAlign:'center',
          fontSize:20,
          height:40,
          
        }}>Add Product</Text>
      </TouchableOpacity>

        <View style={{flexDirection:'row',marginTop:50}}>
      <TouchableOpacity onPress={()=>router.replace('user/UserPage')}
      style={{
          borderWidth:1,width:'45%',height:45,margin:10,marginTop:90,justifyContent:'center',alignItems:'center',marginLeft:10,borderTopStartRadius:50,borderBottomLeftRadius:50,backgroundColor:'black'
        }}><Text style={{fontFamily:'outfit-Bold',fontSize:17,color:'white'}}>GET PRODUCTS</Text></TouchableOpacity>
      <TouchableOpacity onPress={()=>router.push('')}
      style={{
        borderWidth:1,width:'45%',height:45,margin:10,marginTop:90,justifyContent:'center',alignItems:'center',marginRight:10,borderTopRightRadius:50,borderBottomRightRadius:50,backgroundColor:'black'
      }}><Text style={{fontFamily:'outfit-Bold',fontSize:17,color:'white'}}>LOGOUT    </Text></TouchableOpacity>
      </View>
        </View>
    </View>
  )
};


const styles=StyleSheet.create({
    txt:{
        margin:10,
        color:'black',
        fontFamily:'outfit-Bold',
        textAlign:'center',
        fontSize:20,
        marginTop:10
        
    },
    button:{
        padding:15,
        marginLeft:40,
        width:'80%',
        backgroundColor:Colors.PRIMARY,
        borderRadius:20,
        height:55,
        marginTop:15
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor:Colors.LIGHT_GRAY,
    },
    fileDetails: {
      marginVertical: 20,
      margin:40
    },
    fileInput: {
      marginVertical: 40,
    },
    submit:{
      backgroundColor:'black',
      padding:10
    },
})
