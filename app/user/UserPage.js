import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation, useRouter } from 'expo-router';

const Drawer = createDrawerNavigator();
const router=useRouter();

    

// Define your categories and subcategories
const categories = [
  {
    name: 'Topwear',
    subcategories: ['Shirt', 'T-Shirt']
  },
  {
    name: 'Footwear',
    subcategories: ['Shoe', 'Sandal','Socks']
  },
  {
    name: 'Grooming Product',
    subcategories: ['Watch','necklace','sunglass','bracelet']
  },
  {
    name: 'Gadgets',
    subcategories: ['Mobile', 'TV', 'Speaker','headset','speaker']
  },
  {
    name: 'Bagpacks',
    subcategories: ['Bag','Bottle','Pen']
  }
];

function CustomDrawerContent({ navigation }) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = (categoryName) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  const navigateToSubcategory = (subcategory) => {
    navigation.navigate('CategoryScreen', { category: subcategory.toLowerCase() });
  };

  return (
    <DrawerContentScrollView>
      <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.drawerItemText}>Home</Text>
      </TouchableOpacity>
      {categories.map((category) => (
        <View key={category.name}>
          <TouchableOpacity style={styles.drawerItem} onPress={() => toggleCategory(category.name)}>
            <Text style={styles.drawerItemText}>{category.name}</Text>
            <FontAwesome5 name={expandedCategory === category.name ? 'chevron-up' : 'chevron-down'} size={20} />
          </TouchableOpacity>
          {expandedCategory === category.name && (
            <View style={styles.subcategoryContainer}>
              {category.subcategories.map((subcategory) => (
                <TouchableOpacity
                  key={subcategory}
                  style={styles.subcategoryItem}
                  onPress={() => navigateToSubcategory(subcategory)}
                >
                  <Text style={styles.subcategoryText}>{subcategory}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}

<TouchableOpacity onPress={()=>router.push('')}
      style={styles.logoutButton}><Text style={styles.logoutButtonText}>LOGOUT</Text></TouchableOpacity>
    </DrawerContentScrollView>
  );
}

function SearchComponent({ route }) {
  const initialCategory = route.params?.category || '';
  const [searchText, setSearchText] = useState(initialCategory);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    if (initialCategory) {
      handleSearch(initialCategory);
    } else {
      fetchCSVData();
    }
  }, [initialCategory]);

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

      if (!result.canceled) {
        setSearchText(result.assets[0].fileName);
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking image: ', error);
    }
  };

  // -----------------Search Product-----------------
  const handleSearch = async (category = searchText) => {
    setIsLoading(true);

    try {
      const data = {
        searchText: category,
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
      if (!initialCategory) setSearchText('');
    }
  };


  // --------------Show All Product on Screen----------
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
   //------------ Rendering url link to photo on screen------
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
  //------------ Loader -------------------------
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Any Product..."
          onChangeText={text => setSearchText(text)}
          value={searchText}
          onSubmitEditing={() => handleSearch()}
        />
        <TouchableOpacity onPress={pickImage} style={styles.cameraButton}>
          <FontAwesome5 name="camera-retro" size={35} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSearch()} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
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
}

function DrawerNavigation() {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={SearchComponent} />
      <Drawer.Screen name="CategoryScreen" component={SearchComponent} />
    </Drawer.Navigator>
  );
}

export default function App() {
  
  return (
    <NavigationContainer independent={true}>
      <DrawerNavigation />
    </NavigationContainer>
  );
}

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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    margin: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRightWidth: 0,
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  cameraButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingRight: 10,
    justifyContent: 'center',
  },
  searchButton: {
    backgroundColor: 'black', // Replace with your primary color
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 18,
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
  row: {
    flex: 1,
    justifyContent: 'space-around',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  drawerItemText: {
    fontSize: 18,
  },
  subcategoryContainer: {
    paddingLeft: 30,
  },
  subcategoryItem: {
    padding: 10,
  },
  subcategoryText: {
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: 'black',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:373
  },
  logoutButtonText: {
    fontFamily: 'outfit-Bold',
    fontSize: 17,
    color: 'white',
  },
});