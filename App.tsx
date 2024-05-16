import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AddContact from './screens/AddContact';
import Favourites from './screens/Favourites';
import Home from './screens/Home';
import Updates from './screens/Updates';

const App = () => {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ContactHome"
      screenOptions={{
        headerStyle: { backgroundColor: 'green' }, // Set background color of header
      }}>
        <Stack.Screen
          name="ContactHome"
          component={Home}
          options={{ title: 'Home' }}
        />
        <Stack.Screen
          name="CreateContact"
          component={AddContact}
          options={{ title: 'Create Contact' }}
        />
        <Stack.Screen
          name="FavouriteContact"
          component={Favourites}
          options={{ title: 'Favourite Contact' }}
        />
        <Stack.Screen
          name="UpdateContact"
          component={Updates}
          options={{ title: 'Update Contact' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
