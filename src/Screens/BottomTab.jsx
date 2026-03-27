import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// जर colors, radius theme मध्ये असतील तर वापर (नसतील तर hard‑code ठेव)

const BottomTab = ({ navigation }) => {
  const goHome = () => navigation.navigate('Home');
  const goHomework = () => navigation.navigate('HomeWork');
  const goNotice = () => navigation.navigate('Notice');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomTab} onPress={goHome} activeOpacity={0.8}>
          <MaterialCommunityIcons name="account-group" size={20} color="#fff" />
          <Text style={styles.bottomLabel}>User</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTab} onPress={goHomework} activeOpacity={0.8}>
          <MaterialCommunityIcons name="notebook" size={20} color="#fff" />
          <Text style={styles.bottomLabel}>Homework</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTab} onPress={goNotice} activeOpacity={0.8}>
          <MaterialCommunityIcons name="bell" size={20} color="#fff" />
          <Text style={styles.bottomLabel}>Notice</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 20,
    left: 12,
    right: 12,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#083f66',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 6,
  },
  bottomTab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
});
