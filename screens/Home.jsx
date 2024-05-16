import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList} from 'react-native';
import { Avatar, Button, Divider, FAB, List, Searchbar } from 'react-native-paper';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { openDatabase } from 'react-native-sqlite-storage';
// import Icon from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons'; // or any other icon set you prefer


const db = openDatabase({ name: 'Contact.db' });

const Home = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterContactList, setFilterContactList] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, [isFocused]);

  const fetchContacts = () => {
    db.transaction((txn) => {
      txn.executeSql('SELECT * FROM contacts', [], (_, { rows }) => {
        const contactList = [];
        for (let i = 0; i < rows.length; i++) {
          contactList.push(rows.item(i));
        }
        setContacts(contactList);
        setFilterContactList(contactList);
      });
    });
  };

  const deleteContact = (id) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM contacts WHERE id=?',
        [id],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            fetchContacts();
          } else {
            Alert.alert('Please insert a valid Contact Id');
          }
        },
      );
    });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilterContactList(filtered);
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Searchbar
        placeholder="Search"
        onChangeText={handleSearch}
        value={searchQuery}
        style={{ flex: 1, marginRight: 8 }}
      >
        </Searchbar>
      
       <Button
          
          mode="text"
          onPress={() => navigation.navigate('FavouriteContact')}
          style={[styles.favouriteButton, { color: 'black' }]}
        >
            ❤️Favourite Contact
        </Button>




        </View>
      <List.Section>
        <FlatList
          data={filterContactList}
          renderItem={({ item }) => (
            <List.Item
              title={item.name}
              description={`Mobile: ${item.mobile}\nLandline: ${item.landline}`}
              left={() => (
                <Avatar.Image
                  size={48}
                  source={item.photo ? { uri: item.photo } : require('../images/image.png')}
                />
              )}
              right={() => (
                <View style={styles.buttonContainer}>
                  <Button
                    onPress={() => navigation.navigate('UpdateContact', { contactData: item })}
                  >
                     ✏️
                    </Button>
                  <Button
                    
                    onPress={() => deleteContact(item.id)}
                  >
                    🗑️
                    </Button>
                </View>
              )}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={Divider}
        />
      </List.Section>
      <FAB
        label="Add" // Optional label for accessibility
        style={styles.fab}
        onPress={() => navigation.navigate('CreateContact')}
/>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'antiquewhite',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  favouriteButton: {
    marginLeft: 'auto', 
    
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor:'green',
  },
});

export default Home;
