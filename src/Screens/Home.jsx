import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Alert,
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AppHeader from '../components/UI/AppHeader';

const { width } = Dimensions.get('window');

const AppIcon = ({ name, size, color, lib }) => {
  if (lib === 'fa') {
    return <FontAwesome5 name={name} size={size} color={color} />;
  }
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
};

const tiles = [
  { key: 'myprofile', label: 'My Profile ', icon: 'account-circle', lib: 'mci' },
  { key: 'about', label: 'About us ', icon: 'information-variant', lib: 'mci' },
  { key: 'contact', label: 'Contact Us ', icon: 'phone-in-talk-outline', lib: 'mci' },
  { key: 'gallery', label: "Gallery ", icon: 'view-gallery-outline', lib: 'mci' },
  { key: 'teachers', label: 'Subject Teachers ', icon: 'account-tie', lib: 'mci' },
  { key: 'syllabus', label: 'Syllabus ', icon: 'book-education-outline', lib: 'mci' },
  { key: 'applyleave', label: 'Apply Leave ', icon: 'clipboard-text-outline', lib: 'mci' },
  { key: 'achievement', label: 'Achievements ', icon: 'trophy-outline', lib: 'mci' },

  { key: 'examReport', label: 'Exam Schedule ', icon: 'file-chart', lib: 'mci' },
  { key: 'busTracking', label: 'Bus Tracking ', icon: 'bus-marker', lib: 'mci' },
  { key: 'library', label: 'Library ', icon: 'book-open-variant', lib: 'mci' },
  { key: 'help', label: 'Help & Support ', icon: 'lifebuoy', lib: 'mci' },
];

const Home = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);





  const getUserEmail = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem('userData');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        return parsedUser.email || null;
      }
      return null;
    } catch (error) {
      console.log('Error reading userData:', error);
      return null;
    }
  }, []);

  const fetchStudentData = useCallback(async () => {
    try {
      setLoading(true);
      const email = await getUserEmail();
      if (!email) {
        setStudent(null);
        return;
      }

      const studentKey = email
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, '_');

      const response = await axios.get(
        `https://international-public-sch-db945-default-rtdb.firebaseio.com/students/${studentKey}.json`,
      );

      setStudent(response.data || null);
    } catch (error) {
      console.log('Error fetching student:', error);
      setStudent(null);
    } finally {
      setLoading(false);
    }
  }, [getUserEmail]);



  const isBirthdayToday = useCallback(dob => {
    if (!dob || typeof dob !== 'string') return false;

    const parts = dob.split('-');
    if (parts.length !== 3) return false;

    let day, month;

    if (parts[0].length === 4) {
      // YYYY-MM-DD
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
    } else {
      // DD-MM-YYYY
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
    }

    if (isNaN(day) || isNaN(month)) return false;

    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() + 1 === month
    );
  }, []);


  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const confirmLogout = useCallback(() => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setMenuVisible(false);
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (e) {
              console.log('Logout Error:', e);
            }
          },
        },
      ],
      { cancelable: true },
    );
  }, [navigation]);

  const renderTile = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.tile}
        onPress={() => {
          switch (item.key) {
            case 'teachers':
              navigation.navigate('SubjectList');
              break;
            case 'myprofile':
              navigation.navigate('My Profile');
              break;
            case 'syllabus':
              navigation.navigate('Syllabus', {
                class: student?.class,
              });
              break;
            case 'events':
              navigation.navigate('Events');
              break;

            case 'about':
              navigation.navigate('About Us');
              break;
            case 'help':
              navigation.navigate('HelpAndSupport');
              break;
            case 'applyleave':
              navigation.navigate('Apply Leave', {
                student,
              });
              break;
            case 'contact':
              navigation.navigate('Contact Us');
              break;
            case 'achievement':
              navigation.navigate('Achievement');
              break;
            case 'birthday':
              navigation.navigate('Birthday');
              break;
               case 'gallery':
              navigation.navigate('Gallery');
              break;
            default:
              console.warn('No navigation defined for:', item.key);
          }
        }}
      >
        <View style={styles.tileIconWrap}>
          <AppIcon name={item.icon} size={22} color="#1f6aa5" lib={item.lib} />
        </View>
        <Text style={styles.tileLabel}>{item.label}</Text>
      </TouchableOpacity>
    ),
    [navigation, student],
  );

  const isTodayBirthday = useMemo(
    () => (student ? isBirthdayToday(student.dob) : false),
    [student, isBirthdayToday],
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingWrap}>
        <StatusBar barStyle="light-content" backgroundColor="#0f6aa5" />
        <ActivityIndicator size="large" color="#0f6aa5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#083f66" />

      <AppHeader
        title="Saint Monica International School"
        onMenuPress={() => setMenuVisible(true)}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
        {isTodayBirthday && (
          <View style={styles.birthdayBanner}>
            <MaterialCommunityIcons
              name="cake-variant"
              size={18}
              color="#fff"
            />
            <Text style={styles.birthdayText}>
              🎉 Happy Birthday {student?.name}! 🎂
            </Text>
          </View>
        )}

        {/* Profile card */}
        <View style={styles.profileCardWrap}>
          <LinearGradient colors={['#800000', '#800000']} style={styles.profileCard}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../Img/logo.png')}
                style={styles.schoolLogo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.profileCenter}>
              <Text style={styles.studentName}>
                {student ? student.name : 'Loading...'}
              </Text>
              <Text style={styles.classText}>
                Class : {student?.class}th
              </Text>
              <Text style={styles.parentText}>
                Father : Mr. {student?.fatherName}
              </Text>
              <Text style={styles.parentText}>
                Mother : Mrs. {student?.motherName}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.studentImageWrap}
              onPress={() => navigation.navigate('My Profile')}
            >
              {student?.profileImg ? (
                <Image
                  source={{ uri: student.profileImg }}
                  style={styles.studentImage}
                />
              ) : (
                <MaterialCommunityIcons
                  name="account-circle"
                  size={80}
                  color="#fff"
                />
              )}
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Shortcuts */}
        <View style={styles.shortcutsRow}>
          <TouchableOpacity
            style={styles.shortcutItem}
            onPress={() => navigation.navigate('Attendance')}
          >
            <LinearGradient
              colors={['#800000', '#800000']}
              style={styles.shortcutCircle}
            >
              <MaterialCommunityIcons
                name="account-check-outline"
                size={28}
                color="#fff"
              />
            </LinearGradient>
            <Text style={styles.shortcutLabel}>Attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutItem}
            onPress={() => navigation.navigate('Account')}
          >
            <LinearGradient
              colors={['#800000', '#800000']}
              style={styles.shortcutCircle}
            >
              <MaterialCommunityIcons
                name="bank-outline"
                size={28}
                color="#fff"
              />
            </LinearGradient>
            <Text style={styles.shortcutLabel}>Accounts</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutItem}
            onPress={() =>
              navigation.navigate('ClassRoutine', {
                class: student?.class,
              })
            }
          >
            <LinearGradient
              colors={['#800000', '#800000']}
              style={styles.shortcutCircle}
            >
              <MaterialCommunityIcons
                name="calendar-clock"
                size={28}
                color="#fff"
              />
            </LinearGradient>
            <Text style={styles.shortcutLabel}>Class Routine</Text>
          </TouchableOpacity>
        </View>

        {/* Quick links */}
        <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>Quick Links</Text>
        </View>

        <View style={styles.gridWrap}>
          <FlatList
            data={tiles}
            numColumns={4}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            keyExtractor={i => i.key}
            renderItem={renderTile}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {/* Side menu */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={['#0f6aa5', '#2a99d8', '#6dd5fa']}
              style={styles.modalBox}
            >
              <View style={styles.logoWrap}>
                <View style={styles.logoCircle}>
                  <Image
                    source={require('../Img/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
              </View>

              <Text style={styles.schoolName}>Saint Monica International School</Text>
              <View style={styles.separator} />

              {[
                { label: 'My Profile', icon: 'account-circle-outline', screen: 'My Profile' },
                { label: 'About Us', icon: 'information-outline', screen: 'About Us' },
                { label: 'Help & Support', icon: 'headset', screen: 'HelpAndSupport' },
              ].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate(item.screen);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={22}
                    color="#0f6aa5"
                  />
                </TouchableOpacity>
              ))}

              <View style={styles.separator} />

              <TouchableOpacity
                style={[styles.modalItem, { justifyContent: 'space-between' }]}
                onPress={confirmLogout}
              >
                <Text style={[styles.modalItemText, { color: 'red' }]}>
                  Logout
                </Text>
                <MaterialCommunityIcons name="logout" size={22} color="red" />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomTab}
          onPress={() => navigation.navigate('My Profile')}
        >
          <MaterialCommunityIcons name="account-group" size={20} color="#fff" />
          <Text style={styles.bottomLabel}>User</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomTab}
          onPress={() =>
            navigation.navigate('HomeWork', {
              class: student?.class,
            })
          }
        >
          <MaterialCommunityIcons name="notebook" size={20} color="#fff" />
          <Text style={styles.bottomLabel}>Homework</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomTab}
          onPress={() =>
            navigation.navigate('Notice', {
              student,
            })
          }
        >
          <MaterialCommunityIcons name="bell" size={20} color="#fff" />
          <Text style={styles.bottomLabel}>Notice</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const TILE_SIZE = (width - 60) / 4;

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    maxWidth: TILE_SIZE,
    height: TILE_SIZE * 1.05,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    elevation: 4,
  },

  container: { flex: 1, backgroundColor: '#f1f5f8' },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f8',
  },

  headerBar: { backgroundColor: '#800000', marginTop: 10, height: 50 },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 16,
    marginTop: 10,
  },

  profileCardWrap: { paddingHorizontal: 10 },
  logo: { width: 120, height: 120 },

  profileCard: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 20,
    backgroundColor: '#0f6aa5',
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 5,
    elevation: 4,
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  schoolLogo: { width: 70, height: 70,marginLeft:3 },
  profileCenter: { flex: 1, paddingHorizontal: 12 },
  studentName: { color: '#fff', fontSize: 18, fontWeight: '700' },
  classText: { color: '#fff', fontSize: 12, marginBottom: 4, fontWeight: '500' },
  parentText: { color: '#fff', fontSize: 12, fontWeight: '500' },
  studentImageWrap: {
    width: 70,
    height: 70,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  studentImage: { width: '100%', height: '100%', borderRadius: 40 },

  shortcutsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    backgroundColor: '#083f66',
    paddingHorizontal: 10,
    marginHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 5,
    borderRadius: 8,
  },
  shortcutItem: { alignItems: 'center' },
  shortcutCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutLabel: {
    marginTop: 8,
    color: '#f0f3f5ff',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },

  gridWrap: { marginTop: 12, paddingHorizontal: 12, paddingBottom: 16 },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE * 1.05,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    shadowColor: '#083f66',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  tileIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    backgroundColor: '#e6f0f8',
  },
  tileLabel: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: '#083f66',
  },

  bottomBar: {
    position: 'absolute',
    bottom: 20,
    left: 12,
    right: 12,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#083f66',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 6,
  },
  bottomTab: { alignItems: 'center' },
  bottomLabel: { color: '#fff', fontSize: 12, marginTop: 2 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalContainer: {
    width: '80%',
    height: '100%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  modalBox: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  logoWrap: { alignItems: 'center', marginBottom: 8 },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  schoolName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginVertical: 8,
  },
  modalItem: {
    borderWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f6aa5',
  },

  birthdayBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff9800',
    marginHorizontal: 10,
    marginTop: 10,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  birthdayText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 8,
  },
});

export default Home;
