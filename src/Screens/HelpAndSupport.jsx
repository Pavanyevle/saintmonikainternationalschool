import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  ScrollView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const PHONE = '+917620010017';
const EMAIL = 'principalipsnow@gmail.com';
const WHATSAPP_URL = `https://wa.me/917620010017?text=${encodeURIComponent(
  'Hello IPS Support',
)}`;

const HelpSupportScreen = ({ navigation }) => {
  const openUrl = useCallback(async url => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (e) {
      console.log('Open URL error:', e);
    }
  }, []);

  const handleCall = () => openUrl(`tel:${PHONE}`);
  const handleEmail = () => openUrl(`mailto:${EMAIL}`);
  const handleWhatsApp = () => openUrl(WHATSAPP_URL);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0072ff" />

      {/* Header */}
      <LinearGradient
        colors={['#083f66', '#083f66']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={navigation.goBack} activeOpacity={0.7}>
            <MaterialCommunityIcons name="arrow-left" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Need Assistance?</Text>
          <Text style={styles.sectionText}>
            We're here to help you! You can reach out to our support team through
            any of the following methods below.
          </Text>
        </View>

        {/* Call */}
        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={handleCall}>
          <View style={[styles.iconWrap, { backgroundColor: '#4CAF50' }]}>
            <MaterialCommunityIcons name="phone" size={24} color="#fff" />
          </View>
          <View style={styles.cardTextWrap}>
            <Text style={styles.cardTitle}>Call Support</Text>
            <Text style={styles.cardSubtitle}>+91-7620010017</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#777" />
        </TouchableOpacity>

        {/* Email */}
        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={handleEmail}>
          <View style={[styles.iconWrap, { backgroundColor: '#FF9800' }]}>
            <MaterialCommunityIcons name="email" size={24} color="#fff" />
          </View>
          <View style={styles.cardTextWrap}>
            <Text style={styles.cardTitle}>Email Us</Text>
            <Text style={styles.cardSubtitle}>{EMAIL}</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#777" />
        </TouchableOpacity>

        {/* WhatsApp */}
        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={handleWhatsApp}>
          <View style={[styles.iconWrap, { backgroundColor: '#25D366' }]}>
            <MaterialCommunityIcons name="whatsapp" size={24} color="#fff" />
          </View>
          <View style={styles.cardTextWrap}>
            <Text style={styles.cardTitle}>Chat on WhatsApp</Text>
            <Text style={styles.cardSubtitle}>+91-7620010017</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#777" />
        </TouchableOpacity>

        {/* FAQ Section */}
        <View style={[styles.section, { marginTop: 26 }]}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqBox}>
            <Text style={styles.faqQ}>Q: How do I reset my password?</Text>
            <Text style={styles.faqA}>
              Go to login screen → tap “Forgot Password” → follow the email link.
            </Text>

            <Text style={styles.faqQ}>Q: How to update my profile?</Text>
            <Text style={styles.faqA}>
              Go to Profile section → Edit Profile → Update details and save.
            </Text>

            <Text style={styles.faqQ}>Q: How can I check homework?</Text>
            <Text style={styles.faqA}>
              Open the Homework section from the home screen to view all assignments.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f9ff' },

  header: {
    height: 120,
    justifyContent: 'flex-end',
    paddingHorizontal: 18,
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 25, fontWeight: '700' },

  scrollContent: {
    padding: 16,
    paddingBottom: 60,
  },

  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#222' },
  sectionText: { fontSize: 14, color: '#555', marginTop: 4, lineHeight: 20 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTextWrap: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#222' },
  cardSubtitle: { fontSize: 13, color: '#666', marginTop: 2 },

  faqBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  faqQ: { fontWeight: '600', color: '#1a4d8f', marginTop: 10 },
  faqA: { color: '#555', marginTop: 4, fontSize: 13, lineHeight: 18 },
});

export default HelpSupportScreen;
