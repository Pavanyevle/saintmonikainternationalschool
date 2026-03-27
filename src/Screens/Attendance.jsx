import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AttendanceScreen = ({ navigation }) => {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);

  const percentage = useMemo(() => {
    if (!attendance?.totalWorkingDays) return null;
    return (
      (attendance.present / attendance.totalWorkingDays) * 100
    ).toFixed(1);
  }, [attendance]);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);

      const storedUser = await AsyncStorage.getItem('userData');
      if (!storedUser) {
        setStudent(null);
        setAttendance(null);
        return;
      }

      const { email } = JSON.parse(storedUser) || {};
      if (!email) {
        setStudent(null);
        setAttendance(null);
        return;
      }

      const studentKey = email.replace(/\./g, '_');

      const [studentRes, attendanceRes] = await Promise.all([
        axios.get(
          `https://international-public-sch-db945-default-rtdb.firebaseio.com/students/${studentKey}.json`,
        ),
        axios.get(
          `https://international-public-sch-db945-default-rtdb.firebaseio.com/students/${studentKey}/attendance.json`,
        ),
      ]);

      setStudent(studentRes.data || null);
      setAttendance(attendanceRes.data || {});
    } catch (error) {
      console.log('Fetch Error:', error?.message || error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0b5f95" />
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Unable to load profile!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={['#083f66', '#083f66']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Student Attendance</Text>
          </View>
        </View>
      </LinearGradient>

      {/* SCROLL CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollArea}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* STUDENT INFO CARD */}
        <View style={styles.profileCard}>
          <Text style={styles.name}>
            {student.name} ({student.class}th)
          </Text>
          <Text style={styles.info}>Father: {student.fatherName}</Text>
          <Text style={styles.info}>Mother: {student.motherName}</Text>
          {percentage && (
            <Text style={styles.info}>
              Overall Attendance: {percentage}%
            </Text>
          )}
        </View>

        {/* ATTENDANCE SUMMARY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attendance Summary</Text>

          <View style={styles.card}>
            <View style={styles.row}>
              <View style={[styles.dot, { backgroundColor: '#00796B' }]} />
              <Text style={styles.label}>Total Working Days</Text>
              <Text style={styles.value}>
                {attendance?.totalWorkingDays ?? 0}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <View style={[styles.dot, { backgroundColor: '#2E7D32' }]} />
              <Text style={styles.label}>Present</Text>
              <Text style={styles.value}>{attendance?.present ?? 0}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <View style={[styles.dot, { backgroundColor: '#C62828' }]} />
              <Text style={styles.label}>Absent</Text>
              <Text style={styles.value}>{attendance?.absent ?? 0}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <View style={[styles.dot, { backgroundColor: '#757575' }]} />
              <Text style={styles.label}>Leave</Text>
              <Text style={styles.value}>{attendance?.leave ?? 0}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AttendanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#083f66',
    paddingVertical: 25,
    paddingHorizontal: 15,
    paddingTop: 50,
    height: 120,
    elevation: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
  },
  scrollArea: {
    padding: 15,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 18,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#004D60',
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginTop: 3,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#004D60',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 10,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  label: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#333',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004D60',
  },
});
