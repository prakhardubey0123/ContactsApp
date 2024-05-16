import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import { Avatar, Divider, List } from 'react-native-paper';

let db = openDatabase({ name: 'Contact.db' })

const Favourites = () => {
  const isFocused = useIsFocused()
  const [contactList, setContactList] = useState([])

  useEffect(() => {
    fetchData()
  }, [isFocused])

  const fetchData = () => {
    db.transaction((txn) => {
      txn.executeSql('SELECT * FROM contacts', [], (txn, results) => {
        let temp = []
        for (let i = 0; i < results.rows.length; ++i)
          if (results.rows.item(i).isFavorite > 0)
            temp.push(results.rows.item(i))
        setContactList(temp)
      })
    })
  }

  return (
    <View style={styles.container}>
      <List.Section>
        <FlatList
          data={contactList}
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
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={Divider}
        />
      </List.Section>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: 'antiquewhite',
  },
});

export default Favourites;
