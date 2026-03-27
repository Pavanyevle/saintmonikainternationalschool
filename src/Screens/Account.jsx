import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform } from 'react-native';

// ✅ Memoized QR Image (Single load, no re-renders)
const LOCAL_QR = (() => {
  try {
    return require('../Img/QR.jpg');
  } catch {
    return null;
  }
})();

const PaymentManagementScreen = ({ navigation }) => {
  const [student, setStudent] = useState(null);
  const [fees, setFees] = useState({ total: 0, paid: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQR, setShowQR] = useState(false);  
  const [downloading, setDownloading] = useState(false);
  const [QR_FILE_NAME, setQR_FILE_NAME] = useState(LOCAL_QR ? 'Payment_QR' : null);



  // ✅ Memoized computed values (No recalculation on every render)
  const due = useMemo(() => fees.total - fees.paid, [fees.total, fees.paid]);
  const progress = useMemo(() => 
    fees.total > 0 ? fees.paid / fees.total : 0, [fees.paid, fees.total]
  );

  // ✅ Optimized init with proper error handling
  const init = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const email = await getUserEmail();
      if (!email) {
        setError('Please login first');
        return;
      }

      const studentKey = email.replace(/\./g, "_");
      await fetchStudentData(studentKey);
    } catch (err) {
      setError('Failed to load data');
      console.error('Init error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Optimized email fetch
  const getUserEmail = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem('userData');
      return storedUser ? JSON.parse(storedUser).email : null;
    } catch {
      return null;
    }
  }, []);

  // ✅ Optimized API call with timeout
  const fetchStudentData = useCallback(async (studentKey) => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await axios.get(
        `https://international-public-sch-db945-default-rtdb.firebaseio.com/students/${studentKey}.json`,
        { signal: controller.signal }
      );

      clearTimeout(timeout);

      if (!res.data) {
        Alert.alert('Error', 'Student data not found');
        return;
      }

      setStudent(res.data);
      setFees(res.data.fees || { total: 0, paid: 0 });
    } catch (err) {
      if (err.code !== 'ERR_CANCELED') {
        Alert.alert('Error', 'Network error. Please check connection.');
      }
    }
  }, []);

  // ✅ Memoized handlers (No recreation on re-renders)
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  useEffect(() => {
    init();
  }, [init]);

  const toggleQR = () => setShowQR(!showQR);

  const downloadQR = async () => {
  try {
    setDownloading(true);

    const destPath =
      RNFS.DownloadDirectoryPath + `/Payment_QR_${Date.now()}.jpeg`;

    // 🔥 IMPORTANT: copyFileAssets
    await RNFS.copyFileAssets(QR_FILE_NAME, destPath);

    Alert.alert(
      'Success ✅',
      'QR saved in Downloads folder'
    );
  } catch (err) {
    console.log('DOWNLOAD ERROR:', err);
    Alert.alert('Error', 'Download failed');
  } finally {
    setDownloading(false);
  }
};

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0078d7" />
      </View>
    );
  }


  // ✅ Error State
  if (error && !student) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0057a0" />
        <LinearGradient colors={['#083f66', '#083f66']} style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Management</Text>
          <FontAwesome5 name="wallet" size={22} color="#fff" />
        </LinearGradient>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#ff6b6b" />
          <Text style={styles.errorTitle}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={init}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0057a0" />

      {/* Header */}
      <LinearGradient colors={['#083f66', '#083f66']} style={styles.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Management</Text>
        <FontAwesome5 name="wallet" size={22} color="#fff" />
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Student Profile Card */}
        <View style={styles.profileCard}>
          {student?.profileImg ? (
            <Image source={{ uri: student.profileImg }} style={styles.profileImage} />
          ) : (
            <MaterialCommunityIcons name="account-circle" size={70} color="#ccc" />
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{student?.name || 'Loading...'}</Text>
            <Text style={styles.userId}>ID: {student?.studentId || '----'}</Text>
          </View>
        </View>

        {/* Payment Summary */}
        <LinearGradient colors={['#c2e9fb', '#a1c4fd']} style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Payment Summary</Text>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryAmount}>₹{fees.total.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Paid</Text>
              <Text style={[styles.summaryAmount, styles.paidAmount]}>
                ₹{fees.paid.toLocaleString()}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Due</Text>
              <Text style={[styles.summaryAmount, styles.dueAmount]}>
                ₹{due.toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {Math.round(progress * 100)}% Paid
          </Text>
        </LinearGradient>

        {/* Pay Now Card */}
        <LinearGradient colors={['#00c6ff', '#0072ff']} style={styles.payCard}>
          <View>
            <Text style={styles.payTitle}>Remaining Balance</Text>
            <Text style={styles.payAmount}>₹{due.toLocaleString()}</Text>
          </View>
          <TouchableOpacity 
            style={styles.payBtnContainer}
            onPress={toggleQR}
            activeOpacity={0.8}
          >
            <LinearGradient colors={['#38ef7d', '#11998e']} style={styles.payBtn}>
              <Ionicons name="qr-code-outline" size={20} color="#fff" />
              <Text style={styles.payBtnText}>Pay Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>

        {/* QR Payment Section */}
        {showQR && (
          <View style={styles.qrContainer}>
            <Text style={styles.qrTitle}>Scan to Pay ₹{due.toLocaleString()}</Text>
            
            <View style={styles.qrWrapper}>
              {LOCAL_QR ? (
                <Image source={LOCAL_QR} style={styles.qrImage} resizeMode="contain" />
              ) : (
                <View style={styles.qrFallback}>
                  <Ionicons name="image-outline" size={50} color="#999" />
                  <Text style={styles.qrFallbackText}>QR Code Unavailable</Text>
                </View>
              )}
            </View>
<TouchableOpacity
              onPress={downloadQR}
              disabled={downloading}
              style={styles.downloadBtn}
            >
              <MaterialCommunityIcons name="download" size={20} color="#fff" />
              <Text style={styles.downloadText}>
                {downloading ? 'Downloading...' : 'Download QR'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ✅ Optimized Styles (Consolidated + Performant)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7faff' },
  scrollContent: { paddingBottom: 30 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7faff' },

  header: {
    height: 120,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  headerTitle: { 
    color: '#fff', 
    fontSize: 25, 
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 20,
  },

  profileCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  profileImage: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#e1e8ed',
  },
  profileInfo: { flex: 1 },
  userName: { fontSize: 20, fontWeight: '700', color: '#0b5f95', marginBottom: 2 },
  userId: { fontSize: 14, color: '#666' },

  summaryCard: { 
    margin: 20, 
    borderRadius: 16, 
    padding: 24, 
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  summaryTitle: { fontSize: 20, fontWeight: '700', color: '#0b5f95', marginBottom: 20 },
  summaryRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20 
  },
  summaryItem: { alignItems: 'center', flex: 1 },
  summaryLabel: { fontSize: 14, color: '#666', marginBottom: 4 },
  summaryAmount: { fontSize: 18, fontWeight: '700' },
  paidAmount: { color: '#28a745' },
  dueAmount: { color: '#dc3545' },

  progressContainer: {
    height: 10,
    backgroundColor: '#e9ecef',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: { 
    height: '100%', 
    backgroundColor: '#0078d7',
    borderRadius: 10,
  },
  progressText: { 
    textAlign: 'right', 
    fontSize: 14, 
    fontWeight: '600',
    color: '#0b5f95',
  },

  payCard: {
    margin: 20,
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 8,
  },
  payTitle: { color: '#fff', fontSize: 16, marginBottom: 4 },
  payAmount: { color: '#fff', fontSize: 28, fontWeight: '800' },

  payBtnContainer: { borderRadius: 16, overflow: 'hidden' },
  payBtn: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  payBtnText: { 
    color: '#fff', 
    marginLeft: 8, 
    fontSize: 16, 
    fontWeight: '700' 
  },

  qrContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  qrImage: { width: 240, height: 240 },

  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0078d7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 16,
  },
  downloadText: { color: '#fff', fontWeight: '700', marginLeft: 8 },
  qrTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#0b5f95', 
    marginBottom: 16 
  },
  qrWrapper: { marginBottom: 16 },
  qrImage: { 
    width: 240, 
    height: 240, 
  },
  qrFallback: {
    width: 240,
    height: 240,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  qrFallbackText: { 
    marginTop: 12, 
    color: '#6c757d', 
    fontSize: 16, 
    fontWeight: '600' 
  },

  localTag: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 20,
  },
  localText: { 
    marginLeft: 6, 
    color: '#1976d2', 
    fontWeight: '600' 
  },

  // ✅ Error States
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f7faff',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#dc3545',
    textAlign: 'center',
    marginVertical: 20,
  },
  retryBtn: {
    backgroundColor: '#0078d7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentManagementScreen;
