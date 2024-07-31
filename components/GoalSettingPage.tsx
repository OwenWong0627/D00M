import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { auth } from '../firebase/firebaseConfig';
import { createUserSettings } from '../scripts/authFunctions';

const { width } = Dimensions.get('window');

interface GoalSettingPageProps {
  scrollToNext: () => void;
}

const GoalSettingPage: React.FC<GoalSettingPageProps> = ({ scrollToNext }) => {
  const [goalType, setGoalType] = useState<'Reduce' | 'Maintain'>('Reduce');
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [goal, setGoal] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  useEffect(() => {
    if ((hours > 0 || minutes > 0) && goal.trim().length > 0) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  }, [hours, minutes, goal]);

  const handleDone = async () => {
    if (auth.currentUser) {
      const settings = {
        goalType,
        hours,
        minutes,
        date: date.toLocaleDateString(undefined, {year: 'numeric', month: '2-digit', day: '2-digit'}),
        description: goal,
        appLimits: [
          { app: 'Instagram', limit: 0 },
          { app: 'Facebook', limit: 0 },
          { app: 'YouTube', limit: 0 },
          { app: 'TikTok', limit: 0 },
          { app: 'Snapchat', limit: 0 },
          { app: 'Reddit', limit: 0 },
          { app: 'X', limit: 0 },
        ],
      };

      await createUserSettings(auth.currentUser.uid, settings);
      scrollToNext();
    } else {
      Alert.alert('Error', 'No user is currently logged in.');
    }
  };

  const hoursOptions = Array.from(Array(24).keys()).map((h) => ({
    label: `${h}`,
    value: h,
  }));

  const minutesOptions = Array.from(Array(60).keys()).map((m) => ({
    label: `${m}`,
    value: m,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a Goal!</Text>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🎯</Text>
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.label}>I want to</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, goalType === 'Reduce' && styles.activeToggleButton]}
            onPress={() => setGoalType('Reduce')}
          >
            <Text style={[styles.toggleText, goalType === 'Reduce' && styles.activeToggleText]}>Reduce</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, goalType === 'Maintain' && styles.activeToggleButton]}
            onPress={() => setGoalType('Maintain')}
          >
            <Text style={[styles.toggleText, goalType === 'Maintain' && styles.activeToggleText]}>Maintain</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.label}>My screen time to</Text>
        <View style={styles.timePickerContainer}>
          <TouchableOpacity style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(value) => setHours(value)}
              items={hoursOptions}
              value={hours}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
            />
          </TouchableOpacity>
          <Text style={styles.timeText}>h</Text>
          <TouchableOpacity style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(value) => setMinutes(value)}
              items={minutesOptions}
              value={minutes}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
            />
          </TouchableOpacity>
          <Text style={styles.timeText}>m</Text>
        </View>
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.label}>By</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
          <Text>{date.toLocaleDateString(undefined, {year: 'numeric', month: '2-digit', day: '2-digit'})}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.label}>So that I can</Text>
      </View>
      <TextInput
        style={styles.goalInput}
        placeholder="Goals"
        value={goal}
        onChangeText={setGoal}
      />
      <TouchableOpacity
        style={[styles.doneButton, !isButtonEnabled && styles.disabledButton]}
        onPress={handleDone}
        disabled={!isButtonEnabled}
      >
        <Text style={styles.doneButtonText}>I'm done</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.skipButton} onPress={handleDone}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30,
    marginLeft: 10,
    marginRight: 40,
    marginBottom: 5,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30,
    marginLeft: 10,
    marginRight: 40,
    marginBottom: 5,
  },
});

const styles = StyleSheet.create({
  container: {
    width: width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  icon: {
    fontSize: 80,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  toggleButton: {
    padding: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 0,
  },
  activeToggleButton: {
    backgroundColor: '#000',
  },
  toggleText: {
    color: '#000',
  },
  activeToggleText: {
    color: '#fff',
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: -15,
  },
  pickerContainer: {
    width: 100,
  },
  timeText: {
    marginLeft: -30,
  },
  dateButton: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
  },
  goalInput: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  doneButton: {
    marginTop: 20,
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 8,
    paddingVertical: 12,
    width: '90%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  doneButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  skipButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#000',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default GoalSettingPage;
