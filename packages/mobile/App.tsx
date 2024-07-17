import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import Login from './screens/login';
import CustomerList from './screens/customerList';
import CustomerData from './screens/customerData';
import LogoutButton from './screens/logout';

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CustomerList"
          component={CustomerList}
          options={({ navigation }) => ({
            headerBackVisible: false,
            title: "Customer Data",
            headerRight: () => <LogoutButton navigation={navigation} />, // Custom component for logout button
          })}
        />
        <Stack.Screen
          name="CustomerData"
          component={CustomerData}
          options={{
            title: "Customer Details",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;