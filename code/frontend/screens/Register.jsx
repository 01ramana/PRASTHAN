import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, Dimensions } from 'react-native';
import { Text, Button } from 'react-native-paper';
import axios from 'axios';

function Register(props) {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { width } = Dimensions.get('window');

  // Register user function with Axios API call
  const registerUser = async () => {
    if (!first_name.trim() || !last_name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match.");
      return;
    }

    try {
      // Send registration request to backend API
      const response = await axios.post('http://localhost:4444/user/register', {
        first_name,
        last_name,
        email,
        password,
      });

      // Check if registration was successful
      if (response.data.status === 'success') {
        Alert.alert("Success", "Registration successful!");
        props.navigation.navigate("go-login"); // Navigate to login page after successful registration
      } else {
        Alert.alert("Error", response.data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      Alert.alert("Error", "An error occurred while registering. Please try again.");
    }
  };

  const navigateToLogin = () => {
    props.navigation.navigate("go-login");
  };

  return (
    <View style={[styles.container, { padding: width * 0.05 }]}>
      <Text style={[styles.title, { fontSize: width * 0.06 }]}>Register Here</Text>

      {/* Input fields */}
      <TextInput
        style={[styles.input, { width: width * 0.8 }]}
        placeholder="First Name"
        value={first_name}
        onChangeText={setFirstName}
      />
      <TextInput
        style={[styles.input, { width: width * 0.8 }]}
        placeholder="Last Name"
        value={last_name}
        onChangeText={setLastName}
      />
      <TextInput
        style={[styles.input, { width: width * 0.8 }]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { width: width * 0.8 }]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={[styles.input, { width: width * 0.8 }]}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {/* Register Button */}
      <Button
        mode="contained"
        onPress={registerUser}
        style={[styles.button, styles.registerButton, { width: width * 0.8 }]}
        labelStyle={styles.buttonText}
      >
        Register Me
      </Button>

      {/* Navigate to Login */}
      <Text style={[styles.note, { fontSize: width * 0.035 }]}>
        Already registered?{' '}
        <Text style={styles.link} onPress={navigateToLogin}>
          Login here
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
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#4a4e69',
  },
  input: {
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    borderColor: '#c9ada7',
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  button: {
    paddingVertical: 10,
    marginBottom: 15,
    borderRadius: 25,
  },
  registerButton: {
    backgroundColor: '#9a8c98',
  },
  buttonText: {
    fontSize: 16,
  },
  note: {
    color: '#4a4e69',
    marginTop: 10,
  },
  link: {
    color: '#9a8c98',
    textDecorationLine: 'underline',
  },
});

export default Register;
