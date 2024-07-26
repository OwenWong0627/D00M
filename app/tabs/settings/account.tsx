import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, db, updateProfile } from '../../../firebase/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

const Account: React.FC = () => {
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);
  const [doPasswordsMatch, setDoPasswordsMatch] = useState<boolean>(true);

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  useEffect(() => {
    setIsPasswordValid(validatePassword(password));
    setDoPasswordsMatch(password === confirmPassword);
  }, [email, password, confirmPassword]);

  useFocusEffect(
    useCallback(() => {
      if (auth.currentUser) {
        setDisplayName(auth.currentUser.displayName || '');
        setEmail(auth.currentUser.email || '');
      }
    }, [])
  );

  const handleUpdateProfile = async () => {
    try {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);

        // Update display name
        if (displayName !== auth.currentUser.displayName) {
          await updateProfile(auth.currentUser, { displayName });
          await updateDoc(userDocRef, { name: displayName });
        }

        // Update password
        if (password) {
          await updatePassword(auth.currentUser, password);
        }

        Alert.alert('Success', 'Profile updated successfully', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Settings</Text>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, styles.disabledInput]}
        value={email}
        editable={false}
      />
      <Text style={styles.label}>Display Name</Text>
      <TextInput
        style={styles.input}
        value={displayName}
        onChangeText={setDisplayName}
      />
      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {password.length !== 0 && !isPasswordValid ? <Text style={styles.errorText}>Password must be at least 8 characters long.</Text> : null}
      <Text style={styles.label}>Confirm New Password</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {confirmPassword.length !== 0 && !doPasswordsMatch ? <Text style={styles.errorText}>Passwords do not match</Text> : null}
      <Button title="Update Profile" onPress={handleUpdateProfile} />
      <Button title="Back" onPress={() => router.back()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});

export default Account;
