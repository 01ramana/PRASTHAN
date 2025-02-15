import React from 'react';
import { View, StyleSheet, TextInput, Alert, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import axios from 'axios';

function Login(props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  // Make the function async to use await for axios request
  const SignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Validation Error", "Please enter both email/username and password.");
      return;
    }
    
    try {
      // Make an API request to the backend to login the user
      const response = await axios.post('http://localhost:4444/user/login', {
        email,
        password,
      });

      if (response.data.status === 'success') {
        props.navigation.navigate('go-booklist');
      } else {
        Alert.alert('Login Failed', response.data.message);
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again later.');
      console.error(err);
    }
  };

  const RegisterHere = () => {
    props.navigation.navigate("go-register");
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      
      <Text style={styles.title}>Login Page</Text>
      <TextInput
        style={styles.input}
        placeholder="Email or Username"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={SignIn}
        style={[styles.button, styles.signInButton]}
        labelStyle={styles.buttonText}
      >
        Sign In
      </Button>
      <Text style={styles.note}>
        Not registered yet?{' '}
        <Text style={styles.link} onPress={RegisterHere}>
          Register here
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f8fc',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#4a4e69',
  },
  logo: {
    width: 150, // Adjust as needed
    height: 150, // Adjust as needed
    marginBottom: 20,
  },
  
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    borderColor: '#c9ada7',
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  button: {
    width: '80%',
    paddingVertical: 10,
    marginBottom: 15,
    borderRadius: 25,
  },
  signInButton: {
    backgroundColor: '#9a8c98',
  },
  buttonText: {
    fontSize: 16,
  },
  note: {
    fontSize: 14,
    color: '#4a4e69',
    marginTop: 10,
  },
  link: {
    color: '#9a8c98',
    textDecorationLine: 'underline',
  },
});

export default Login;
