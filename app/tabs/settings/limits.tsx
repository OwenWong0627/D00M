import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import SliderComponent from '../../../components/SliderComponent'; // Assuming the SliderComponent is in the specified path

const Limits: React.FC = () => {
  const router = useRouter();
  const sliderRef = useRef<any>(null);
  const [isSliderInteracted, setIsSliderInteracted] = useState(false);
  const [totalScreenTime, setTotalScreenTime] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false); // New state for error

  const handleSliderInteraction = () => {
    setIsSliderInteracted(true);
  };

  const handleTotalScreenTimeChange = (totalTime: number) => {
    setTotalScreenTime(totalTime);
  };

  const handleErrorChange = (error: boolean) => { // New handler for error
    setHasError(error);
  };

  const handleSubmit = async () => {
    await sliderRef.current.handleDone();
    Alert.alert('Notice', 'These changes will be reflected tomorrow.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-outline" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Limits</Text>
      <SliderComponent
        ref={sliderRef}
        onSliderChange={handleSliderInteraction}
        onTotalScreenTimeChange={handleTotalScreenTimeChange}
        onErrorChange={handleErrorChange} // Pass the new handler
      />
      <Text style={styles.description}>
        Manually adjust your screen time limit!
      </Text>
      <TouchableOpacity
        style={[styles.submitButton, isSliderInteracted && !hasError && styles.submitButtonEnabled]}
        onPress={handleSubmit}
        disabled={!isSliderInteracted || hasError}
      >
        <Text style={styles.submitButtonText}>Change Screen Time Limit</Text>
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
    marginTop: 20,
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
