import React, { useState } from 'react';
import { Alert, Button, TextInput, Text, View } from 'react-native';

interface LoginProps {
  navigation: any;
}

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
        const response = await fetch('http://10.0.2.2:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password
          }),
        });
  
        if (response.ok) {
            navigation.navigate('CustomerList');
        } else {
            Alert.alert('Authentication Error', 'Invalid Credentials', [
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
    <View style={{ paddingTop: 200, paddingRight: 20, paddingLeft: 20 }}>
      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Username</Text>
        <TextInput
          style={{ fontSize: 18 }}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter username"
        />
      </View>
      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Password</Text>
        <TextInput
          style={{ fontSize: 18 }}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          secureTextEntry={true}
        />
      </View>
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default Login;
