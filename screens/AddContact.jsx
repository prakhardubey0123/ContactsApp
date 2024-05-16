import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text } from 'react-native';
import { Avatar, Button, IconButton, TextInput } from 'react-native-paper';
import { openDatabase } from 'react-native-sqlite-storage';
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-paper/lib/typescript/components/Avatar/Avatar';

let db = openDatabase({ name: 'Contact.db' });

const AddContact = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [landline, setLandline] = useState('');
  const [photo, setPhoto] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const [nameError, setNameError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [landlineError, setLandlineError] = useState('');

  const handleSave = () => {
    let isValid = true;

    // Validation for Name
    const nameRegex = /^[a-zA-Z0-9!@#$%^&*]{1,50}$/;
    if (!name.trim()) {
      setNameError('Please enter the name');
      isValid = false;
    } else if (!nameRegex.test(name)) {
      setNameError('Name must be maximum 50 characters long');
      isValid = false;
    } else {
      setNameError('');
    }

    // Validation for Mobile number
    if (!mobile.trim() && isNaN(Number(mobile)) || mobile.length !== 10) {
      setMobileError('Please enter a valid 10-digit mobile number');
      isValid = false;
    } else {
      setMobileError('');
    }

    // Validation for Landline number
    if (landline.trim() && isNaN(Number(landline)) || landline.length !== 10) {
      setLandlineError('Please enter a valid 10-digit landline number');
      isValid = false;
    } else {
      setLandlineError('');
    }
    if (isValid) {
      setNameError('');
      setMobileError('');
      setLandlineError('');
  }

    if (isValid) {
      db.transaction((tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20), mobile VARCHAR(10), landline VARCHAR(10), photo TEXT, isFavorite BOOLEAN DEFAULT 0)',
          [],
          () => {
            tx.executeSql(
              'INSERT INTO contacts (name, mobile, landline, photo, isFavorite) VALUES (?, ?, ?, ?, ?)',
              [name, mobile, landline, photo, isFavorite ? 1 : 0],
              (_, results) => {
                if (results.rowsAffected > 0) {
                  Alert.alert(
                    'Success',
                    'Contact created successfully!',
                    [
                      {
                        text: 'OK',
                        onPress: () => navigation.navigate('ContactHome'),
                      },
                    ],
                    { cancelable: false }
                  );
                } else {
                  console.log('Failed to insert contact');
                }
              },
              (error) => {
                console.log('Error executing SQL:', error);
              }
            );
          },
          (error) => {
            console.log('Error creating table:', error);
          }
        );
      });
    }
  };

  const selectPhotoFromGallery = () => {
    let options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      includeBase64: true
    }
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      }
      else if (response.error) {
        console.log(response.error)
      }
      else {
        const imageUri = `data:${response.assets[0].type};base64,${response.assets[0].base64}`
        setPhoto(imageUri)
      }
    })
  }

  const selectPhotoFromCamera = () => {
    let options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      includeBase64: true
    }
    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      }
      else if (response.error) {
        console.log(response.error)
      }
      else {
        const imageUri = `data:${response.assets[0].type};base64,${response.assets[0].base64}`
        setPhoto(imageUri)
      }
    })
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <View style={styles.container}>
      <View style={styles.photoContainer}>
        <Avatar.Image
          size={100}
          source={photo ? { uri: photo } : require('../images/image.png')}
        />
        <View style={styles.photoButtons}>
          <Button
            icon='camera'
            mode="contained"
            onPress={() => selectPhotoFromCamera()}
            style={styles.photoButton}
          >
            Camera
          </Button>
          <Button
            icon='folder'
            mode="contained"
            onPress={() => selectPhotoFromGallery()}
            style={styles.photoButton}
          >
            Gallery
          </Button>
        </View>
      </View>
      <TextInput
        label="👤Name"
        value={name}
        onChangeText={text => setName(text)}
        style={styles.input}
      />
      {nameError ? <Text style={styles.error}>{nameError}</Text> : null}
      <TextInput
        label="📞Mobile number"
        value={mobile}
        onChangeText={text => setMobile(text)}
        keyboardType="numeric"
        style={styles.input}
      />
      {mobileError ? <Text style={styles.error}>{mobileError}</Text> : null}
      <TextInput
        label="☎️Landline number"
        value={landline}
        onChangeText={text => setLandline(text)}
        keyboardType="numeric"
        style={styles.input}
      />
      {landlineError ? <Text style={styles.error}>{landlineError}</Text> : null}
      <IconButton
        icon={isFavorite ? 'heart' : 'heart-outline'}
        onPress={handleToggleFavorite}
        style={styles.favoriteButton}
        color={isFavorite ? 'red' : undefined}
      />
      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.saveButton}
      >
        Save
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'antiquewhite',
  },
  photoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  photoButtons: {
    marginLeft: 16,
  },
  photoButton: {
    marginVertical: 8,
    backgroundColor:'green'
},
input: {
  marginBottom: 16,
},
favoriteButton: {
  alignSelf: 'center',
  marginBottom: 16,
  
  
},
saveButton: {
  marginTop: 32,
  backgroundColor:'green'
},
error: {
  color: 'red',
  marginBottom: 16,
},
});

export default AddContact;
