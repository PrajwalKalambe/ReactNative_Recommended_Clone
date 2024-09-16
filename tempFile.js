import React, { useEffect, useState } from 'react';
import { View, Image, Text, FlatList, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors'
import { useNavigation } from 'expo-router';
import axios from 'axios';

export default SearchComponent = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'USER PORTAL',
    
    })
  }, [])

  useEffect(() => {
    fetchCSVData();
  }, []);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });


      setSearchText(result.assets[0].fileName);
      setSelectedImage(result.assets[0].fileName);
    
    } catch (error) {
      console.log('Error picking image: ', error);
    }
  };

 
  const handleSearch = async () => {
    setIsLoading(true);
  
    try {

      const data = {
        searchText: searchText,
        selectedImage: selectedImage
      };
      const response = await axios.post('http://127.0.0.1:5000/visionARN', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.data.message) {
        Alert.alert('Message', response.data.message);
        setUrls([]);
      } else {
        const extractedData = response.data.map(item => ({
          url: item.URL,
          name: item.PRODUCT_NAME
        })).filter(item => item.url && item.name);
        setUrls(extractedData);
      }
    } catch (error) {
      console.error('Error searching:', error);
      Alert.alert('Error', 'An error occurred while searching.');
    } finally {
      setIsLoading(false);
      setSelectedImage(null);
      setSearchText('');
    }
  };

  const fetchCSVData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/readCSV');
      console.log('CSV Data:', response.data);
      
      const extractedData = response.data.map(item => ({
        url: item.URL,
        name: item.PRODUCT_NAME
      })).filter(item => item.url && item.name);
      setUrls(extractedData);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching CSV data:', error);
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image 
        source={{ uri: item.url }}
        style={styles.image}
        resizeMode="contain" 
      />
      <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
        {item.name}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={{ flexDirection: 'row', paddingHorizontal: 10, margin: 20 }}>
        <TextInput
          style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, borderRightWidth: 0, paddingHorizontal: 10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}
          placeholder="Search Any Product..."
          onChangeText={text => setSearchText(text)}
          value={searchText}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={pickImage} value={selectedImage} style={{ borderWidth: 1, borderColor: 'gray', borderLeftWidth: 0, borderRightWidth: 0, paddingRight: 10 }}>
          <FontAwesome5 name="camera-retro" size={35} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSearch} style={{ backgroundColor: Colors.PRIMARY, borderRadius: 10, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, width: 80 }}>
          <Text style={{ color: 'white', fontSize: 18, textAlign: 'center', textAlignVertical: 'center', marginTop: 5 }}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.flatListContainer}>
        <FlatList
          data={urls}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={<View><Text>No images found</Text></View>}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  flatListContainer: {
    height: 600, // Adjust this value as needed
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 20,
  },
  imageContainer: {
    backgroundColor: '#C7C8CC',
    flex: 1,
    margin: 2,
    height: 250,
    maxWidth: '50%',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '80%',
    backgroundColor: 'white',
  },
  productName: {
    padding: 5,
    fontSize: 20,
    fontFamily: 'Outfit',
    textAlign: 'center',
    height: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
  },
});