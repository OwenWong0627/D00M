import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import PieChart from 'react-native-pie-chart';

const { width } = Dimensions.get('window');

const screenTimeData = [
  { app: 'Instagram', used: 20, limit: 60, remaining: 40, logo: require('../assets/images/instagram.png') },
  { app: 'Snapchat', used: 40, limit: 40, remaining: 0, logo: require('../assets/images/snapchat.png') },
  { app: 'Reddit', used: 30, limit: 30, remaining: 0, logo: require('../assets/images/reddit.png') },
  { app: 'TikTok', used: 25, limit: 90, remaining: 65, logo: require('../assets/images/tiktok.png') },
];

const colors = ['#600080', '#fff', '#c61aff', '#fff', '#ecb3ff', '#fff', '#ffcc66', '#fff'];

const data = screenTimeData.flatMap(d => [d.used, d.remaining]);

interface CircleGraphProps {
  disableLabels?: boolean;
}

const CircleGraph: React.FC<CircleGraphProps> = ({ disableLabels }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Limit Left</Text>
      <View style={styles.graphContainer}>
        <View style={styles.pieChartContainer}>
          <PieChart
            widthAndHeight={width / 2}
            series={data}
            sliceColor={colors}
            coverRadius={0.45}
            coverFill="#FFF"
          />
          <View style={styles.centerTextContainer}>
            <Text style={styles.centerText}>2 HOURS{"\n"}55 MIN</Text>
          </View>
        </View>
        {!disableLabels && (
          <View style={styles.labelsContainer}>
            {screenTimeData.map((d, index) => (
              <View key={index} style={styles.label}>
                <View style={[styles.colorBox, { backgroundColor: colors[index * 2] }]} />
                <Image source={d.logo} style={styles.logo} />
                <Text>: {d.used}/{d.limit} mins</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  graphContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieChartContainer: {
    position: 'relative',
  },
  centerTextContainer: {
    position: 'absolute',
    top: '40%',
    left: '35%',
  },
  centerText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 'bold',
  },
  labelsContainer: {
    marginLeft: 20,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  colorBox: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 0,
  },
});

export default CircleGraph;
