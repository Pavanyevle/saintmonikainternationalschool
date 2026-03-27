import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  StatusBar,
  ScrollView,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const skills = [
  { key: 'react', label: 'React Native' },
  { key: 'js', label: 'JavaScript' },
  { key: 'node', label: 'Node.js' },
  { key: 'firebase', label: 'Firebase' },
  { key: 'ui', label: 'UI/UX' },
];

const socialLinks = [
  { key: 'github', icon: <FontAwesome name="github" size={20} />, url: 'https://github.com/' },
  { key: 'linkedin', icon: <FontAwesome name="linkedin" size={20} />, url: 'https://linkedin.com/' },
  { key: 'portfolio', icon: <FontAwesome5 name="globe" size={20} />, url: 'https://example.com/' },
];

const DeveloperProfileScreen = () => {
  const headerAnim = useRef(new Animated.Value(0)).current;
  const avatarScale = useRef(new Animated.Value(0.6)).current;
  const cardFade = useRef(new Animated.Value(0)).current;
  const [pressedSkill, setPressedSkill] = useState(null);

  useEffect(() => {
    const sequence = Animated.stagger(150, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(avatarScale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(cardFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]);

    sequence.start();

    return () => {
      sequence.stop();
    };
  }, [headerAnim, avatarScale, cardFade]);

  const openLink = useCallback(async url => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (err) {
      console.warn('Open link error:', err);
    }
  }, []);

  const handleContact = useCallback(() => {
    const email = 'pavan.yevle@example.com';
    const subject = encodeURIComponent('Hello from your App');
    const body = encodeURIComponent('Hi Pavan,\n\nI would like to connect regarding...');
    const mailto = `mailto:${email}?subject=${subject}&body=${body}`;
    openLink(mailto);
  }, [openLink]);

  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0078d7" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.headerWrap,
            {
              opacity: headerAnim,
              transform: [
                {
                  translateY: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient colors={['#0078d7', '#004c91']} style={styles.header}>
            <Text style={styles.headerTitle}>Developer Info</Text>
          </LinearGradient>
        </Animated.View>

        {/* Avatar */}
        <Animated.View style={[styles.avatarWrap, { transform: [{ scale: avatarScale }] }]}>
          <View style={styles.avatarShadow}>
            <Image source={require('../Img/pavan.jpeg')} style={styles.avatar} />
          </View>
        </Animated.View>

        {/* Info Card */}
        <Animated.View style={[styles.card, { opacity: cardFade }]}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.name}>Pavan Yevle</Text>
              <Text style={styles.role}>React Native Developer</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="email" size={18} color="#0078d7" />
            <Text style={styles.infoText}> pavanyevle6@gmail.com</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="phone" size={18} color="#0078d7" />
            <Text style={styles.infoText}> +91 9144612496</Text>
          </View>
        </Animated.View>

        {/* Skills */}
        <Animated.View style={[styles.card, { opacity: cardFade }]}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsWrap}>
            {skills.map(s => {
              const pressed = pressedSkill === s.key;
              return (
                <TouchableOpacity
                  key={s.key}
                  activeOpacity={0.85}
                  onPress={() => {
                    setPressedSkill(s.key);
                    setTimeout(() => setPressedSkill(null), 300);
                  }}
                >
                  <LinearGradient
                    colors={pressed ? ['#ffd54f', '#ffc107'] : ['#e3f2fd', '#bbdefb']}
                    style={styles.skillGradient}
                  >
                    <Text style={styles.skillLabel}>{s.label}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* About */}
        <Animated.View style={[styles.card, { opacity: cardFade }]}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            Passionate mobile developer focused on building beautiful, performant React Native apps.
            I love crafting clean UI, smooth animations, and delightful user experiences.
          </Text>
        </Animated.View>

        {/* Social + Contact */}
        <Animated.View style={[styles.card, { opacity: cardFade }]}>
          <Text style={styles.sectionTitle}>Connect</Text>
          <View style={styles.socialRow}>
            {socialLinks.map(s => (
              <TouchableOpacity
                key={s.key}
                activeOpacity={0.85}
                style={styles.socialBtn}
                onPress={() => openLink(s.url)}
              >
                {s.icon}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.contactBtnWrap}>
            <TouchableOpacity activeOpacity={0.9} onPress={handleContact}>
              <LinearGradient
                colors={['#0078d7', '#0053a6']}
                style={styles.contactBtn}
              >
                <MaterialIcons name="mail-outline" size={20} color="#fff" />
                <Text style={styles.contactText}>Contact Me</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Text style={styles.footerNote}>© {year} Pavan Yevle</Text>
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DeveloperProfileScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7fbff' },
  container: { paddingVertical: 10, paddingHorizontal: 18, alignItems: 'center' },

  headerWrap: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 18,
    marginTop: 50,
  },
  header: { paddingVertical: 16, paddingHorizontal: 18, borderRadius: 14 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800', textAlign: 'center' },

  avatarWrap: { marginTop: 10, marginBottom: 8, zIndex: 20 },
  avatarShadow: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 6,
  },
  avatar: { width: 130, height: 130, borderRadius: 65, borderWidth: 3, borderColor: '#fff' },

  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e3f2fd',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },

  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { fontSize: 20, fontWeight: '800', color: '#0b5f95' },
  role: { fontSize: 13, marginTop: 4, color: '#4b5563' },

  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  infoText: { fontSize: 14, marginLeft: 8, color: '#4b5563' },

  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#0b5f95', marginBottom: 10 },

  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  skillGradient: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 22,
    alignItems: 'center',
    minWidth: 90,
  },
  skillLabel: { fontSize: 13, fontWeight: '700', color: '#0b5f95' },

  aboutText: { fontSize: 14, lineHeight: 20, color: '#4b5563' },

  socialRow: { flexDirection: 'row', marginTop: 8, gap: 10 },
  socialBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#eef6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  contactBtnWrap: { marginTop: 12 },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  contactText: { color: '#fff', fontWeight: '800', marginLeft: 10 },

  footerNote: { fontSize: 12, color: '#9aa7bd', marginTop: 20 },
});
