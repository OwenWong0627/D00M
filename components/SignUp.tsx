import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { registerUser } from '../scripts/authFunctions';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface SignUpProps {
  scrollToNext: () => void;
  scrollForward: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ scrollToNext, scrollForward }) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [doPasswordsMatch, setDoPasswordsMatch] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSignIn = () => {
    router.replace('/signin');
  };

  useEffect(() => {
    setIsEmailValid(validateEmail(email));
    setIsPasswordValid(validatePassword(password));
    setDoPasswordsMatch(password === confirmPassword);
  }, [email, password, confirmPassword]);

  useEffect(() => {
    setIsFormValid(isEmailValid && isPasswordValid && doPasswordsMatch && isAgreed && displayName.trim().length > 0);
  }, [isEmailValid, isPasswordValid, doPasswordsMatch, isAgreed, displayName]);

  const handleSignUp = async () => {
    if (!isFormValid) {
      Alert.alert('Error', 'Please fill all the fields correctly and agree to the terms.');
      return;
    }

    try {
      await registerUser(email, password, displayName);
      scrollToNext();
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={scrollForward}>
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Create an account</Text>
      <TextInput
        style={styles.input}
        placeholder="Display Name"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {email.length !== 0 && !isEmailValid && <Text style={styles.errorText}>Please enter a valid email address.</Text>}
      <TextInput
        style={styles.input}
        placeholder="Password (at least 8 characters)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {password.length !== 0 && !isPasswordValid && <Text style={styles.errorText}>Password must be at least 8 characters long.</Text>}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {confirmPassword.length !== 0 && !doPasswordsMatch && <Text style={styles.errorText}>Passwords do not match.</Text>}
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
      <View style={styles.signInButtonContainer}>
        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInText}>Already have an account? <Text style={styles.signInLink}>Sign in</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    flex: 1,
    padding: 20,
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
    marginBottom: 5,
    backgroundColor: '#f9f9f9',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
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
  signInButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  signInButton: {
    alignItems: 'center',
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

export default SignUp;
