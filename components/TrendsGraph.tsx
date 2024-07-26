import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Switch, Modal, TouchableOpacity } from 'react-native';
import { StackedBarChart } from 'react-native-chart-kit';
import { Svg, Line } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface TrendsGraphProps {
  trendsData: { day: string; used: number; limit: number }[];
}

const chartHeight = 220;
const chartWidth = width - 30;
const margin = 45;

const TrendsGraph: React.FC<TrendsGraphProps> = ({ trendsData }) => {
  const [showTrendline, setShowTrendline] = useState(false);

  const barColors = showTrendline ? ['#808080', '#fff'] : ['#000000', '#FFFFFF'];

  const data = trendsData.map(d => [Math.min(d.used, d.limit), d.limit - Math.min(d.used, d.limit)]) as number[][];
  const labels = trendsData.map(d => d.day);

  const trendlineRatios = trendsData.map(d => d.used / d.limit);

  const startY = chartHeight - (trendlineRatios[0] * chartHeight);
  const endY = chartHeight - (trendlineRatios[trendlineRatios.length - 1] * chartHeight);

  const weeklyAverageUsed = (trendsData.reduce((acc, data) => acc + data.used, 0) / trendsData.length).toFixed(2);
  const weeklyAverageLimit = (trendsData.reduce((acc, data) => acc + data.limit, 0) / trendsData.length).toFixed(0);

  const chartConfig = {
    backgroundColor: '#F0F0F0',
    backgroundGradientFrom: '#F0F0F0',
    backgroundGradientTo: '#F0F0F0',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.5,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.trendsText}>Weekly Average</Text>
      <Text style={styles.averageTime}>{weeklyAverageUsed} minutes</Text>
      <Text style={styles.limitText}>Limit: {weeklyAverageLimit} minutes</Text>
      <View style={styles.chartContainer}>
        <StackedBarChart
          data={{
            labels,
            legend: ['Used', 'Remaining'],
            data,
            barColors,
          }}
          width={chartWidth}
          height={chartHeight}
          yAxisSuffix="m"
          decimalPlaces={0}
          chartConfig={{
            backgroundColor: '#F0F0F0',
            backgroundGradientFrom: '#F0F0F0',
            backgroundGradientTo: '#F0F0F0',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            barPercentage: 0.5,
            propsForHorizontalLabels: {
              textAnchor: 'start',
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
            marginLeft: -35,
          }}
          hideLegend={true}
          withHorizontalLabels={true}
        />
        {showTrendline && (
          <Svg height={chartHeight} width={chartWidth} style={styles.trendline}>
            <Line
              x1={margin}
              y1={startY}
              x2={chartWidth - margin}
              y2={endY}
              stroke="red"
              strokeWidth="2"
              strokeDasharray="4, 4"
            />
          </Svg>
        )}
      </View>
      {/* <View style={styles.trendlineSwitch}>
        <Text>Show Trendline</Text>
        <Switch value={showTrendline} onValueChange={setShowTrendline} />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  chartContainer: {
    overflow: 'hidden',
    position: 'relative',
  },
  trendsText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  averageTime: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  limitText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
    marginBottom: 10,
  },
  trendlineSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  trendline: {
    position: 'absolute',
  },
  touchableOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    marginLeft: 35,
  },
  touchableBar: {
    height: chartHeight,
    backgroundColor: 'light-gray',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TrendsGraph;
