import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  useEffect(() => {
    setIsEmailValid(validateEmail(email));
    setIsPasswordValid(validatePassword(password));
  }, [email, password]);

  useEffect(() => {
    setIsFormValid(isEmailValid && isPasswordValid && isAgreed);
  }, [isEmailValid, isPasswordValid, isAgreed]);

  const handleSignUp = () => {
    if (!isFormValid) {
      Alert.alert('Error', 'Please fill all the fields correctly and agree to the terms.');
      return;
    }
    // Navigate to success page
    router.push('/success');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Create an account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password (at least 8 characters)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.agreementContainer}>
        <TouchableOpacity onPress={() => setIsAgreed(!isAgreed)} style={styles.checkbox}>
          {isAgreed && <View style={styles.checked} />}
        </TouchableOpacity>
        <Text style={styles.agreementText}>
          I agree to the Terms & Conditions and Privacy Policy
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.signUpButton, isFormValid && styles.signUpButtonEnabled]}
        onPress={handleSignUp}
        disabled={!isFormValid}
      >
        <Text style={[styles.signUpButtonText, isFormValid && styles.signUpButtonTextEnabled]}>Sign up</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>Or sign up with</Text>
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialButtonText}></Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialButtonText}>G</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialButtonText}>f</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 24,
    color: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderColor: '#000',
    borderWidth: 1,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    width: 12,
    height: 12,
    backgroundColor: '#000',
  },
  agreementText: {
    fontSize: 14,
    color: '#000',
  },
  signUpButton: {
    backgroundColor: '#ccc',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  signUpButtonEnabled: {
    backgroundColor: '#000',
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpButtonTextEnabled: {
    color: '#fff',
  },
  orText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    backgroundColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  socialButtonText: {
    fontSize: 24,
    color: '#000',
  },
});

export default SignUp;
