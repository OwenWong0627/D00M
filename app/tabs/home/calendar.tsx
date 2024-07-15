import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Calendar } from 'react-native-calendars';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const CalendarScreen: React.FC = () => {
  const router = useRouter();
  const today = "2024-07-11";

  const getMarkedDates = () => {
    const markedDates = {
      // Streak from July 1 to July 8
      '2024-07-01': { startingDay: true, color: '#ffcc66', textColor: 'black' },
      '2024-07-02': { color: '#ffcc66', textColor: 'black' },
      '2024-07-03': { color: '#ffcc66', textColor: 'black' },
      '2024-07-04': { color: '#ffcc66', textColor: 'black' },
      '2024-07-05': { color: '#ffcc66', textColor: 'black' },
      '2024-07-06': { color: '#ffcc66', textColor: 'black' },
      '2024-07-07': { color: '#ffcc66', textColor: 'black' },
      '2024-07-08': { endingDay: true, color: '#ffcc66', textColor: 'black' },

      // Broken streak on July 9
      '2024-07-09': { startingDay: true, endingDay: true, color: '#00f', textColor: 'white' },

      // New streak starting on July 10
      '2024-07-10': { startingDay: true, color: '#ffcc66', textColor: 'black' },
      '2024-07-11': { color: '#ffcc66', textColor: 'black' },
      '2024-07-12': { color: '#ffcc66', textColor: 'black' },
      '2024-07-13': { color: '#ffcc66', textColor: 'black' },
      '2024-07-14': { color: '#ffcc66', textColor: 'black' },
      '2024-07-15': { color: '#ffcc66', textColor: 'black' },
      // '2024-07-16': { color: '#ffcc66', textColor: 'black' },
      // '2024-07-17': { color: '#ffcc66', textColor: 'black' },
    };

    return markedDates;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-outline" size={24} color="#000" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <Calendar
        style={styles.calendar}
        current={today}
        markingType={'period'}
        markedDates={getMarkedDates()}
        theme={{
          calendarBackground: '#232528',
          textSectionTitleColor: '#a6a6a6',
          textSectionTitleDisabledColor: '#d9d9d9',
          selectedDayBackgroundColor: '#ffcc66',
          selectedDayTextColor: '#000',
          todayTextColor: '#ffcc66',
          dayTextColor: '#ffcc66',
          textDisabledColor: '#d9d9d9',
          dotColor: '#ffcc66',
          selectedDotColor: '#ffcc66',
          arrowColor: '#ffcc66',
          disabledArrowColor: '#d9d9d9',
          monthTextColor: '#ffcc66',
          indicatorColor: '#ffcc66',
          textDayFontFamily: 'monospace',
          textMonthFontFamily: 'monospace',
          textDayHeaderFontFamily: 'monospace',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232528',
    padding: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    fontSize: 18,
    marginLeft: -20,
    color: '#ffcc66',
  },
  calendar: {
    width: screenWidth - 40,
  },
});

export default CalendarScreen;
