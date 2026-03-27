import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const FIREBASE_BASE =
  'https://international-public-sch-db945-default-rtdb.firebaseio.com';

const StudentProfileScreen = ({ navigation }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStudent = useCallback(async () => {
    try {
      setLoading(true);

      const storedUser = await AsyncStorage.getItem('userData');
      if (!storedUser) {
        console.log('No user data found');
        setStudent(null);
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      const email = parsedUser.email;

      // Firebase key sanitize: replace invalid chars.
      const studentKey = email.replace(/[.#$[\]]/g, '_');

      const res = await axios.get(
        `${FIREBASE_BASE}/students/${studentKey}.json`,
      );

      setStudent(res.data || null);
    } catch (error) {
      console.log('API Error:', error);
      setStudent(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  if (loading) {
    return (
      <View style={styles.centerWrap}>
        <ActivityIndicator size="large" color="#0b5f95" />
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.centerWrap}>
        <Text style={styles.errorText}>Unable to load profile!</Text>
      </View>
    );
  }

  const infoItems = [
    {
      icon: <Feather name="file-text" size={20} color="#0f6aa5" />,
      label: 'Admission No',
      value: student.admissionNumber,
    },
    {
      icon: <Feather name="user" size={20} color="#0f6aa5" />,
      label: 'Full Name',
      value: student.name,
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="account-tie"
          size={22}
          color="#0f6aa5"
        />
      ),
      label: 'Father Name',
      value: student.fatherName,
    },
    {
      icon: <AntDesign name="calendar" size={20} color="#0f6aa5" />,
      label: 'Date of Birth',
      value: student.dob,
    },

    {
      icon: <Feather name="phone" size={20} color="#0f6aa5" />,
      label: 'Contact Number',
      value: student.contact,
    },

    {
      icon: <Feather name="map-pin" size={20} color="#0f6aa5" />,
      label: 'Address',
      value: student.address,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0b5f95" />

      {/* HEADER */}
      <LinearGradient colors={['#0f6aa5', '#0b5f95']} style={styles.header}>
        <TouchableOpacity onPress={navigation.goBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 26 }} />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* PROFILE SECTION */}
        <View style={styles.profileSection}>
          {student.profileImg ? (
            <Image
              source={{ uri: student.profileImg }}
              style={styles.profileImage}
            />
          ) : (
            <MaterialCommunityIcons
              name="account-circle"
              size={150}
              color="#888"
            />
          )}

          <Text style={styles.name}>{student.name}</Text>
        </View>

        {/* INFO CARDS */}
        {infoItems.map(item => (
          <View key={item.label} style={styles.card}>
            {item.icon}
            <View style={styles.cardText}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value || '-'}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7faff',
  },
  centerWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  header: {
    height: 120,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 25,
    elevation: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '700',
  },
  backBtn: {
    padding: 6,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 30,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    resizeMode: 'cover',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0b5f95',
    marginTop: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    elevation: 3,
  },
  cardText: {
    flex: 1,
    marginLeft: 15,
  },
  label: {
    fontSize: 14,
    color: '#777',
    fontWeight: '600',
  },
  value: {
    fontSize: 17,
    color: '#222',
    fontWeight: '500',
    marginTop: 4,
  },
});
