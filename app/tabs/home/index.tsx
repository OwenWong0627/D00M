import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';
import { auth, db } from '../../../firebase/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Header from '../../../components/Header';
import CircleGraph from '../../../components/CircleGraph';
import TrendsGraph from '../../../components/TrendsGraph';
import { getLast7Days, getDayLabel } from '../../../utils/dateUtils';
import Encouragements from '../../../components/Encouragements';

const Home: React.FC = () => {
  const [screenTimeData, setScreenTimeData] = useState([]);
  const [trendsData, setTrendsData] = useState<{ day: string; used: number; limit: number; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newScreenTimeData, setNewScreenTimeData] = useState([]);

  useEffect(() => {
    const fetchScreenTimeData = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'screenTimeData', auth.currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const dailyData = docSnap.data().dailyData;

          // Set screenTimeData for CircleGraph
          const todayDate = new Date().toLocaleDateString();
          const todayData = dailyData.find((data: any) => data.date.toDate().toLocaleDateString() === todayDate.toString());
          setScreenTimeData(todayData ? todayData.appUsage : []);
          setNewScreenTimeData(todayData ? todayData.appUsage.filter((app: any) => app.limit > 0) : []);

          // Set trendsData for TrendsGraph
          const last7Days = getLast7Days();
          const trendsData = last7Days.map((date) => {
            const dayData = dailyData.find((data: any) => data.date.toDate().toLocaleDateString() === date.toString()) || {
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
          console.log('No such document!');
        }
        setLoading(false);
      }
    };

    fetchScreenTimeData();
  }, []);

  const handleUpdateScreenTime = async () => {
    if (auth.currentUser) {
      const userDocRef = doc(db, 'screenTimeData', auth.currentUser.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const dailyData = docSnap.data().dailyData;
        const todayDate = new Date().toLocaleDateString();
        const todayDataIndex = dailyData.findIndex((data: any) => data.date.toDate().toLocaleDateString() === todayDate);

        if (todayDataIndex !== -1) {
          dailyData[todayDataIndex].appUsage = newScreenTimeData;
          await updateDoc(userDocRef, { dailyData });
          setScreenTimeData(newScreenTimeData);
          //also update trendsData
          const last7Days = getLast7Days();
          const trendsData = last7Days.map((date) => {
            const dayData = dailyData.find((data: any) => data.date.toDate().toLocaleDateString() === date.toString()) || {
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
          Alert.alert('Success', 'Screen time updated successfully.');
          setModalVisible(false);
        } else {
          console.log('No data for today.');
        }
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Header />
      <CircleGraph screenTimeData={screenTimeData} />
      <TouchableOpacity style={styles.updateButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.updateButtonText}>Update Screen Time</Text>
      </TouchableOpacity>
      <Text style={styles.subtitle}>Trends</Text>
      <TrendsGraph trendsData={trendsData} />
      <Encouragements />

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Screen Time</Text>
            {newScreenTimeData.map((appData, index) => (
              <View key={index} style={styles.modalRow}>
                <Text>{appData.app}</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={appData.used.toString()}
                  onChangeText={(text) => {
                    const newValue = parseInt(text) || 0;
                    const updatedData = JSON.parse(JSON.stringify(newScreenTimeData));
                    updatedData[index].used = newValue;
                    setNewScreenTimeData(updatedData);
                  }}
                />
              </View>
            ))}
            <TouchableOpacity style={styles.modalButton} onPress={handleUpdateScreenTime}>
              <Text style={styles.modalButtonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  awardsImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 2.25,
    marginTop: 10,
    borderRadius: 10,
    opacity: 0.5,
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
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    width: 60,
    height: 30,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  modalButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Home;
