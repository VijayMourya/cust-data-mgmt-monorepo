import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';

const LogoutButton = ({navigation}: {navigation: any}) => {
  const handleLogout = async () => {
    try {
        const response = await fetch('http://10.0.2.2:3000/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
  
        if (response.ok) {
            Alert.alert('Logout', 'Logged out successfully', [
                {text: 'OK', onPress: () => navigation.navigate('Login')},
            ]);
        } else {
            Alert.alert('Logout Error', 'Encountered an issue while logging out', [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ]);
        }
    } catch (error: any) {
        Alert.alert('Network Error', error.message, [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
    }
  };

  return (
    <TouchableOpacity onPress={handleLogout}>
      <Text style={{ marginRight: 10, color: 'black' }}>Logout</Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;