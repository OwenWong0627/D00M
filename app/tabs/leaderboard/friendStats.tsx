import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import CircleGraph from '../../../components/CircleGraph';
import TrendsGraph from '../../../components/TrendsGraph';
import { getLast7Days, getDayLabel } from '../../../utils/dateUtils';
import MotivationBottomDrawer from '@/components/MotivationBottomDrawer';

const FriendStats: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; name: string, streak: string }>();
  const { id, name, streak } = params;
  const [screenTimeData, setScreenTimeData] = useState([]);
  const [trendsData, setTrendsData] = useState<{ day: string; used: number; limit: number; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const fetchScreenTimeData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const screenTimeDocRef = doc(db, 'screenTimeData', id);
        const screenTimeDocSnap = await getDoc(screenTimeDocRef);

        if (screenTimeDocSnap.exists()) {
          const screenTimeDoc = screenTimeDocSnap.data();
          const dailyData = screenTimeDoc.dailyData;

          if (dailyData && dailyData.length > 0) {
            const latestData = dailyData[dailyData.length - 1].appUsage;
            setScreenTimeData(latestData);

            // Set trendsData for TrendsGraph
            const last7Days = getLast7Days();
            const trendsData = last7Days.map((date) => {
              const dayData = dailyData.find((data: any) => data.date.toDate().toLocaleDateString('en-CA', {year: 'numeric', month: '2-digit', day: '2-digit'}) === date.toString()) || {
                date,
                totalScreenTime: 0,
                appUsage: [],
              };

              const totalUsed = dayData.appUsage.reduce((acc: any, app: { used: any }) => acc + app.used, 0);
              const totalLimit = dailyData[dailyData.length - 1].appUsage.reduce((acc: any, app: { limit: any }) => acc + app.limit, 0);

              return {
                day: getDayLabel(date),
                used: totalUsed,
                limit: totalLimit,
              };
            });

            setTrendsData(trendsData);
          } else {
            setScreenTimeData([]);
            setTrendsData([]);
          }
        } else {
          setScreenTimeData([]);
          setTrendsData([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching screen time data: ', error);
        setLoading(false);
      }
    };

    fetchScreenTimeData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back-outline" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>{name}'s Stats, {streak} days 🔥</Text>
      <View style={styles.circleGraph}>
        <CircleGraph screenTimeData={screenTimeData} />
      </View>
      <View style={styles.trendsGraph}>
        <TrendsGraph trendsData={trendsData} />
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.encourageButton} onPress={() => setDrawerVisible(true)}>
          <Text style={styles.encourageButtonText}>Encourage them!</Text>
        </TouchableOpacity>
      </View>
      <MotivationBottomDrawer
        visible={isDrawerVisible}
        onClose={() => setDrawerVisible(false)}
        recipientId={id ?? ''}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginLeft: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  circleGraph: {
    marginBottom: 20,
  },
  trendsGraph: {
    marginHorizontal: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginBottom: 20,
    marginHorizontal: 20,
  },
  encourageButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
  },
  encourageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FriendStats;
