import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../components/UI/AppHeader';
import BottomTab from './BottomTab';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL =
  'https://international-public-sch-db945-default-rtdb.firebaseio.com/class/10/notice.json';

const NoticeScreen = ({ navigation, route }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const student = route.params?.student;

  const fetchNotices = useCallback(async () => {
    try {
      const res = await axios.get(API_URL);

      if (res.data) {
        const formatted = Object.values(res.data);
        setNotices(formatted);
      } else {
        setNotices([]);
      }
    } catch (err) {
      console.log('Error fetching notices:', err);
      Alert.alert('Error', 'Failed to load notices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

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

  return (
    <View style={styles.container}>
      <AppHeader title="Notice" onMenuPress={() => setMenuVisible(true)} />

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#F97316" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollArea}
        >
          {notices.length === 0 ? (
            <Text style={styles.emptyText}>No notices available</Text>
          ) : (
            notices.map((item, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.date}>{item.date}</Text>
                  <Text style={styles.type}>{item.type}</Text>
                </View>

                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>

                {item.messageHindi && (
                  <Text style={styles.messageHindi}>{item.messageHindi}</Text>
                )}

                {item.file && (
                  <TouchableOpacity
                    style={styles.downloadBtn}
                    onPress={() => {
                      // TODO: implement file download / open
                    }}
                  >
                    <MaterialCommunityIcons
                      name="download-outline"
                      size={18}
                      color="#004D60"
                    />
                    <Text style={styles.downloadText}>Download</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.viewAllBtn}>
        <LinearGradient
          colors={['#F97316', '#FB923C']}
          style={styles.gradientBtn}
        >
          <Text style={styles.viewAllText}>VIEW ALL</Text>
        </LinearGradient>
      </TouchableOpacity>

      <BottomTab navigation={navigation} />

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

              <Text style={styles.schoolName}>International Public School</Text>
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
                <MaterialCommunityIcons
                  name="logout"
                  size={22}
                  color="red"
                />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default NoticeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollArea: {
    padding: 15,
  },
  scrollContent: {
    paddingBottom: 100,
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
  date: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  type: {
    fontSize: 13,
    color: '#F97316',
    fontWeight: '700',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
    lineHeight: 20,
  },
  messageHindi: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  downloadText: {
    color: '#004D60',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#6B7280',
  },
  viewAllBtn: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  gradientBtn: {
    borderRadius: 25,
    paddingHorizontal: 50,
    paddingVertical: 12,
  },
  viewAllText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
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
    marginBottom: 8,
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
