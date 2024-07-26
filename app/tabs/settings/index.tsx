// Settings.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import { useRouter } from 'expo-router';
import { auth } from '../../../firebase/firebaseConfig';
import { logoutUser } from '../../../scripts/authFunctions';
import { useFocusEffect } from '@react-navigation/native';

const Settings: React.FC = () => {
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>('John Doe');

  useFocusEffect(
    useCallback(() => {
      if (auth.currentUser) {
        setDisplayName(auth.currentUser.displayName || 'John Doe');
      }
    }, [])
  );

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.profileTitle}>Your profile</Text>
      <View style={styles.profileContainer}>
        <Text style={styles.profileName}>{displayName}</Text>
      </View>
      <View style={styles.section}>
        <TouchableOpacity style={styles.row} onPress={() => router.push('/tabs/settings/account')}>
          <Ionicons name="happy-outline" size={24} color="#000" style={styles.rowIcon} />
          <Text style={styles.rowText}>Account</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => router.push('/tabs/settings/goals')}>
          <Foundation name="target" size={24} color="#000" style={styles.rowIcon} />
          <Text style={styles.rowText}>Goals</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <TouchableOpacity style={styles.row} onPress={() => router.push('/tabs/settings/notifications')}>
          <Ionicons name="notifications-outline" size={24} color="#000" style={styles.rowIcon} />
          <Text style={styles.rowText}>Notifications</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => router.push('/tabs/settings/limits')}>
          <Ionicons name="key-outline" size={24} color="#000" style={styles.rowIcon} />
          <Text style={styles.rowText}>Limits</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={[styles.row, styles.logoutRow]} onPress={handleLogout}>
        <Ionicons name="close-outline" size={24} color="red" style={styles.rowIcon} />
        <Text style={[styles.rowText, styles.logoutText]}>Log out</Text>
        <Ionicons name="chevron-forward-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 20,
  },
  profileName: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 5,
  },
  rowIcon: {
    marginRight: 15,
  },
  rowText: {
    flex: 1,
    fontSize: 16,
  },
  logoutRow: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  logoutText: {
    color: 'red',
  },
});

export default Settings;
