import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CircleGraph from '../../../components/CircleGraph';
import MotivationBottomDrawer from '../../../components/MotivationBottomDrawer';

const Friend: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; name: string; image: any }>();
  const { id, name, image } = params;
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-outline" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.subtitle}>In the running for 1st for 2 weeks</Text>
      <Image source={image} style={styles.image} />
      <CircleGraph />
      <View style={styles.footer}>
        <TouchableOpacity style={styles.encourageButton} onPress={() => setDrawerVisible(true)}>
          <Text style={styles.encourageButtonText}>Encourage them!</Text>
        </TouchableOpacity>
      </View>
      <MotivationBottomDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </View>
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
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  footer: {
    position: 'absolute',
    bottom: -20,
    left: '5%',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  encourageButton: {
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingTop: 0,
    paddingBottom: 20,
    borderRadius: 20,
    alignItems: 'center',
    width: '90%',
  },
  encourageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Friend;
