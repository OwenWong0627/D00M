import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Switch } from 'react-native';
import { StackedBarChart } from 'react-native-chart-kit';
import { Svg, Line } from 'react-native-svg';

const { width } = Dimensions.get('window');

const screenTimeData = [
  { day: 'T', used: 2, limit: 3.5 },
  { day: 'F', used: 2, limit: 3 },
  { day: 'S', used: 2, limit: 3 },
  { day: 'S', used: 2.5, limit: 3.5 },
  { day: 'M', used: 1.5, limit: 3.5 },
  { day: 'T', used: 1.5, limit: 2.5 },
  { day: 'Today', used: 1, limit: 3.5 },
];

const data = screenTimeData.map(d => [d.used, d.limit - d.used]);
const labels = screenTimeData.map(d => d.day);

// Calculate trendline points based on ratios
const chartHeight = 220;
const chartWidth = width - 30;
const margin = 35;
const trendlineRatios = screenTimeData.map(d => d.used / d.limit);

const startY = chartHeight - (trendlineRatios[0] * chartHeight);
const endY = chartHeight - (trendlineRatios[trendlineRatios.length - 1] * chartHeight);

const TrendsGraph: React.FC = () => {
  const [showTrendline, setShowTrendline] = useState(true);

  // Define bar colors based on trendline state
  const barColors = showTrendline ? ['#808080', '#fff'] : ['#000000', '#FFFFFF'];

  return (
    <View style={styles.container}>
      <Text style={styles.trendsText}>Weekly Average</Text>
      <Text style={styles.averageTime}>2h 25m</Text>
      <Text style={styles.limitText}>Limit: 3h 55m</Text>
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
          yAxisSuffix="h"
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
              strokeDasharray="4, 4" // Dotted line
            />
          </Svg>
        )}
      </View>
      <View style={styles.trendlineSwitch}>
        <Text>Show Trendline</Text>
        <Switch value={showTrendline} onValueChange={setShowTrendline} />
      </View>
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
    paddingLeft: -50, // Cut off the left side a bit
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
    top: 0,
    left: 0,
  },
});

export default TrendsGraph;
