import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
//import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';

const CSVUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.csv],
      });
      setSelectedFile(result[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
        console.log('Document picking cancelled');
      } else {
        console.error('Error picking document:', err);
        Alert.alert('Error', 'An error occurred while picking the document.');
      }
    }
  };

  const uploadCSV = async () => {
    if (!selectedFile) {
      Alert.alert('No File Selected', 'Please select a CSV file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: selectedFile.uri,
      type: selectedFile.type,
      name: selectedFile.name,
    });

    try {
      const response = await axios.post('http://your-flask-server-url/upload-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload successful:', response.data);
      Alert.alert('Success', 'CSV file uploaded successfully!');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading CSV:', error);
      Alert.alert('Error', 'An error occurred while uploading the CSV file.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickDocument}>
        <Text style={styles.buttonText}>Select CSV File</Text>
      </TouchableOpacity>
      {selectedFile && (
        <Text style={styles.fileName}>Selected: {selectedFile.name}</Text>
      )}
      <TouchableOpacity
        style={[styles.button, styles.uploadButton]}
        onPress={uploadCSV}
        disabled={!selectedFile}
      >
        <Text style={styles.buttonText}>Upload CSV</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fileName: {
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#4CD964',
  },
});

export default CSVUploader;