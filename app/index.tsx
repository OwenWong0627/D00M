import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SplashScreen } from "expo-router";

const App: React.FC = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/onboarding'); // Use replace to clear the navigation stack
  };

  const handleSignIn = () => {
    router.push('/signin'); // Adjust the path to your sign-in screen
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/D00M-icon.png')} style={styles.image} />
      <Text style={styles.welcome}>Welcome to D00M!</Text>
      <Text style={styles.message}>
        We're thrilled you've chosen to embark on a journey to reduce your screen time.
      </Text>
      <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
        <Text style={styles.getStartedButtonText}>Let’s get started!</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
        <Text style={styles.signInText}>Already have an account? <Text style={styles.signInLink}>Sign in</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 50,
  },
  welcome: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginBottom: 65,
  },
  getStartedButton: {
    backgroundColor: '#eee',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  getStartedButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  signInButton: {
    position: 'absolute',
    bottom: 30,
  },
  signInText: {
    fontSize: 16,
    color: 'red',
  },
  signInLink: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});

export default App;
