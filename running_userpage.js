// import React, { useEffect, useState } from 'react';
// import { View, Image,Text, FlatList, StyleSheet, Dimensions, ActivityIndicator ,TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { FontAwesome5 } from '@expo/vector-icons';
// import { Colors } from '@/constants/Colors'
// import { useNavigation } from 'expo-router';
// import axios from 'axios';


// export default SearchComponent = () => {
//   const [searchText, setSearchText] = useState('');
//   const [selectedImage, setSelectedImage] = useState(null);
//   const navigation=useNavigation();


//   useEffect(()=>{
//     navigation.setOptions({
//       headerTitle:'USER PORTAL'
//     })
//   },[])

//   const pickImage = async () => {
//     try {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to make this work!');
//         return;
//       }
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });
//       // console.log("Result:-",result.assets[0].uri);
//       setSearchText(result.assets[0].fileName);
//       setSelectedImage(result.assets[0].uri);

     
//     } catch (error) {
//       console.log('Error picking image: ', error);
//     }
//   };
  

//   const handleSearch = () => {
    
//     if (selectedImage!=null) {
//       console.log('Full image path:', selectedImage);
//       setSelectedImage(null);
//     } else {
//       console.log('Search text:', searchText);
//     }
//     setSearchText('');
//   };



//         // Get all product on the screen

//   const [isLoading, setIsLoading] = useState(true);
//   const [urls, setUrls] = useState([]);

//   useEffect(() => {
//     fetchCSVData();
//   }, []);

//   const fetchCSVData = async () => {
//     try {
//       const response = await axios.get('http://127.0.0.1:5000/readCSV');
//       console.log('CSV Data:', response.data);
      
//       // Extract both URL and product name
//       const extractedData = response.data.map(item => ({
//         url: item.URL,
//         name: item.PRODUCT_NAME // Adjust this field name if it's different in your CSV
//       })).filter(item => item.url && item.name);
//       setUrls(extractedData);
      
//       setIsLoading(false);
//     } catch (error) {
//       console.error('Error fetching CSV data:', error);
//       setIsLoading(false);
//     }
//   };
//   const renderItem = ({ item }) => (
    
//     <View style={styles.imageContainer}>
//       <Image
//         source={{ uri: item.url }}
//         style={styles.image}
//         resizeMode="contain"
//       />
//       <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
//         {item.name}
//       </Text>
//     </View>
//   );

//   if (isLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <> 
//     <View style={{ flexDirection: 'row', paddingHorizontal: 10 , margin:20  }}>
//       <TextInput
//         style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, borderRightWidth:0, paddingHorizontal: 10 ,borderTopLeftRadius:10,borderBottomLeftRadius:10 }}
//         placeholder="Search Any Product..."
//         onChangeText={text => setSearchText(text)}
//         value={searchText}
//         onSubmitEditing={handleSearch}
//       />
//       <TouchableOpacity onPress={pickImage} style={{ borderWidth:1,borderColor: 'gray', borderLeftWidth:0,borderRightWidth:0,paddingRight:10}}>
//         {/* <Image source={require('./../../assets/images/react-logo.png')} style={{ width: 24, height: 24 }} /> */}
//         <FontAwesome5 name="camera-retro" size={35} color="black" 
//          />
//       </TouchableOpacity>
//       <TouchableOpacity onPress={handleSearch} style={{  backgroundColor:Colors.PRIMARY, borderRadius: 10 ,borderTopLeftRadius:0,borderBottomLeftRadius:0 ,width:80}}>
//         <Text style={{ color: 'white' ,fontSize:18 ,textAlign:'center',textAlignVertical:'center' ,marginTop:5}}>Search</Text>
//       </TouchableOpacity>
//     </View>

    
//     <View style={{
//       backgroundColor:'gray',
//       flexWrap:'wrap',
      
//     }}>
//     <FlatList
//     data={urls}
//     renderItem={renderItem}
//     numColumns={2}
//     columnWrapperStyle={styles.row}
//     keyExtractor={(item, index) => index.toString()}
    
//     ListEmptyComponent={<View ><Text>No images found</Text></View>}
//   />
//   </View>
//   </>
//   );
// };

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listContainer: {
//     padding: 20,
//   },
//   imageContainer: {
//     backgroundColor: '#C7C8CC',
//     flex: 1,
//     margin: 2,
//     height: 250, // Increased height to accommodate text
//     maxWidth: '50%',
//     overflow: 'hidden',
//     elevation: 3, // for Android shadow
//     shadowColor: '#000', // for iOS shadow
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   image: {
//     flex: 1,
//     width: '100%',
//     height: '80%', // Adjust this value to leave space for text
//     backgroundColor: 'white',
//   },
//   productName: {
//     padding: 5,
//     fontSize: 20,
//     fontFamily:'Outfit',
//     textAlign:'center',
//     height: 40, // Fixed height for two lines of text
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection:'row',
//   },
//   row: {
//     flex: 1,
//     justifyContent: 'space-around',
//   },
// });











// import React, { useEffect, useState } from 'react';
// import { View, Image,Text, FlatList, StyleSheet, Dimensions, ActivityIndicator ,TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { FontAwesome5 } from '@expo/vector-icons';
// import { Colors } from '@/constants/Colors'
// import { useNavigation } from 'expo-router';
// import axios from 'axios';


// export default SearchComponent = () => {
//   const [searchText, setSearchText] = useState('');
//   const [selectedImage, setSelectedImage] = useState(null);
//   const navigation=useNavigation();


//   useEffect(()=>{
//     navigation.setOptions({
//       headerTitle:'USER PORTAL'
//     })
//   },[])

//   const pickImage = async () => {
//     try {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to make this work!');
//         return;
//       }
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });
//       // console.log("Result:-",result.assets[0].uri);
//       setSearchText(result.assets[0].fileName);
//       setSelectedImage(result.assets[0].uri);

     
//     } catch (error) {
//       console.log('Error picking image: ', error);
//     }
//   };
  

//   // const handleSearch = () => {
    
//   //   if (selectedImage!=null) {
//   //     console.log('Full image path:', selectedImage);
//   //     setSelectedImage(null);
//   //   } else {
//   //     console.log('Search text:', searchText);
//   //   }
//   //   setSearchText('');
//   // };



//         // Get all product on the screen

//   const [isLoading, setIsLoading] = useState(true);
//   const [urls, setUrls] = useState([]);

//   useEffect(() => {
//     fetchCSVData();
//   }, []);

//   const fetchCSVData = async () => {
//     try {
//       const response = await axios.get('http://127.0.0.1:5000/readCSV');
//       console.log('CSV Data:', response.data);
      
//       // Extract both URL and product name
//       const extractedData = response.data.map(item => ({
//         url: item.URL,
//         name: item.PRODUCT_NAME // Adjust this field name if it's different in your CSV
//       })).filter(item => item.url && item.name);
//       setUrls(extractedData);
      
//       setIsLoading(false);
//     } catch (error) {
//       console.error('Error fetching CSV data:', error);
//       setIsLoading(false);
//     }
//   };
//   const renderItem = ({ item }) => (
    
//     <View style={styles.imageContainer}>
//       <Image
//         source={{ uri: item.url }}
//         style={styles.image}
//         resizeMode="contain"
//       />
//       <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
//         {item.name}
//       </Text>
//     </View>
//   );

//   if (isLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   // this is the search images by text code 

//   const [imageUrls, setImageUrls] = useState([]);
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleSearch = async () => {
//     try {
//       const response = await fetch('http://127.0.0.1:5000/visionARN', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ filePathSeach: searchText.toLowerCase() }),
//       });

//       const data = await response.json();

//       if (data.error) {
//         setErrorMessage(data.error);
//         setImageUrls([]);
//       } else {
//         setImageUrls(data.output_arr);
//         setErrorMessage('');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setErrorMessage('An error occurred while searching');
//     }
//   };

//   const handleImageSelect = async () => {
//     try {
//       let result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });

//       if (!result.cancelled) {
//         setSelectedImage(result.uri);
        
//         const formData = new FormData();
//         formData.append('filePath', {
//           uri: result.uri,
//           type: 'image/jpeg',
//           name: 'upload.jpg',
//         });

//         const response = await fetch('http://127.0.0.1:5000/visionARN', {
//           method: 'POST',
//           body: formData,
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });

//         const data = await response.json();

//         if (data.error) {
//           setErrorMessage(data.error);
//           setImageUrls([]);
//         } else {
//           setImageUrls(data.output_arr);
//           setErrorMessage('');
//         }
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setErrorMessage('An error occurred while selecting the image');
//     }
  
//   };




//   return (
//     <> 
//     <View style={{ flexDirection: 'row', paddingHorizontal: 10 , margin:20  }}>
//       <TextInput
//         style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, borderRightWidth:0, paddingHorizontal: 10 ,borderTopLeftRadius:10,borderBottomLeftRadius:10 }}
//         placeholder="Search Any Product..."
//         onChangeText={text => setSearchText(text)}
//         value={searchText}
//         onSubmitEditing={handleSearch}
//       />
//       <TouchableOpacity onPress={pickImage} style={{ borderWidth:1,borderColor: 'gray', borderLeftWidth:0,borderRightWidth:0,paddingRight:10}}>
//         {/* <Image source={require('./../../assets/images/react-logo.png')} style={{ width: 24, height: 24 }} /> */}
//         <FontAwesome5 name="camera-retro" size={35} color="black" 
//          />
//       </TouchableOpacity>
//       <TouchableOpacity onPress={handleSearch} style={{  backgroundColor:Colors.PRIMARY, borderRadius: 10 ,borderTopLeftRadius:0,borderBottomLeftRadius:0 ,width:80}}>
//         <Text style={{ color: 'white' ,fontSize:18 ,textAlign:'center',textAlignVertical:'center' ,marginTop:5}}>Search</Text>
//       </TouchableOpacity>
//     </View>

    
//     <View style={{
//       backgroundColor:'gray',
//       flexWrap:'wrap',
      
//     }}>
//       <FlatList
//           data={imageUrls}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({ item }) => (
//             <Image source={{ uri: item }} style={styles.image} />
//           )}
//         />
//     <FlatList
//     data={urls}
//     renderItem={renderItem}
//     numColumns={2}
//     columnWrapperStyle={styles.row}
//     keyExtractor={(item, index) => index.toString()}
    
//     ListEmptyComponent={<View ><Text>No images found</Text></View>}
//   />
//   </View>
//   </>
//   );
// };

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listContainer: {
//     padding: 20,
//   },
//   imageContainer: {
//     backgroundColor: '#C7C8CC',
//     flex: 1,
//     margin: 2,
//     height: 250, // Increased height to accommodate text
//     maxWidth: '50%',
//     overflow: 'hidden',
//     elevation: 3, // for Android shadow
//     shadowColor: '#000', // for iOS shadow
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   image: {
//     flex: 1,
//     width: '100%',
//     height: '80%', // Adjust this value to leave space for text
//     backgroundColor: 'white',
//   },
//   productName: {
//     padding: 5,
//     fontSize: 20,
//     fontFamily:'Outfit',
//     textAlign:'center',
//     height: 40, // Fixed height for two lines of text
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection:'row',
//   },
//   row: {
//     flex: 1,
//     justifyContent: 'space-around',
//   },
// });