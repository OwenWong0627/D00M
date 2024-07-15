import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

interface SliderComponentProps {
  onSliderChange: () => void;
}

const SliderComponent: React.FC<SliderComponentProps> = ({ onSliderChange }) => {
  const initialSliders = [
    { app: 'Instagram', icon: require('../assets/images/instagram.png'), max: 90, value: 60, color: '#8a3ab9' },
    { app: 'Facebook', icon: require('../assets/images/facebook.png'), max: 90, value: 60, color: '#3b5998' },
    { app: 'Twitter', icon: require('../assets/images/twitter.png'), max: 90, value: 30, color: '#1da1f2' },
    { app: 'TikTok', icon: require('../assets/images/tiktok.png'), max: 90, value: 25, color: '#ee1d52' },
  ];

  const [sliders, setSliders] = useState(initialSliders);

  const handleSliderChange = (index: number, value: number) => {
    const newSliders = [...sliders];
    newSliders[index].value = value;
    setSliders(newSliders);
    onSliderChange(); // Call the callback prop to notify parent component of the change
  };

  const renderLabels = (max: number) => {
    const interval = max / 3; // Assuming 4 intervals
    const labels = Array.from({ length: 4 }, (_, i) => i * interval);
    return (
      <View style={styles.labelsContainer}>
        {labels.map((label, index) => (
          <Text key={index} style={styles.labelText}>{label}</Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {sliders.map((slider, index) => (
        <View key={index} style={styles.sliderRow}>
          <Image source={slider.icon} style={styles.icon} />
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={slider.max}
              value={slider.value}
              step={5}
              minimumTrackTintColor={slider.color}
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor={slider.color}
              onValueChange={(value) => handleSliderChange(index, value)}
            />
            {renderLabels(slider.max)}
          </View>
          <Text style={styles.timeText}>{slider.value} MIN</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  sliderContainer: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
  },
  slider: {
    height: 40,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    width: '87.5%',
    top: 25,
    left: 15,
  },
  labelText: {
    fontSize: 10,
    color: '#000',
  },
  timeText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SliderComponent;
