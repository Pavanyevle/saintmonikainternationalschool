import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FIREBASE_URL =
  'https://international-public-sch-db945-default-rtdb.firebaseio.com/';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorText, setErrorText] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const createFirebaseKey = useCallback(id => {
    return id.replace(/[.#$[\]]/g, '_');
  }, []);

  const handleSignIn = useCallback(async () => {
    setErrorText('');

    if (!email || !password) {
      setErrorText('Please enter email and password');
      return;
    }

    setIsLoading(true);
    const userId = createFirebaseKey(email.trim().toLowerCase());

    try {
      const response = await axios.get(
        `${FIREBASE_URL}students/${userId}.json`,
      );

      if (!response.data) {
        setErrorText('Student not found.');
        setIsLoading(false);
        return;
      }

      if (response.data.password !== password) {
        setErrorText('Incorrect password.');
        setIsLoading(false);
        return;
      }

      await AsyncStorage.setItem(
        'userData',
        JSON.stringify({ email }),
      );

      setIsLoading(false);

      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        position: 'bottom',
      });

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setErrorText('Something went wrong.');
    }
  }, [email, password]);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          <Animated.View
            style={[
              styles.content,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}>

            {/* 🔥 HEADER */}
            <Animated.View
              style={[styles.headerSection, { transform: [{ scale: logoScale }] }]}>

              <Image
                source={require('../Img/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />

              <Text style={styles.appName}>
                Saint Monica International School
              </Text>
            </Animated.View>

            {/* 🔥 LOGIN CARD */}
            <View style={styles.loginCard}>
              <Text style={styles.welcomeText}>Welcome Back!</Text>
              <Text style={styles.subtitleText}>
                Sign in to your account
              </Text>

              {/* EMAIL */}
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Enter your email"
                  style={styles.input}
                  value={email}
                  onChangeText={text => {
                    setEmail(text);
                    setErrorText('');
                  }}
                  autoCapitalize="none"
                />
              </View>

              {/* PASSWORD */}
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  value={password}
                  onChangeText={text => {
                    setPassword(text);
                    setErrorText('');
                  }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.eye}>
                    {showPassword ? '👁️' : '🙈'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* ERROR */}
              {errorText ? (
                <Text style={styles.errorText}>{errorText}</Text>
              ) : null}

              {/* LOGIN BTN */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleSignIn}
                disabled={isLoading}>

                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.gradientBtn}>

                  <Text style={styles.btnText}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Text>

                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgot}>Forgot Password?</Text>
              </TouchableOpacity>

            </View>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },

  content: {
    alignItems: 'center',
  },

  // 🔥 HEADER FIXED
  headerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },

  logo: {
    width: 120,
    height: 120,
    marginTop:100,
  },

  appName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#800000',
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 10,
  },

  // CARD
  loginCard: {
    backgroundColor: '#fcf5f5ee',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    elevation: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },

  subtitleText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
  },

  eye: {
    fontSize: 18,
  },

  button: {
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },

  gradientBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },

  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  forgot: {
    textAlign: 'center',
    marginTop: 15,
    color: '#667eea',
    fontWeight: '600',
  },

  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});