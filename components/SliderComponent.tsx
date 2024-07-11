import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

const SliderComponent: React.FC = () => {
  const initialSliders = [
    { app: 'Instagram', icon: require('../assets/images/instagram.png'), max: 120, value: 60, color: '#8a3ab9' },
    { app: 'Facebook', icon: require('../assets/images/facebook.png'), max: 120, value: 60, color: '#3b5998' },
    { app: 'Twitter', icon: require('../assets/images/twitter.png'), max: 60, value: 30, color: '#1da1f2' },
    { app: 'TikTok', icon: require('../assets/images/tiktok.png'), max: 60, value: 25, color: '#ee1d52' },
  ];

  const [sliders, setSliders] = useState(initialSliders);

  const handleSliderChange = (index: number, value: number) => {
    const newSliders = [...sliders];
    newSliders[index].value = value;
    setSliders(newSliders);
  };

  const renderLabels = (max: number) => {
    const interval = max / 4; // Assuming 4 intervals
    const labels = Array.from({ length: 5 }, (_, i) => i * interval);
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
              step={10}
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
    width: '100%',
    top: 20,
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
