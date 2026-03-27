import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  StatusBar,
  Dimensions,
  SafeAreaView,
  Animated,
  ScrollView,
  Platform,
  Linking,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const BASE = 'http://www.saintmonicainternationalschool.com';

// ── Colors ────────────────────────────────────────────────────────────────────
const C = {
  primary:   '#1A237E',
  secondary: '#C62828',
  accent:    '#FDD835',
  gold:      '#F9A825',
  teal:      '#00796B',
  purple:    '#6A1B9A',
  orange:    '#E65100',
  surface:   '#F0F2FF',
  white:     '#FFFFFF',
  text:      '#1A1A2E',
  subtext:   '#5C6BC0',
  card:      '#FFFFFF',
  overlay:   'rgba(10,10,40,0.92)',
};

// ── Achievement Data (from website) ──────────────────────────────────────────
const ACHIEVEMENTS = [
  {
    id: '1',
    title: 'Grade 10 Result — Academic Year 2023-24',
    shortDesc:
      'Outstanding results of Grade 10 students of Saint Monica International School for the academic year 2023-24.',
    fullDesc:
      'Saint Monica International School proudly announces the exceptional results of its Grade 10 students for the academic year 2023-24. Our students have once again demonstrated their academic excellence and commitment to learning, making the school and their families proud.',
    image: `${BASE}//images/achievements/3820230621090950.jpeg`,
    category: 'Academics',
    icon: '🏆',
    color: C.gold,
    year: '2024',
    url: `${BASE}/achievement/result-of-grade-10-students-of-saint-monica-international-school-of-academic-year-2023-24`,
  },
  {
    id: '2',
    title: 'State Level Karate Competition Winners',
    shortDesc:
      '23 students of SMIS got medals in State Level competition held at Aurangabad, organised by National Youth Games of Maharashtra.',
    fullDesc:
      '23 students of SMIS got medals in State Level competition held at Aurangabad. It was organised by National Youth Games of Maharashtra. This is a proud moment for our school as our students excelled at the state level, showcasing their dedication, discipline, and martial arts skills.',
    image: `${BASE}//images/achievements/9920220923044732.jpeg`,
    category: 'Sports',
    icon: '🥋',
    color: C.secondary,
    year: '2022',
    url: `${BASE}/achievement/state-level-karate-competition-winners`,
  },
  {
    id: '3',
    title: 'Grade 10 Result — Academic Year 2022-23',
    shortDesc:
      'Excellent results of Grade 10 students of Saint Monica International School for the academic year 2022-23.',
    fullDesc:
      'Saint Monica International School celebrates the brilliant performance of its Grade 10 batch for the academic year 2022-23. Students achieved remarkable scores, reflecting the hard work of both students and dedicated faculty members.',
    image: `${BASE}//images/achievements/4520220912094234.jpg`,
    category: 'Academics',
    icon: '📚',
    color: C.teal,
    year: '2023',
    url: `${BASE}/achievement/grade-10-resl`,
  },
  {
    id: '4',
    title: 'Qualified Vidhyarti Vigyan Manthan Exam 2022',
    shortDesc:
      'Our student Vaidehi Ravindra Markad of Grade 9 qualified Vidhyarti Vigyan Manthan Exam 2022.',
    fullDesc:
      'Our talented student Vaidehi Ravindra Markad from Grade 9 has successfully qualified the prestigious Vidhyarti Vigyan Manthan Exam 2022. This national-level science talent search examination is conducted to identify and nurture young scientific talent. Vaidehi\'s achievement is a testament to her scientific aptitude and hard work.',
    image: `${BASE}//images/achievements/5620220311090036.jpeg`,
    category: 'Science',
    icon: '🔬',
    color: C.purple,
    year: '2022',
    url: `${BASE}/achievement/qualified-vidhyarti-vigyan-manthan-exam-2022`,
  },
  {
    id: '5',
    title: 'Qualified Sainik School (Satara) Entrance Exam 2022',
    shortDesc:
      'Our student Kartik Ajay Jadhav qualified All India Sainik School (Satara) Entrance Exam 2022.',
    fullDesc:
      'Saint Monica International School student Kartik Ajay Jadhav has qualified the All India Sainik School (Satara) Entrance Exam 2022. This highly competitive national-level entrance examination is conducted for admission to Sainik Schools across India. Kartik\'s success is a remarkable achievement and a matter of great pride for the school.',
    image: `${BASE}//images/achievements/1720220311085848.jpeg`,
    category: 'Defence',
    icon: '🎖️',
    color: C.orange,
    year: '2022',
    url: `${BASE}/achievement/qualified-all-india-sainiki-school-satara-entrance-exam-2022`,
  },
  {
    id: '6',
    title: 'Bronze Medal — Karate Pinchak-Silat National School',
    shortDesc:
      'SMIS student Prajakta Mandge of Grade 9 got selected for National Level in Pinchak-Silat and won a Bronze Medal.',
    fullDesc:
      'Our Saint Monica International School student Prajakta Mandge of Grade 9 got selected for the National Level in PINCHAK-SILAT and there she won a Bronze Medal. This remarkable achievement at the national level demonstrates Prajakta\'s extraordinary talent, perseverance, and sportsmanship. We are incredibly proud of her accomplishment.',
    image: `${BASE}//images/achievements/2020220302054736.jpeg`,
    category: 'Sports',
    icon: '🥉',
    color: C.secondary,
    year: '2022',
    url: `${BASE}/achievement/bronze-medal-in-karate-pinchak-silat-at-national-school`,
  },
  {
    id: '7',
    title: 'Qualified Navodaya Exam',
    shortDesc:
      'Our school student Atharva Anil Paithanpagare (Grade 5) qualified Navodaya Exam and got selected for Navodaya School.',
    fullDesc:
      'Our school student Atharva Anil Paithanpagare from Grade 5 has qualified the prestigious Navodaya Vidyalaya entrance exam and has been selected for Navodaya School. The Jawahar Navodaya Vidyalaya selection test is one of the most competitive examinations at the primary level, and Atharva\'s selection reflects his exceptional academic ability.',
    image: `${BASE}//images/achievements/8120220311085554.jpeg`,
    category: 'Academics',
    icon: '⭐',
    color: C.primary,
    year: '2022',
    url: `${BASE}/achievement/qualified-navodaya-exam`,
  },
];

const CATEGORY_COLORS = {
  Academics: C.teal,
  Sports:    C.secondary,
  Science:   C.purple,
  Defence:   C.orange,
};

// ── AnimatedCard ──────────────────────────────────────────────────────────────
const AnimatedCard = ({ item, index, onPress }) => {
  const slideAnim = useRef(new Animated.Value(60)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const catColor = CATEGORY_COLORS[item.category] || C.primary;

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity style={styles.card} activeOpacity={0.88} onPress={() => onPress(item)}>
        {/* Left color stripe */}
        <View style={[styles.cardStripe, { backgroundColor: catColor }]} />

        {/* Image */}
        <View style={styles.cardImageWrap}>
          <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
          {/* Icon badge */}
          <View style={[styles.iconBadge, { backgroundColor: catColor }]}>
            <Text style={styles.iconBadgeText}>{item.icon}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <View style={styles.cardTopRow}>
            <View style={[styles.catTag, { backgroundColor: catColor + '20', borderColor: catColor }]}>
              <Text style={[styles.catTagText, { color: catColor }]}>{item.category}</Text>
            </View>
            <View style={styles.yearTag}>
              <Text style={styles.yearTagText}>{item.year}</Text>
            </View>
          </View>

          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.cardDesc} numberOfLines={3}>{item.shortDesc}</Text>

          <TouchableOpacity
            style={[styles.readMoreBtn, { backgroundColor: catColor }]}
            onPress={() => onPress(item)}
          >
            <Text style={styles.readMoreText}>Read More  →</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ── Detail Modal ──────────────────────────────────────────────────────────────
const DetailModal = ({ visible, item, onClose }) => {
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 12,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!item) return null;
  const catColor = CATEGORY_COLORS[item.category] || C.primary;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <StatusBar barStyle="light-content" backgroundColor={C.overlay} />
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.modalDismiss} onPress={onClose} />
        <Animated.View style={[styles.modalSheet, { transform: [{ translateY: slideAnim }] }]}>

          {/* Hero Image */}
          <View style={styles.modalHeroWrap}>
            <Image source={{ uri: item.image }} style={styles.modalHero} resizeMode="cover" />
            <View style={[styles.modalHeroOverlay, { backgroundColor: catColor + 'CC' }]} />
            {/* Close */}
            <TouchableOpacity style={styles.modalClose} onPress={onClose}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            {/* Icon + category */}
            <View style={styles.modalHeroBottom}>
              <Text style={styles.modalHeroIcon}>{item.icon}</Text>
              <View>
                <View style={styles.modalCatBadge}>
                  <Text style={styles.modalCatBadgeText}>{item.category}  •  {item.year}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Content */}
          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>{item.title}</Text>

            {/* Divider */}
            <View style={styles.modalDividerRow}>
              <View style={[styles.modalDivider, { backgroundColor: catColor }]} />
              <Text style={styles.modalDividerStar}>★</Text>
              <View style={[styles.modalDivider, { backgroundColor: catColor }]} />
            </View>

            <Text style={styles.modalDesc}>{item.fullDesc}</Text>

            {/* Stats row */}
            <View style={styles.statsRow}>
              <View style={[styles.statBox, { borderColor: catColor }]}>
                <Text style={[styles.statIcon]}>{item.icon}</Text>
                <Text style={[styles.statLabel, { color: catColor }]}>Achievement</Text>
              </View>
              <View style={[styles.statBox, { borderColor: catColor }]}>
                <Text style={styles.statIcon}>🏫</Text>
                <Text style={[styles.statLabel, { color: catColor }]}>SMIS</Text>
              </View>
              <View style={[styles.statBox, { borderColor: catColor }]}>
                <Text style={styles.statIcon}>📅</Text>
                <Text style={[styles.statLabel, { color: catColor }]}>{item.year}</Text>
              </View>
            </View>

            {/* Visit button */}
            <TouchableOpacity
              style={[styles.visitBtn, { backgroundColor: catColor }]}
              onPress={() => Linking.openURL(item.url)}
            >
              <Text style={styles.visitBtnText}>🌐  View on Website</Text>
            </TouchableOpacity>

            <View style={{ height: 30 }} />
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ── Main Screen ───────────────────────────────────────────────────────────────
const AchievementsScreen = () => {
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  }, []);

  const openDetail = (item) => {
    setSelected(item);
    setModalVisible(true);
  };

  // Stats summary
  const totalAchievements = ACHIEVEMENTS.length;
  const sportsCount   = ACHIEVEMENTS.filter(a => a.category === 'Sports').length;
  const academicsCount = ACHIEVEMENTS.filter(a => a.category === 'Academics').length;

  const ListHeader = () => (
    <Animated.View style={{ opacity: headerAnim }}>
      {/* Hero Banner */}
      <View style={styles.heroBanner}>
        <Image source={{ uri: `${BASE}/images/logo.png` }} style={styles.heroLogo} resizeMode="contain" />
        <Text style={styles.heroTitle}>Our Achievements</Text>
        <Text style={styles.heroSub}>Saint Monica International School</Text>
        <Text style={styles.heroTagline}>
          Excellence in Academics, Sports & Beyond 🌟
        </Text>

        {/* Stats Bar */}
        <View style={styles.statsBar}>
          <View style={styles.statsBarItem}>
            <Text style={styles.statsBarNum}>{totalAchievements}+</Text>
            <Text style={styles.statsBarLabel}>Achievements</Text>
          </View>
          <View style={styles.statsBarDivider} />
          <View style={styles.statsBarItem}>
            <Text style={styles.statsBarNum}>{academicsCount}</Text>
            <Text style={styles.statsBarLabel}>Academic</Text>
          </View>
          <View style={styles.statsBarDivider} />
          <View style={styles.statsBarItem}>
            <Text style={styles.statsBarNum}>{sportsCount}</Text>
            <Text style={styles.statsBarLabel}>Sports</Text>
          </View>
          <View style={styles.statsBarDivider} />
          <View style={styles.statsBarItem}>
            <Text style={styles.statsBarNum}>🥇</Text>
            <Text style={styles.statsBarLabel}>National</Text>
          </View>
        </View>
      </View>

      {/* Section title */}
      <View style={styles.sectionRow}>
        <View style={styles.sectionAccent} />
        <Text style={styles.sectionTitle}>Hall of Fame</Text>
        <View style={styles.sectionAccentRight} />
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      {/* Navbar */}
      <View style={styles.navbar}>
       
      </View>

      <FlatList
        data={ACHIEVEMENTS}
        keyExtractor={i => i.id}
        renderItem={({ item, index }) => (
          <AnimatedCard item={item} index={index} onPress={openDetail} />
        )}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <DetailModal
        visible={modalVisible}
        item={selected}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.surface },

  // Navbar
  navbar: {
    backgroundColor: C.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  navTitle: { color: C.white, fontSize: 18, fontWeight: '800' },
  navBadge: {
    backgroundColor: C.accent,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  navBadgeText: { color: C.primary, fontWeight: '800', fontSize: 13 },

  // Hero Banner
  heroBanner: {
    backgroundColor: C.primary,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 30,
    paddingHorizontal: 20,
    marginBottom: 8,
    elevation: 5,
  },
  heroLogo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2.5,
    borderColor: C.accent,
    backgroundColor: C.white,
    marginBottom: 12,
  },
  heroTitle: { color: C.white, fontSize: 24, fontWeight: '900', letterSpacing: 0.5 },
  heroSub: { color: C.accent, fontSize: 12, fontWeight: '600', marginTop: 2 },
  heroTagline: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Stats Bar
  statsBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 18,
    marginTop: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    width: '100%',
  },
  statsBarItem: { flex: 1, alignItems: 'center' },
  statsBarNum: { color: C.accent, fontSize: 20, fontWeight: '900' },
  statsBarLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 10, marginTop: 2, fontWeight: '600' },
  statsBarDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 4 },

  // Section title
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionAccent: { flex: 1, height: 2, backgroundColor: C.primary, borderRadius: 2 },
  sectionAccentRight: { flex: 1, height: 2, backgroundColor: C.primary, borderRadius: 2 },
  sectionTitle: {
    color: C.primary,
    fontSize: 16,
    fontWeight: '900',
    marginHorizontal: 10,
    letterSpacing: 1,
  },

  // List
  listContent: { paddingBottom: 30 },

  // Card
  card: {
  flexDirection: 'row',
  backgroundColor: C.card,
  borderRadius: 18,
  marginHorizontal: 14,
  marginBottom: 14,
  elevation: 4,
  overflow: 'hidden',
  minHeight: 150,   // 🔥 add this
},
  cardStripe: { width: 5 },
  cardImageWrap: { 
  width: 110,
  height: 150,
  overflow: 'hidden',
  borderTopLeftRadius: 18,
  borderBottomLeftRadius: 18,
},

cardImage: { 
  width: '100%',
  height: '100%',
},
  iconBadge: {
    position: 'absolute',
    top: 8, left: 8,
    width: 32, height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  iconBadgeText: { fontSize: 16 },

  cardContent: { flex: 1, padding: 12, justifyContent: 'space-between' },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },

  catTag: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  catTagText: { fontSize: 10, fontWeight: '700' },

  yearTag: {
    backgroundColor: C.surface,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  yearTagText: { fontSize: 10, color: C.subtext, fontWeight: '600' },

  cardTitle: {
    color: C.text,
    fontSize: 13.5,
    fontWeight: '800',
    lineHeight: 19,
    marginBottom: 5,
  },
  cardDesc: {
    color: '#666',
    fontSize: 11.5,
    lineHeight: 17,
    flex: 1,
  },
  readMoreBtn: {
    marginTop: 10,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    alignSelf: 'flex-start',
  },
  readMoreText: { color: C.white, fontSize: 11, fontWeight: '700' },

  // Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalDismiss: { flex: 1 },
  modalSheet: {
    backgroundColor: C.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: height * 0.88,
    overflow: 'hidden',
  },

  // Modal Hero
  modalHeroWrap: { height: 200, position: 'relative' },
  modalHero: { width: '100%', height: '100%' },
  modalHeroOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  },
  modalClose: {
    position: 'absolute',
    top: 14, right: 14,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 20,
    width: 36, height: 36,
    justifyContent: 'center', alignItems: 'center',
    zIndex: 10,
  },
  modalCloseText: { color: C.white, fontSize: 16, fontWeight: '700' },
  modalHeroBottom: {
    position: 'absolute',
    bottom: 14, left: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalHeroIcon: { fontSize: 34, marginRight: 10 },
  modalCatBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  modalCatBadgeText: { color: C.white, fontWeight: '700', fontSize: 12 },

  // Modal Body
  modalBody: { padding: 20 },
  modalTitle: {
    color: C.text,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 26,
    marginBottom: 12,
  },
  modalDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalDivider: { flex: 1, height: 2, borderRadius: 2 },
  modalDividerStar: { marginHorizontal: 8, color: C.gold, fontSize: 14 },
  modalDesc: {
    color: '#444',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },

  // Stats row in modal
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  statIcon: { fontSize: 22, marginBottom: 4 },
  statLabel: { fontSize: 11, fontWeight: '700' },

  // Visit btn
  visitBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  visitBtnText: { color: C.white, fontWeight: '800', fontSize: 15 },
});

export default AchievementsScreen;