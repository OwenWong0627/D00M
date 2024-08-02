import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { ImageSourcePropType } from 'react-native';

const { width } = Dimensions.get('window');

const appData = [
  { app: 'Instagram', color: '#8a3ab9', darkColor: '#000', logo: require('../assets/images/instagram.png') },
  { app: 'Facebook', color: '#3b5998', darkColor: '#000', logo: require('../assets/images/facebook.png') },
  { app: 'YouTube', color: '#FF0000', darkColor: '#000', logo: require('../assets/images/youtube.png') },
  { app: 'TikTok', color: '#ee1d52', darkColor: '#000', logo: require('../assets/images/tiktok.png') },
  { app: 'Snapchat', color: '#FFFC00', darkColor: '#000', logo: require('../assets/images/snapchat.png') },
  { app: 'Reddit', color: '#FF5700', darkColor: '#000', logo: require('../assets/images/reddit.png') },
  { app: 'X', color: '#1da1f2', darkColor: '#000', logo: require('../assets/images/twitter.png') }
];

interface CircleGraphProps {
  screenTimeData: { app: string; used: number; limit: number; }[];
  disableLabels?: boolean;
}

const CircleGraph: React.FC<CircleGraphProps> = ({ screenTimeData, disableLabels }) => {
  // Filter out apps with a limit of 0 and map their colors and logos
  const filteredData = screenTimeData.filter(d => d.limit > 0);
  const colors = filteredData.flatMap(d => {
    const appInfo = appData.find(app => app.app === d.app);
    return appInfo ? [appInfo.darkColor, appInfo.color, '#fff'] : ['#fff', '#fff', '#fff',];
  });
  const totalTimeLimit = filteredData.reduce((total, d) => total + d.limit, 0);
  const centerData = filteredData.flatMap(d => [Math.min(d.used, d.limit), d.limit - Math.min(d.used, d.limit)]);
  const data = filteredData.flatMap(d => [Math.min(d.used, d.limit), d.limit - Math.min(d.used, d.limit), (filteredData.length === 1 ? 0 : (totalTimeLimit/360)*3)]);
  const logos = filteredData.map(d => {
    const appInfo = appData.find(app => app.app === d.app);
    return appInfo ? appInfo.logo : null;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Limit Left</Text>
      <View style={styles.graphContainer}>
        <View style={styles.pieChartContainer}>
          <PieChart
            widthAndHeight={width / 2}
            series={data}
            sliceColor={colors}
            coverRadius={0.65}
            coverFill="#FFF"
          />
          <View style={styles.centerTextContainer}>
            <Text style={styles.centerText}>
              {Math.floor(centerData.reduce((acc, value) => acc + value, 0) / 60)} HOURS{"\n"}
              {centerData.reduce((acc, value) => acc + value, 0) % 60} MIN
            </Text>
          </View>
        </View>
        {!disableLabels && (
          <View style={styles.labelsContainer}>
            {filteredData.map((d, index) => (
              <View key={index} style={styles.label}>
                <View style={[styles.colorBox, { backgroundColor: colors[(index * 3)+1] }]} />
                {logos[index] && <Image source={logos[index]} style={styles.logo} />}
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
    marginRight: 10,
  },
});

export default CircleGraph;
