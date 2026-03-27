import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AboutUs = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f6aa5" />
      
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity 
          style={styles.backIcon} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={26} color="#494343ff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Logo */}
        <View style={styles.logoSection}>
          <Image source={require('../Img/logo.png')} style={styles.logo} />
          <Text style={styles.schoolName}>Saint Monica International School</Text>
          <Text style={styles.established}>A Place of Excellence in Education</Text>
        </View>

        {/* About */}
        <View style={styles.card}>
          <Text style={styles.aboutText}>
            Saint Monica International School is dedicated to providing high-quality education
            that nurtures young minds and prepares them for a successful future. Our school
            focuses on academic excellence along with discipline, creativity, and character development.
          </Text>

          <Text style={styles.aboutText}>
            We believe in creating a safe and inspiring environment where every student can explore
            their talents and achieve their full potential. Our aim is to develop confident,
            responsible, and future-ready individuals.
          </Text>
        </View>

        {/* Vision */}
        <LinearGradient colors={['#00b09b', '#96c93d']} style={styles.infoCard}>
          <Icon name="eye-outline" size={30} color="#fff" />
          <Text style={styles.infoTitle}>OUR VISION</Text>
          <Text style={styles.infoText}>
            To empower students with knowledge, values, and skills that help them become
            responsible global citizens and achieve excellence in life.
          </Text>
        </LinearGradient>

        {/* Mission */}
        <LinearGradient colors={['#ff9966', '#ff5e62']} style={styles.infoCard}>
          <Icon name="target" size={30} color="#fff" />
          <Text style={styles.infoTitle}>OUR MISSION</Text>
          <Text style={styles.infoText}>
            To provide quality education that promotes intellectual growth, creativity,
            discipline, and strong moral values while preparing students for future challenges.
          </Text>
        </LinearGradient>

        {/* Motto */}
        <LinearGradient colors={['#7c23c5', '#9723c5']} style={styles.mottoSection}>
          <Text style={styles.mottoTitle}>OUR MOTTO</Text>
          <Text style={styles.mottoText}>Learn • Grow • Succeed</Text>
          <Text style={styles.mottoDesc}>
            Our motto inspires students to learn continuously, grow confidently,
            and succeed in all aspects of life through dedication and hard work.
          </Text>
        </LinearGradient>

        {/* Timeline */}
        <Text style={styles.sectionTitle}>Our Journey</Text>
        <View style={styles.timeline}>
          {[
            { year: '2018', desc: 'Foundation of Saint Monica International School.' },
            { year: '2020', desc: 'Introduction of modern teaching methods.' },
            { year: '2023', desc: 'Expansion of facilities and digital learning.' },
            { year: '2025', desc: 'Continuous growth towards excellence.' },
          ].map((item, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.dot} />
              <Text style={styles.timelineYear}>{item.year}</Text>
              <Text style={styles.timelineDesc}>{item.desc}</Text>
            </View>
          ))}
        </View>

        {/* Principal Message */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRINCIPAL'S MESSAGE</Text>
          <Text style={styles.personName}>Principal</Text>
          <Text style={styles.quote}>"Education is the foundation of success"</Text>
          <Text style={styles.paragraph}>
            At Saint Monica International School, we are committed to nurturing students with
            knowledge, discipline, and values required for a successful future. Our goal is to
            ensure holistic development and prepare students to face real-world challenges.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            📍 Saint Monica International School
          </Text>
          <Text style={styles.footerText}>
            © 2025 Saint Monica International School
          </Text>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  scrollContent: { paddingBottom: 20 },

  headerRow: { flexDirection: 'row', marginTop: 40 },
  backIcon: { marginLeft: 15 },

  logoSection: { alignItems: 'center',},
  logo: { width: 150, height: 140, },
  schoolName: { fontSize: 20, fontWeight: '700', color: '#0f6aa5' },
  established: { fontSize: 13, color: '#777' },

  card: {
    backgroundColor: '#fff',
    margin: 14,
    padding: 14,
    borderRadius: 10,
  },
  aboutText: { fontSize: 14, marginBottom: 8 },

  infoCard: {
    borderRadius: 16,
    padding: 18,
    margin: 14,
    alignItems: 'center',
  },
  infoTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  infoText: { color: '#fff', textAlign: 'center' },

  mottoSection: { margin: 14, padding: 16, borderRadius: 12 },
  mottoTitle: { color: '#fff', fontSize: 18 },
  mottoText: { color: '#fff' },
  mottoDesc: { color: '#fff' },

  sectionTitle: { textAlign: 'center', fontSize: 16, fontWeight: '700' },
  section: { margin: 14, alignItems: 'center' },

  personImage: { width: 100, height: 100, borderRadius: 50 },
  personName: { fontWeight: '700' },
  quote: { fontStyle: 'italic' },
  paragraph: { textAlign: 'center' },

  timeline: { margin: 20 },
  timelineItem: { marginBottom: 10 },
  dot: { width: 10, height: 10, backgroundColor: '#0f6aa5' },
  timelineYear: { fontWeight: '700' },

  footer: { alignItems: 'center', marginTop: 20 },
  footerText: { fontSize: 12, color: '#777' },
});

export default AboutUs;