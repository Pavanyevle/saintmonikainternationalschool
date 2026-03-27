import React, { useState, useRef } from 'react';
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
  ScrollView,
  SafeAreaView,
  Animated,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const BASE_URL = 'http://www.saintmonicainternationalschool.com';

// ── Gallery Data ─────────────────────────────────────────────────────────────
const GALLERY_DATA = [
  // Event
  { id: '1',  uri: `${BASE_URL}/images/gallery/6820240621065325.jpeg`, category: 'Event' },
  { id: '2',  uri: `${BASE_URL}/images/gallery/5320240326052136.jpeg`, category: 'Event' },
  { id: '3',  uri: `${BASE_URL}/images/gallery/1320240326052116.jpeg`, category: 'Event' },
  { id: '4',  uri: `${BASE_URL}/images/gallery/7820240326051628.jpeg`, category: 'Event' },
  { id: '5',  uri: `${BASE_URL}/images/gallery/2120240326051615.jpeg`, category: 'Event' },
  { id: '6',  uri: `${BASE_URL}/images/gallery/6420240326051550.jpeg`, category: 'Event' },
  // Sports
  { id: '7',  uri: `${BASE_URL}/images/gallery/8820240326051525.jpeg`, category: 'Sports' },
  { id: '8',  uri: `${BASE_URL}/images/gallery/4220240326051449.jpeg`, category: 'Sports' },
  { id: '9',  uri: `${BASE_URL}/images/gallery/8420240326051424.jpeg`, category: 'Sports' },
  { id: '10', uri: `${BASE_URL}/images/gallery/5620240326051406.jpeg`, category: 'Sports' },
  { id: '11', uri: `${BASE_URL}/images/gallery/4720240326051333.jpeg`, category: 'Sports' },
  // Dance
  { id: '12', uri: `${BASE_URL}/images/gallery/6520240326051255.jpeg`, category: 'Dance' },
  { id: '13', uri: `${BASE_URL}/images/gallery/4620231202044344.jpg`,  category: 'Dance' },
  { id: '14', uri: `${BASE_URL}/images/gallery/3820231202044319.jpg`,  category: 'Dance' },
  { id: '15', uri: `${BASE_URL}/images/gallery/6920231202044257.jpg`,  category: 'Dance' },
  // Exhibition
  { id: '16', uri: `${BASE_URL}/images/gallery/8420231202044242.jpg`,  category: 'Exhibition' },
  { id: '17', uri: `${BASE_URL}/images/gallery/2420231202044227.jpg`,  category: 'Exhibition' },
  { id: '18', uri: `${BASE_URL}/images/gallery/5420231202044129.jpg`,  category: 'Exhibition' },
  { id: '19', uri: `${BASE_URL}/images/gallery/7520231202044107.jpg`,  category: 'Exhibition' },
  // Womens Day
  { id: '20', uri: `${BASE_URL}/images/gallery/2220230301074527.jpg`,  category: "Women's Day" },
  { id: '21', uri: `${BASE_URL}/images/gallery/8520220912093626.jpg`,  category: "Women's Day" },
  { id: '22', uri: `${BASE_URL}/images/gallery/6520220910045613.jpg`,  category: "Women's Day" },
  // Academics
  { id: '23', uri: `${BASE_URL}/images/gallery/9020220910045536.jpg`,  category: 'Academics' },
  { id: '24', uri: `${BASE_URL}/images/gallery/7120220910045430.jpg`,  category: 'Academics' },
  { id: '25', uri: `${BASE_URL}/images/gallery/9420220910045356.jpg`,  category: 'Academics' },
  { id: '26', uri: `${BASE_URL}/images/gallery/7420220910045154.jpg`,  category: 'Academics' },
  { id: '27', uri: `${BASE_URL}/images/gallery/1220220224101411.jpg`,  category: 'Academics' },
  // Game
  { id: '28', uri: `${BASE_URL}/images/gallery/1720210429062341.jpg`,  category: 'Game' },
  { id: '29', uri: `${BASE_URL}/images/gallery/8320220224101641.jpg`,  category: 'Game' },
  { id: '30', uri: `${BASE_URL}/images/gallery/3820210429062120.jpg`,  category: 'Game' },
  { id: '31', uri: `${BASE_URL}/images/gallery/1620220311083046.jpeg`, category: 'Game' },
  { id: '32', uri: `${BASE_URL}/images/gallery/2620220225054043.jpg`,  category: 'Game' },
  { id: '33', uri: `${BASE_URL}/images/gallery/8620220311082811.jpg`,  category: 'Game' },
  { id: '34', uri: `${BASE_URL}/images/gallery/8520220311083822.jpg`,  category: 'Game' },
  { id: '35', uri: `${BASE_URL}/images/gallery/9520220311083326.jpg`,  category: 'Game' },
  { id: '36', uri: `${BASE_URL}/images/gallery/2320220311082458.jpg`,  category: 'Game' },
  { id: '37', uri: `${BASE_URL}/images/gallery/7520210429061053.jpg`,  category: 'Game' },
  { id: '38', uri: `${BASE_URL}/images/gallery/9320220311092521.jpg`,  category: 'Game' },
  { id: '39', uri: `${BASE_URL}/images/gallery/1520220311083917.jpg`,  category: 'Game' },
  { id: '40', uri: `${BASE_URL}/images/gallery/8520220311083554.jpg`,  category: 'Game' },
  { id: '41', uri: `${BASE_URL}/images/gallery/6020210429060532.jpg`,  category: 'Game' },
  { id: '42', uri: `${BASE_URL}/images/gallery/1920210429060422.jpg`,  category: 'Game' },
  { id: '43', uri: `${BASE_URL}/images/gallery/2020210429060052.jpg`,  category: 'Game' },
  { id: '44', uri: `${BASE_URL}/images/gallery/7920220311083129.jpg`,  category: 'Game' },
  { id: '45', uri: `${BASE_URL}/images/gallery/7020220311082920.jpg`,  category: 'Game' },
  { id: '46', uri: `${BASE_URL}/images/gallery/7120210429055551.jpg`,  category: 'Game' },
  { id: '47', uri: `${BASE_URL}/images/gallery/7320210429055630.jpg`,  category: 'Game' },
  { id: '48', uri: `${BASE_URL}/images/gallery/8820220311082943.jpeg`, category: 'Game' },
];

const CATEGORIES = ['All', 'Event', 'Sports', 'Dance', 'Exhibition', "Women's Day", 'Academics', 'Game'];

const CATEGORY_ICONS = {
  All: '🏫',
  Event: '🎉',
  Sports: '⚽',
  Dance: '💃',
  Exhibition: '🎨',
  "Women's Day": '🌸',
  Academics: '📚',
  Game: '🎮',
};

// ── Colors ────────────────────────────────────────────────────────────────────
const COLORS = {
  primary: '#1A237E',      // Deep school navy
  secondary: '#C62828',    // School red
  accent: '#FDD835',       // Gold accent
  surface: '#F5F5F5',
  white: '#FFFFFF',
  text: '#212121',
  subtext: '#757575',
  overlay: 'rgba(0,0,0,0.85)',
  cardBg: '#FFFFFF',
};

// ── GalleryScreen ─────────────────────────────────────────────────────────────
const GalleryScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalVisible, setModalVisible]         = useState(false);
  const [activeIndex, setActiveIndex]           = useState(0);
  const fadeAnim                                = useRef(new Animated.Value(0)).current;
  const flatListRef                             = useRef(null);

  const filtered =
    selectedCategory === 'All'
      ? GALLERY_DATA
      : GALLERY_DATA.filter(img => img.category === selectedCategory);

  const openImage = (index) => {
    setActiveIndex(index);
    setModalVisible(true);
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() =>
      setModalVisible(false),
    );
  };

  const goNext = () => {
    if (activeIndex < filtered.length - 1) setActiveIndex(prev => prev + 1);
  };
  const goPrev = () => {
    if (activeIndex > 0) setActiveIndex(prev => prev - 1);
  };

  // ── Render category chip ───────────────────────────────────────────────────
  const renderCategoryChip = ({ item }) => {
    const isActive = item === selectedCategory;
    return (
      <TouchableOpacity
        style={[styles.chip, isActive && styles.chipActive]}
        onPress={() => setSelectedCategory(item)}
        activeOpacity={0.8}
      >
        <Text style={styles.chipIcon}>{CATEGORY_ICONS[item]}</Text>
        <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{item}</Text>
      </TouchableOpacity>
    );
  };

  // ── Render grid image ──────────────────────────────────────────────────────
  const renderGridItem = ({ item, index }) => {
    const isLarge = index % 7 === 0;   // every 7th card is full-width featured
    return (
      <TouchableOpacity
        activeOpacity={0.88}
        style={[styles.gridItem, isLarge && styles.gridItemLarge]}
        onPress={() => openImage(index)}
      >
        <Image
          source={{ uri: item.uri }}
          style={[styles.gridImage, isLarge && styles.gridImageLarge]}
          resizeMode="cover"
        />
        {/* Category badge */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{CATEGORY_ICONS[item.category]}</Text>
        </View>
        {/* Gradient overlay bottom */}
        <View style={styles.imageOverlay} />
      </TouchableOpacity>
    );
  };

  // ── Header ─────────────────────────────────────────────────────────────────
  const ListHeader = () => (
    <View>
      {/* School Banner */}
      <View style={styles.banner}>
        <Image
          source={{ uri: `${BASE_URL}/images/logo.png` }}
          style={styles.logoImg}
          resizeMode="contain"
        />
        <View style={styles.bannerTextBox}>
          <Text style={styles.bannerTitle}>Photo Gallery</Text>
          <Text style={styles.bannerSub}>Saint Monica International School</Text>
          <View style={styles.dividerLine} />
          <Text style={styles.bannerCount}>{filtered.length} memories captured ✨</Text>
        </View>
      </View>

      {/* Category Filter */}
      <FlatList
        data={CATEGORIES}
        renderItem={renderCategoryChip}
        keyExtractor={i => i}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      />

      <Text style={styles.sectionLabel}>
        {selectedCategory === 'All' ? '📸 All Photos' : `${CATEGORY_ICONS[selectedCategory]} ${selectedCategory}`}
      </Text>
    </View>
  );

  // ── Fullscreen Image Modal ─────────────────────────────────────────────────
  const ImageModal = () => (
    <Modal visible={modalVisible} transparent animationType="none" onRequestClose={closeModal}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>

        {/* Close btn */}
        <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>

        {/* Counter */}
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>{activeIndex + 1} / {filtered.length}</Text>
        </View>

        {/* Image */}
        <Image
          source={{ uri: filtered[activeIndex]?.uri }}
          style={styles.fullImage}
          resizeMode="contain"
        />

        {/* Category tag */}
        <View style={styles.modalCategoryTag}>
          <Text style={styles.modalCategoryText}>
            {CATEGORY_ICONS[filtered[activeIndex]?.category]}  {filtered[activeIndex]?.category}
          </Text>
        </View>

        {/* Nav buttons */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[styles.navBtn, activeIndex === 0 && styles.navBtnDisabled]}
            onPress={goPrev}
            disabled={activeIndex === 0}
          >
            <Text style={styles.navBtnText}>‹ Prev</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navCloseCenter} onPress={closeModal}>
            <Text style={styles.navCloseCenterText}>Close</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navBtn, activeIndex === filtered.length - 1 && styles.navBtnDisabled]}
            onPress={goNext}
            disabled={activeIndex === filtered.length - 1}
          >
            <Text style={styles.navBtnText}>Next ›</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );

  // ── Main Render ────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Top Navbar */}
      <View style={styles.navbar}>
        <View style={styles.navbarLeft}>
        </View>
        <View style={styles.navbarBadge}>
          <Text style={styles.navbarBadgeText}>{filtered.length}</Text>
        </View>
      </View>

      {/* Grid */}
      <FlatList
        ref={flatListRef}
        data={filtered}
        renderItem={renderGridItem}
        keyExtractor={i => i.id}
        numColumns={2}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.columnWrapper}
      />

      <ImageModal />
    </SafeAreaView>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const IMG_SIZE = (width - 36) / 2;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  // ── Navbar
  navbar: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  navbarLeft: { flexDirection: 'row', alignItems: 'center' },
  navbarTitle: { color: COLORS.white, fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
  navbarBadge: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  navbarBadgeText: { color: COLORS.primary, fontWeight: '800', fontSize: 13 },

  // ── Banner
  banner: {
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    marginBottom: 12,
  },
  logoImg: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.white,
  },
  bannerTextBox: { flex: 1, marginLeft: 14 },
  bannerTitle: { color: COLORS.white, fontSize: 22, fontWeight: '900', letterSpacing: 0.5 },
  bannerSub: { color: COLORS.accent, fontSize: 11, fontWeight: '600', marginTop: 2 },
  dividerLine: {
    width: 40, height: 3, backgroundColor: COLORS.accent,
    borderRadius: 2, marginVertical: 6,
  },
  bannerCount: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },

  // ── Category Chips
  chipRow: { paddingHorizontal: 12, paddingBottom: 4, paddingTop: 4 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    elevation: 1,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    elevation: 4,
  },
  chipIcon: { fontSize: 14, marginRight: 5 },
  chipText: { color: COLORS.text, fontWeight: '600', fontSize: 13 },
  chipTextActive: { color: COLORS.white },

  // ── Section Label
  sectionLabel: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 0.3,
  },

  // ── Grid
  gridContainer: { paddingHorizontal: 0, paddingBottom: 30 },
  columnWrapper: { paddingHorizontal: 12, gap: 10, marginBottom: 10 },

  gridItem: {
    width: IMG_SIZE,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  gridItemLarge: {
    width: '100%',
    marginBottom: 0,
  },
  gridImage: {
    width: '100%',
    height: IMG_SIZE,
  },
  gridImageLarge: {
    height: IMG_SIZE * 1.3,
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  categoryBadgeText: { fontSize: 14 },
  imageOverlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 36,
    backgroundColor: 'rgba(26,35,126,0.18)',
  },

  // ── Modal
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: width,
    height: height * 0.65,
  },
  closeBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 52 : 18,
    right: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 22,
    width: 42, height: 42,
    justifyContent: 'center', alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  closeBtnText: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
  counterBadge: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 20,
    left: 18,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
    zIndex: 10,
  },
  counterText: { color: COLORS.white, fontWeight: '700', fontSize: 12 },
  modalCategoryTag: {
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 7,
    marginTop: 16,
  },
  modalCategoryText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width - 40,
    marginTop: 20,
  },
  navBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 11,
  },
  navBtnDisabled: { backgroundColor: 'rgba(255,255,255,0.15)' },
  navBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  navCloseCenter: {
    backgroundColor: COLORS.secondary,
    borderRadius: 24,
    paddingHorizontal: 26,
    paddingVertical: 11,
  },
  navCloseCenterText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
});

export default GalleryScreen;