import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SendSMS from 'react-native-sms';

const ForgotPasswordOtpScreen = () => {
  const [phone, setPhone] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = send otp, 2 = verify otp
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 🔢 OTP GENERATOR
  const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleSendOtp = () => {
    setError('');
    setSuccess('');

    if (phone.length !== 10) {
      setError('कृपया योग्य 10 अंकी मोबाईल नंबर टाका');
      return;
    }

    const otp = generateOtp();
    setGeneratedOtp(otp);
    setStep(2);

    // 📩 Open SMS app
    SendSMS.send(
      {
        body: `IPS App OTP: ${otp}`,
        recipients: [phone],
        successTypes: ['sent', 'queued'],
      },
      (completed, cancelled) => {
        if (cancelled) {
          setError('SMS cancel केला आहे');
        }
      },
    );
  };

  const handleVerifyOtp = () => {
    setError('');
    setSuccess('');

    if (enteredOtp.length !== 4) {
      setError('4 अंकी OTP टाका');
      return;
    }

    if (enteredOtp === generatedOtp) {
      setSuccess('OTP Verified Successfully ✅');
    } else {
      setError('OTP चुकीचा आहे. पुन्हा प्रयत्न करा');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <Text style={styles.headerText}>Forgot Password</Text>
      </LinearGradient>

      <View style={styles.card}>
        {/* MOBILE NUMBER */}
        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          placeholder="Enter 10 digit mobile number"
          keyboardType="phone-pad"
          maxLength={10}
          value={phone}
          editable={step === 1}
          onChangeText={setPhone}
          style={styles.input}
        />

        {/* OTP INPUT */}
        {step === 2 && (
          <>
            <Text style={[styles.label, { marginTop: 15 }]}>Enter OTP</Text>
            <TextInput
              placeholder="Enter OTP"
              keyboardType="number-pad"
              maxLength={4}
              value={enteredOtp}
              onChangeText={setEnteredOtp}
              style={[styles.input, styles.otpInput]}
            />
          </>
        )}

        {/* ERROR / SUCCESS */}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.success}>{success}</Text> : null}

        {/* BUTTON */}
        <TouchableOpacity
          onPress={step === 1 ? handleSendOtp : handleVerifyOtp}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.button}>
            <Text style={styles.buttonText}>
              {step === 1 ? 'Send OTP' : 'Verify OTP'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordOtpScreen;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    height: 120,
    justifyContent: 'flex-end',
    padding: 20,
  },
  headerText: { color: '#fff', fontSize: 22, fontWeight: '700' },
  card: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 8,
  },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  otpInput: {
    textAlign: 'center',
    letterSpacing: 8,
    fontSize: 18,
  },
  error: {
    color: '#dc2626',
    marginTop: 10,
    fontWeight: '600',
  },
  success: {
    color: '#16a34a',
    marginTop: 10,
    fontWeight: '700',
  },
  button: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
