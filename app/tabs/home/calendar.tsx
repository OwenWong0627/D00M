import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Calendar } from 'react-native-calendars';
import { Dimensions } from 'react-native';
import { auth, db } from '../../../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const screenWidth = Dimensions.get('window').width;

const CalendarScreen: React.FC = () => {
  const router = useRouter();
  const today = new Date().toLocaleDateString();
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScreenTimeData = async () => {
      if (auth.currentUser) {
        const screenTimeRef = doc(db, 'screenTimeData', auth.currentUser.uid);
        const screenTimeDoc = await getDoc(screenTimeRef);

        if (screenTimeDoc.exists()) {
          const data = screenTimeDoc.data();
          const dailyData = data.dailyData;

          const datesUnderLimit: { [key: string]: any } = {};
          dailyData.forEach((day: any, index: any) => {
            const date = day.date.toDate().toLocaleDateString();
            const isStreakDay = day.appUsage.every((app: any) => app.used <= app.limit);
            if (isStreakDay) {
              let markingType = 'single';

              const prevDay = dailyData[index - 1];
              const nextDay = dailyData[index + 1];

              if (prevDay && nextDay && prevDay.appUsage.every((app: { used: number; limit: number; }) => app.used <= app.limit) && nextDay.appUsage.every((app: { used: number; limit: number; }) => app.used <= app.limit)) {
                markingType = 'middle';
              } else if (prevDay && prevDay.appUsage.every((app: { used: number; limit: number; }) => app.used <= app.limit)) {
                markingType = 'end';
              } else if (nextDay && nextDay.appUsage.every((app: { used: number; limit: number; }) => app.used <= app.limit)) {
                markingType = 'start';
              }

              datesUnderLimit[date] = {
                startingDay: markingType === 'start' || markingType === 'single',
                endingDay: markingType === 'end' || markingType === 'single',
                color: '#d4a017', // darker yellow color
                textColor: '#4a4a4a' // darker gray color
              };
            }
          });

          setMarkedDates(datesUnderLimit);
        }
        setLoading(false);
      }
    };

    fetchScreenTimeData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#d4a017" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-outline" size={24} color="#d4a017" />
      </TouchableOpacity>
      <Calendar
        style={styles.calendar}
        current={today}
        markingType={'period'}
        markedDates={markedDates}
        theme={{
          calendarBackground: '#fff',
          textSectionTitleColor: '#4a4a4a',
          textSectionTitleDisabledColor: '#a6a6a6',
          selectedDayBackgroundColor: '#d4a017',
          selectedDayTextColor: '#4a4a4a',
          todayTextColor: '#d4a017',
          dayTextColor: '#4a4a4a',
          textDisabledColor: '#a6a6a6',
          dotColor: '#d4a017',
          selectedDotColor: '#d4a017',
          arrowColor: '#d4a017',
          disabledArrowColor: '#a6a6a6',
          monthTextColor: '#d4a017',
          indicatorColor: '#d4a017',
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
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 30,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendar: {
    width: screenWidth - 40,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CalendarScreen;
