import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import TrendsGraph from '../../../components/TrendsGraph'; // Adjust the import path as necessary
import MotivationBottomDrawer from '../../../components/MotivationBottomDrawer'; // Adjust the import path as necessary

const FriendStats: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; name: string; streak: string; image: any }>();
  const { name, streak, image } = params;
  const [isDrawerVisible, setDrawerVisible] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-outline" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Leaderboard</Text>
      <Image source={image} style={styles.profileImage} />
      <Text style={styles.name}>{name}</Text>
      <View style={styles.streakField}>
        <Text style={styles.streak}>{streak}</Text>
        <Image source={require('../../../assets/images/fire.png')} style={styles.fireImage} />
      </View>
      <Text style={styles.screenTimeTitle}>SCREEN TIME</Text>
      <View style={styles.trendsGraph}>
        <TrendsGraph />
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.encourageButton} onPress={() => setDrawerVisible(true)}>
          <Text style={styles.encourageButtonText}>Encourage them!</Text>
        </TouchableOpacity>
      </View>
      <MotivationBottomDrawer
        visible={isDrawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  streak: {
    fontSize: 18,
    textAlign: 'center',
    marginRight: 4,
  },
  fireImage: {
    width: 16,
    height: 16,
    alignSelf: 'center',
  },
  screenTimeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  trendsGraph: {
    marginBottom: 10,
  },
  footer: {
    marginBottom: 20,
  },
  encourageButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
  },
  encourageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  streakField:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default FriendStats;
