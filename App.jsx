import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Logo from './src/Screens/Logo';
import Achievement from './src/Screens/Achievement';
import Gallery from './src/Screens/Gallery';
import ClassRoutine from './src/Screens/ClassRoutine';
import Attendance from './src/Screens/Attendance';
import AboutUs from './src/Screens/AboutUs';
import SubjectList from './src/Screens/SubjectList';
import HelpAndSupport from './src/Screens/HelpAndSupport';
import Devloper from './src/Screens/Devloper';
import Syllabus from './src/Screens/Syllabus';
import Account from './src/Screens/Account';
import Login from './src/Screens/Login';
import BottomTab from './src/Screens/BottomTab';
import MyProfile from './src/Screens/MyProfile';
import Home from './src/Screens/Home';
import Notice from './src/Screens/Notice';
import HomeWork from './src/Screens/HomeWork';
import BusTracking from './src/Screens/BusTracking';
import StudentLeaveScreen from './src/Screens/StudentLeaveScreen';
import ContactUsScreen from './src/Screens/ContactUsScreen';
import BirthdayScreen from './src/Screens/BirthdayScreen';
import IPSCalendarScreen from './src/Screens/IPSCalendarScreen';
import Toast from 'react-native-toast-message';
import { Events, StudyMaterial, LessonPlan, ExamSyllabus, ExamReport, PaymentHistory } from './src/Screens/Placeholders';

const Stack = createNativeStackNavigator();

const FIREBASE_URL = 'https://myapp-1a8b6-default-rtdb.firebaseio.com/';

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  const createFirebaseKey = (id) => {
    return id.replace(/[.#$[\]]/g, '_');
  };

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');

        if (userData) {
          setInitialRoute('Home');
        } else {
          setInitialRoute('Login');
        }

      } catch (error) {
        console.log('Auto-login error:', error);
        setInitialRoute('Login');
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#800000" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>

        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Logo" component={Logo} />
          <Stack.Screen name="Gallery" component={Gallery} />
          <Stack.Screen name="Achievement" component={Achievement} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="HomeWork" component={HomeWork} />
          <Stack.Screen name="About Us" component={AboutUs} />
          <Stack.Screen name="Notice" component={Notice} />
          <Stack.Screen name="Developer" component={Devloper} />
          <Stack.Screen name="My Profile" component={MyProfile} />
          <Stack.Screen name="BottomTab" component={BottomTab} />
          <Stack.Screen name="ClassRoutine" component={ClassRoutine} />
          <Stack.Screen name="Attendance" component={Attendance} />
          <Stack.Screen name="Account" component={Account} />
          <Stack.Screen name="SubjectList" component={SubjectList} />
          <Stack.Screen name="Syllabus" component={Syllabus} />
          <Stack.Screen name="HelpAndSupport" component={HelpAndSupport} />
          <Stack.Screen name="Events" component={Events} />
          <Stack.Screen name="StudyMaterial" component={StudyMaterial} />
          <Stack.Screen name="LessonPlan" component={LessonPlan} />
          <Stack.Screen name="ExamSyllabus" component={ExamSyllabus} />
          <Stack.Screen name="ExamReport" component={ExamReport} />
          <Stack.Screen name="PaymentHistory" component={PaymentHistory} />
          <Stack.Screen name="Bus Tracking" component={BusTracking} />
          <Stack.Screen name="Contact Us" component={ContactUsScreen} />
          <Stack.Screen name="Apply Leave" component={StudentLeaveScreen} />
          <Stack.Screen name="Birthday" component={BirthdayScreen} />
          <Stack.Screen name="IPSCalendar" component={IPSCalendarScreen} />

        </Stack.Navigator>

        <Toast position="bottom" />
      </NavigationContainer>
    </View>

  );
};

export default App;