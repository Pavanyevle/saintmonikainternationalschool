// Inside AppHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const AppHeader = ({ title, onMenuPress }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <Entypo name="menu" size={30} color="#f4efefff" />
      </TouchableOpacity>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' ,alignSelf:'center'}}>
        <Text style={styles.title}>{title}</Text>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#083f66',
    padding: 14,
    height:120,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop:30,
    fontSize:21,
    alihnSelf:'center',
  },
  menuButton: {
    padding: 4,
        marginTop:30,

  },
});

export default AppHeader;
