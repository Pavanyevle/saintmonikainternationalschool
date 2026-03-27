import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import BottomTab from './BottomTab';
import AppHeader from '../components/UI/AppHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeworkScreen = ({ navigation, route }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [homeworkData, setHomeworkData] = useState([]);
  const [loading, setLoading] = useState(true);

  const Class = route.params?.class;

  const fetchHomework = useCallback(async () => {
    try {
      const res = await axios.get(
        `https://international-public-sch-db945-default-rtdb.firebaseio.com/class/${Class}/homework.json`,
      );

      if (res.data) {
        const formattedData = Object.values(res.data);
        setHomeworkData(formattedData);
      } else {
        setHomeworkData([]);
      }
    } catch (error) {
      console.log('Homework fetch error:', error);
      Alert.alert('Error', 'Failed to load homework!');
    } finally {
      setLoading(false);
    }
  }, [Class]);

  useEffect(() => {
    fetchHomework();
  }, [fetchHomework]);

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

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Home Work"
        onMenuPress={() => setMenuVisible(true)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollArea}
      >
        {homeworkData.map((item, index) => (
          <View key={index} style={styles.card}>
            {/* Header */}
            <View style={styles.cardHeader}>
              <Text style={styles.dateText}>{item.date}</Text>
              <Text style={styles.classText}>{item.class}</Text>
            </View>

            <Text style={styles.subjectText}>
              Homework for | {item.subject}
            </Text>

            <View style={styles.divider} />

            {/* Details */}
            <View style={styles.detailSection}>
              {item.details?.map((line, i) => (
                <Text key={i} style={styles.detailText}>
                  • {line}
                </Text>
              ))}
            </View>

            <Text style={styles.teacherText}>{item.teacher}</Text>
          </View>
        ))}

        {homeworkData.length === 0 && (
          <Text style={styles.noDataText}>No homework available.</Text>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.button}>
        <LinearGradient
          colors={['#F97316', '#FB923C']}
          style={styles.gradientBtn}
        >
          <Text style={styles.buttonText}>VIEW ALL</Text>
        </LinearGradient>
      </TouchableOpacity>

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
                    source={require('../Img/ips1.png')}
                    style={styles.modalLogo}
                    resizeMode="contain"
                  />
                </View>
              </View>

              <Text style={styles.schoolName}>
                International Public School
              </Text>
              <View style={styles.separator} />

              {[
                {
                  label: 'My Profile',
                  icon: 'account-circle-outline',
                  screen: 'My Profile',
                },
                {
                  label: 'About Us',
                  icon: 'information-outline',
                  screen: 'About Us',
                },
                {
                  label: 'Help & Support',
                  icon: 'headset',
                  screen: 'HelpAndSupport',
                },
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

      <BottomTab navigation={navigation} />
    </View>
  );
};

export default HomeworkScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollArea: {
    padding: 15,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dateText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  classText: {
    fontSize: 13,
    color: '#F97316',
    fontWeight: '700',
  },
  subjectText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 6,
  },
  detailSection: {
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
    lineHeight: 20,
  },
  teacherText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#6B7280',
    fontSize: 14,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  gradientBtn: {
    borderRadius: 25,
    paddingHorizontal: 50,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
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
  logoWrap: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 20,
  },
  modalLogo: {
    width: 150,
    height: 150,
  },
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
});
