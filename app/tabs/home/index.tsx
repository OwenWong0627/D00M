import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../../components/Header';
import CircleGraph from '../../../components/CircleGraph';
import TrendsGraph from '../../../components/TrendsGraph';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Home: React.FC = () => {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Header />
      <CircleGraph />
      <Text style={styles.subtitle}>History</Text>
      <View style={styles.historyItem}>
        <Image source={require('../../../assets/images/tiktok.png')} style={styles.historyIcon} />
        <Text style={styles.historyText}>You d00med through TikTok for 20 minutes from 16:45 - 17:05</Text>
      </View>
      <Text style={styles.subtitle}>Trends</Text>
      <TrendsGraph />
      <Text style={styles.subtitle}>Awards</Text>
      <Image source={require('../../../assets/images/awards.png')} style={styles.awardsImage} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  historyIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  historyText: {
    fontSize: 14,
    color: '#333',
  },
  awardsImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 2.25,
    marginTop: 10,
    borderRadius: 10,
  },
  icon: {
    marginLeft: 20,
  },
});

export default Home;
