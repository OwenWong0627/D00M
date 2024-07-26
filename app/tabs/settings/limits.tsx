import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import SliderComponent from '../../../components/SliderComponent'; // Assuming the SliderComponent is in the specified path

const Limits: React.FC = () => {
  const router = useRouter();
  const sliderRef = useRef<any>(null);
  const [isSliderInteracted, setIsSliderInteracted] = useState(false);

  const handleSliderInteraction = () => {
    setIsSliderInteracted(true);
  };

  const handleSubmit = async () => {
    await sliderRef.current.handleDone();
    router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-outline" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Limits</Text>
      <SliderComponent ref={sliderRef} onSliderChange={handleSliderInteraction} />
      <Text style={styles.description}>
        Manually adjust your screen time limit or Let our AI do it for you!
      </Text>
      <TouchableOpacity
        style={[styles.submitButton, isSliderInteracted && styles.submitButtonEnabled]}
        onPress={handleSubmit}
        disabled={!isSliderInteracted}
      >
        <Text style={styles.submitButtonText}>Submit for review</Text>
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
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#ccc',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonEnabled: {
    backgroundColor: '#000',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Limits;