import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

interface InitialScreenProps {
  onStart: () => void;
}

const InitialScreen: React.FC<InitialScreenProps> = ({ onStart }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onStart}>
      <Image source={require('../assets/images/D00M-icon.png')} style={styles.image} />
      <Text style={styles.title}>D00M</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default InitialScreen;
