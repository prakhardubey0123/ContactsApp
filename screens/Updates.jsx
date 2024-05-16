import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, View, Text } from 'react-native';
import { Avatar, Button, IconButton, TextInput } from 'react-native-paper';
import { openDatabase } from 'react-native-sqlite-storage';
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useNavigation, useRoute } from '@react-navigation/native';

let db = openDatabase({ name: 'Contact.db' });

const Updates = () => {
    const route = useRoute();
    const navigation = useNavigation();
    console.log(route.params.contactData);

    const [name, setName] = useState(route.params.contactData.name);
    const [mobile, setMobile] = useState(route.params.contactData.mobile);
    const [landline, setLandline] = useState(route.params.contactData.landline);
    const [photo, setPhoto] = useState(route.params.contactData.photo);
    const [isFavorite, setIsFavorite] = useState(route.params.contactData.isFavorite);

    const [nameError, setNameError] = useState('');
    const [mobileError, setMobileError] = useState('');
    const [landlineError, setLandlineError] = useState('');

    const updateContact = () => {
        let isValid = true;

        // Validation for Name
        if (!name.trim()) {
            setNameError('Please enter the name');
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
            db.transaction(tx => {
                tx.executeSql(
                    'UPDATE contacts set name=?, mobile=?, landline=?, isFavorite=?, photo=? where id=?',
                    [name, mobile, landline, isFavorite ? 1 : 0, photo, route.params.contactData.id],
                    (tx, results) => {
                        console.log('Results', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                            Alert.alert(
                                'Success',
                                'User updated successfully',
                                [
                                    {
                                        text: 'Ok',
                                        onPress: () => navigation.navigate('ContactHome'),
                                    },
                                ],
                                { cancelable: false },
                            );
                        } else Alert.alert('Updation Failed');
                    },
                );
            });
        }
    };

    useEffect(() => {
        setName(route.params.contactData.name);
        setMobile(route.params.contactData.mobile);
        setLandline(route.params.contactData.landline);
        setPhoto(route.params.contactData.photo);
        setIsFavorite(route.params.contactData.isFavorite);
    }, []);

    const selectPhotoFromGallery = () => {
        let options = {
            mediaType: 'photo',
            maxWidth: 300,
            maxHeight: 550,
            quality: 1,
            includeBase64: true
        };
        launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log(response.error);
            } else {
                const imageUri = `data:${response.assets[0].type};base64,${response.assets[0].base64}`;
                setPhoto(imageUri);
            }
        });
    };

    const selectPhotoFromCamera = () => {
        let options = {
            mediaType: 'photo',
            maxWidth: 300,
            maxHeight: 550,
            quality: 1,
            includeBase64: true
        };
        launchCamera(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log(response.error);
            } else {
                const imageUri = `data:${response.assets[0].type};base64,${response.assets[0].base64}`;
                setPhoto(imageUri);
            }
        });
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
                        onPress={selectPhotoFromCamera}
                        style={styles.photoButton}
                    >
                        Camera
                    </Button>
                    <Button
                        icon='folder'
                        mode="contained"
                        onPress={selectPhotoFromGallery}
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
                keyboardType="phone-pad"
                style={styles.input}
            />
            {mobileError ? <Text style={styles.error}>{mobileError}</Text> : null}
            <TextInput
                label="☎️Landline number"
                value={landline}
                onChangeText={text => setLandline(text)}
                keyboardType="phone-pad"
                style={styles.input}
            />
            {landlineError ? <Text style={styles.error}>{landlineError}</Text> : null}
            <IconButton
                icon={isFavorite ? 'heart' : 'heart-outline'}
                onPress={() => setIsFavorite(!isFavorite)}
                style={styles.favoriteButton}
            />
            <Button
                mode="contained"
                onPress={updateContact}
                style={styles.saveButton}
            >
                Update 
            </Button>
        </View>
    );
};

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
        backgroundColor:'green',
    },
    input: {
        marginBottom: 16,
    },
    favoriteButton: {
        position: 'absolute',
        top: 16,
        right: 16,
    },
    saveButton: {
        marginTop: 'auto',
        backgroundColor:'green'
    },
    error: {
        color: 'red',
    },
});

export default Updates;
