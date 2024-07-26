import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth, db } from '../firebase/firebaseConfig';
import { loginUser } from '../scripts/authFunctions';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const userCredential = await loginUser(email, password);

      const currentDate = new Date().toLocaleDateString();
      const screenTimeDocRef = doc(db, 'screenTimeData', userCredential.uid);
      const screenTimeDocSnap = await getDoc(screenTimeDocRef);

      if (screenTimeDocSnap.exists()) {
        const dailyData = screenTimeDocSnap.data().dailyData;
        const todayData = dailyData.find((data: any) => data.date.toDate().toLocaleDateString() === currentDate.toString());

        if (!todayData) {
          console.log('No data found for today.')
          const settingsDocRef = doc(db, 'settings', userCredential.uid);
          const settingsDocSnap = await getDoc(settingsDocRef);

          if (settingsDocSnap.exists()) {
            const appLimits = settingsDocSnap.data().appLimits;
            const newScreenTimeData = {
              date: new Date(),
              totalScreenTime: appLimits.reduce((acc: number, app: { limit: number }) => acc + app.limit, 0),
              appUsage: appLimits.map((limit: any) => ({
                app: limit.app,
                used: 0,
                limit: limit.limit,
              })),
            };
            console.log(newScreenTimeData)

            await setDoc(screenTimeDocRef, {
              dailyData: [...dailyData, newScreenTimeData],
            }, { merge: true });
          } else {
            console.log('No settings document found.');
          }
        }
      } else {
        console.log('No screenTimeData document found.');
      }

      router.replace('/tabs/home'); // Navigate to the dashboard or home screen
    } catch (error) {
      Alert.alert('Error', 'Invalid email or password');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Sign In</Text>
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
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.signInButton}
        onPress={handleSignIn}
      >
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
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
  signInButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignIn;
