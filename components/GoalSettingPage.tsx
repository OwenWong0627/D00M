import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

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
          <Picker
            selectedValue={hours}
            style={styles.picker}
            onValueChange={(itemValue) => setHours(itemValue)}
          >
            {Array.from(Array(24).keys()).map((h) => (
              <Picker.Item key={h} label={`${h}`} value={h} />
            ))}
          </Picker>
          <Text style={styles.timeText}>h</Text>
          <Picker
            selectedValue={minutes}
            style={styles.picker}
            onValueChange={(itemValue) => setMinutes(itemValue)}
          >
            {Array.from(Array(60).keys()).map((m) => (
              <Picker.Item key={m} label={`${m}`} value={m} />
            ))}
          </Picker>
          <Text style={styles.timeText}>m</Text>
        </View>
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.label}>By</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
          <Text>{date.toLocaleDateString()}</Text>
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
        onPress={scrollToNext}
        disabled={!isButtonEnabled}
      >
        <Text style={styles.doneButtonText}>I'm done</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.skipButton} onPress={scrollToNext}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  picker: {
    height: 50,
    width: 100,
    marginRight: -10,
  },
  timeText: {
    marginHorizontal: 0,
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
