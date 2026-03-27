import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
  Switch,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ContactUsScreen = ({ navigation }) => {
  const [isDark, setIsDark] = useState(true);

  const handleToggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  const openUrl = useCallback(async url => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        Linking.openURL(url);
      }
    } catch (e) {
      console.log('Open URL error:', e);
    }
  }, []);

  const cardBackground = isDark ? '#2f3b52' : '#5a189a';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.center}>

        {/* Theme Switch */}
        <View style={styles.switchWrapper}>
          <Switch
            value={isDark}
            onValueChange={handleToggleTheme}
            thumbColor="#fff"
            trackColor={{ false: '#d1d5db', true: '#9ca3af' }}
          />
        </View>

        {/* Card */}
        <View style={[styles.card, { backgroundColor: cardBackground }]}>
          
          {/* Back Arrow */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={navigation.goBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          {/* Logo */}
          <Image
            source={require('../Img/logo.png')} // 👉 new logo add kar
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Title */}
          <Text style={styles.title}>Saint Monica International School</Text>

          {/* Address */}
          <Text style={styles.heading}>Address</Text>
          <Text style={styles.text}>
            Saint Monica International School,  
            (CBSE Affiliated)  
            Maharashtra, India
          </Text>

          {/* Contact */}
          <Text style={styles.heading}>Contact</Text>
          <Text style={styles.text}>
            📞 +91-XXXXXXXXXX  
            📧 info@saintmonicainternationalschool.com
          </Text>

          {/* About Short */}
          <Text style={styles.heading}>About School</Text>
          <Text style={styles.text}>
            Saint Monica International School is committed to providing
            high-quality education with modern teaching methods.
            The school focuses on overall personality development,
            discipline, and academic excellence.
          </Text>

          {/* Social Icons */}
          <View style={styles.socialRow}>

            <TouchableOpacity
              style={[styles.socialBtn, { backgroundColor: '#e1306c' }]}
              onPress={() => openUrl('https://www.instagram.com')}
            >
              <FontAwesome name="instagram" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialBtn, { backgroundColor: '#1877f2' }]}
              onPress={() => openUrl('https://www.facebook.com')}
            >
              <FontAwesome name="facebook" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialBtn, { backgroundColor: '#25D366' }]}
              onPress={() => openUrl('https://wa.me/91XXXXXXXXXX')}
            >
              <FontAwesome name="whatsapp" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialBtn, { backgroundColor: '#000' }]}
              onPress={() =>
                openUrl('https://www.saintmonicainternationalschool.com/')
              }
            >
              <FontAwesome name="globe" size={22} color="#fff" />
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContactUsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  center: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },

  switchWrapper: {
    marginBottom: 15,
  },

  card: {
    width: '90%',
    borderRadius: 18,
    padding: 20,
    elevation: 10,
  },

  backBtn: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 10,
  },

  logo: {
    width: '100%',
    height: 150,
    marginBottom: 15,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },

  heading: {
    fontSize: 15,
    fontWeight: '600',
    color: '#c7d2fe',
    marginTop: 10,
  },

  text: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 25,
    flexWrap: 'wrap',
    gap: 10,
  },

  socialBtn: {
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});