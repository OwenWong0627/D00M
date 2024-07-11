import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Header: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Image source={require('../assets/images/D00M-icon.png')} style={styles.logo} />
        <Text style={styles.title}>DOOM</Text>
      </View>
      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={() => { /* Handle calendar press */ }}>
          <Ionicons name="calendar-outline" size={24} color="#000" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { /* Handle share press */ }}>
          <Ionicons name="share-outline" size={24} color="#000" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  rightContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 20,
  },
});

export default Header;
