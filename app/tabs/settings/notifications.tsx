// Notifications.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Dimensions, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { auth, db } from '../../../firebase/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const Notifications: React.FC = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    every10Minutes: false,
    appUse25: false,
    appUse50: false,
    appUse75: false,
    appUse95: false,
    encouragements: false,
    streaks: false,
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'settings', auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data().notifications || {};
          setNotifications({
            every10Minutes: data.every10Minutes || false,
            appUse25: data.appUse25 || false,
            appUse50: data.appUse50 || false,
            appUse75: data.appUse75 || false,
            appUse95: data.appUse95 || false,
            encouragements: data.encouragements || false,
            streaks: data.streaks || false,
          });
        }
      }
    };

    fetchNotifications();
  }, []);

  const handleToggle = async (key: string, value: boolean) => {
    const newNotifications = { ...notifications, [key]: value };
    setNotifications(newNotifications);

    if (auth.currentUser) {
      const userDocRef = doc(db, 'settings', auth.currentUser.uid);
      await updateDoc(userDocRef, { notifications: newNotifications });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="#000" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Notifications</Text>
      <View style={styles.notificationRow}>
        <Text style={styles.notificationText}>Every 10 minutes of use</Text>
        <Switch
          value={notifications.every10Minutes}
          onValueChange={(value) => handleToggle('every10Minutes', value)}
        />
      </View>
      <View style={styles.notificationRow}>
        <Text style={styles.notificationText}>25% app use</Text>
        <Switch
          value={notifications.appUse25}
          onValueChange={(value) => handleToggle('appUse25', value)}
        />
      </View>
      <View style={styles.notificationRow}>
        <Text style={styles.notificationText}>50% app use</Text>
        <Switch
          value={notifications.appUse50}
          onValueChange={(value) => handleToggle('appUse50', value)}
        />
      </View>
      <View style={styles.notificationRow}>
        <Text style={styles.notificationText}>75% app use</Text>
        <Switch
          value={notifications.appUse75}
          onValueChange={(value) => handleToggle('appUse75', value)}
        />
      </View>
      <View style={styles.notificationRow}>
        <Text style={styles.notificationText}>95% app use</Text>
        <Switch
          value={notifications.appUse95}
          onValueChange={(value) => handleToggle('appUse95', value)}
        />
      </View>
      <View style={styles.notificationRow}>
        <Text style={styles.notificationText}>Encouragements</Text>
        <Switch
          value={notifications.encouragements}
          onValueChange={(value) => handleToggle('encouragements', value)}
        />
      </View>
      <View style={styles.notificationRow}>
        <Text style={styles.notificationText}>Streaks</Text>
        <Switch
          value={notifications.streaks}
          onValueChange={(value) => handleToggle('streaks', value)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: 'lightgray',
    borderRadius: 10,
    padding: 10,
    paddingVertical: 2.5,
  },
  notificationText: {
    fontSize: 16,
    color: '#000',
  },
});

export default Notifications;
