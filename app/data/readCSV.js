import React, { useState, useEffect } from 'react';
import { View, Image,Text, FlatList, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import axios from 'axios';

const { width } = Dimensions.get('window');
const imageWidth = width - 40; // Adjust this value for desired padding

const readCSV = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    fetchCSVData();
  }, []);

  const fetchCSVData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/readCSV');
      console.log('CSV Data:', response.data);
      
      // Assuming the URL is in a field called 'url' in your CSV
      const extractedUrls = response.data.map(item => item.URL).filter(Boolean);
      setUrls(extractedUrls);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching CSV data:', error);
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item }}
        style={styles.image}
        resizeMode="contain"
      />
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
    <FlatList
      data={urls}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={<View style={styles.emptyContainer}><Text>No images found</Text></View>}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 20,
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: 50,
    height: 50, // Adjust this if you want a different aspect ratio
    backgroundColor: '#f0f0f0', // Placeholder color while image loads
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default readCSV;