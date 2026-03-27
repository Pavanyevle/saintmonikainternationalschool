import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BIRTHDAY_URL =
  'https://international-public-sch-db945-default-rtdb.firebaseio.com/students.json';

const BirthdayScreen = ({ navigation }) => {
  const [birthdayStudents, setBirthdayStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // आजची तारीख एकदाच compute
  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    fetchBirthdayStudents();
  }, []);

  const fetchBirthdayStudents = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get(BIRTHDAY_URL);

      if (response.data) {
        const allStudents = Object.values(response.data);

        const todayBirthdays = allStudents.filter(student =>
          isBirthdayToday(student.dob, today),
        );

        setBirthdayStudents(todayBirthdays);
      } else {
        setBirthdayStudents([]);
      }
    } catch (error) {
      console.log('Birthday fetch error:', error?.message || error);
      setBirthdayStudents([]);
    } finally {
      setLoading(false);
    }
  }, [today]);

  const isBirthdayToday = (dob, todayDate) => {
    if (!dob) return false;

    let birthDate;

    // YYYY-MM-DD
    if (dob.includes('-') && dob.split('-')[0].length === 4) {
      birthDate = new Date(dob);
    } else {
      // DD-MM-YYYY
      const [day, month, year] = dob.split('-');
      birthDate = new Date(year, month - 1, day);
    }

    if (Number.isNaN(birthDate.getTime())) return false;

    return (
      birthDate.getDate() === todayDate.getDate() &&
      birthDate.getMonth() === todayDate.getMonth()
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Profile Image */}
      <View style={styles.imageWrap}>
        {item.profileImg ? (
          <Image source={{ uri: item.profileImg }} style={styles.image} />
        ) : (
          <MaterialCommunityIcons
            name="account-circle"
            size={72}
            color="#b0c7da"
          />
        )}
      </View>

      {/* Student Info */}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.classText}>Class {item.class}</Text>

        <View style={styles.badge}>
          <MaterialCommunityIcons
            name="cake-variant"
            size={14}
            color="#fff"
          />
          <Text style={styles.badgeText}>Happy Birthday</Text>
        </View>
      </View>
    </View>
  );

  const keyExtractor = (item, index) =>
    item.studentId ? String(item.studentId) : String(index);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#083f66" />

      {/* Header */}
      <LinearGradient colors={['#083f66', '#083f66']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <View>
            <Text style={styles.headerTitle}>🎂 IPSian’s Birthdays</Text>
            <Text style={styles.headerSub}>Today’s Student Birthdays</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Birthday List */}
      <FlatList
        data={birthdayStudents}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading && (
            <Text style={styles.emptyText}>No birthdays today 🎉</Text>
          )
        }
        // FlatList performance tweaks
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews
      />

      {loading && (
        <ActivityIndicator
          size="large"
          color="#0f6aa5"
          style={{ marginTop: 30 }}
        />
      )}
    </SafeAreaView>
  );
};

export default BirthdayScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f8',
  },
  header: {
    paddingVertical: 28,
    paddingHorizontal: 20,
    elevation: 6,
    height: 120,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    padding: 6,
    marginRight: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 15,
  },
  headerSub: {
    color: '#e6f0f8',
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#083f66',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  imageWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e6f0f8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#083f66',
  },
  classText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginTop: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6f00',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 6,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
    fontWeight: '600',
    color: '#777',
  },
});
