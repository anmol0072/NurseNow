import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, StyleSheet, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const API_URL = `${BASE_URL}/api/auth`;

export default function AuthScreen({ navigation }: any) {
  const [role, setRole] = useState<'PATIENT' | 'NURSE'>('PATIENT');
  const [identifier, setIdentifier] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleSendOtp = async () => {
    if (identifier.length < 5) {
      showAlert('Error', 'Please enter a valid Email or Mobile Number');
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });
      const data = await res.json();
      
      if (data.success) {
        setOtpSent(true);
        setOtp(''); // clear any old OTP
        showToast('OTP Sent! Please check your Email/SMS inbox.');
      } else {
        showAlert('Error', data.message);
      }
    } catch (e) {
      showAlert('Network Error', 'Cannot connect to backend server');
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) {
      showAlert('Error', 'Invalid OTP');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp, role })
      });
      const data = await res.json();

      if (data.success) {
        if (data.isNewUser) {
          // Navigate to registration
          navigation.replace('Register', { identifier, role });
        } else {
          // Save token and user data
          await AsyncStorage.setItem('token', data.token);
          await AsyncStorage.setItem('user', JSON.stringify(data.user));
          
          if (data.user.role === 'PATIENT') {
            navigation.replace('Patient');
          } else {
            navigation.replace('Nurse');
          }
        }
      } else {
        showAlert('Error', data.message || 'Invalid OTP');
      }
    } catch (e) {
      showAlert('Network Error', 'Cannot connect to backend server');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {toastMessage && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* Full Screen Premium Gradient */}
      <LinearGradient
        colors={['#020617', '#0f766e', '#042f2e']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            
            {/* Header with Logo */}
            <View style={styles.headerContainer}>
              <View style={styles.logoGlow}>
                <Image source={require('../../assets/logo.jpeg')} style={styles.logo} resizeMode="cover" />
              </View>
              <Text style={styles.brandName}>NurseNow</Text>
              <Text style={styles.subtitle}>Elevating Healthcare Standards</Text>
            </View>

            {/* Glassmorphism Card */}
            <View style={styles.glassCard}>
            
            {/* Global CSS injection for Web Autofill */}
            {Platform.OS === 'web' && (
              <style type="text/css">{`
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus, 
                input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 30px rgba(255,255,255,0) inset !important;
                    -webkit-text-fill-color: white !important;
                    transition: background-color 5000s ease-in-out 0s;
                    background-color: transparent !important;
                }
                input:focus {
                    outline: none !important;
                    background-color: transparent !important;
                }
              `}</style>
            )}

              <View style={styles.roleToggleContainer}>
                <TouchableOpacity 
                  activeOpacity={0.8}
                  style={[styles.roleButton, role === 'PATIENT' && styles.roleButtonActive]}
                  onPress={() => { setRole('PATIENT'); setOtpSent(false); setIdentifier(''); }}
                >
                  <Ionicons name="person" size={18} color={role === 'PATIENT' ? '#fff' : '#94a3b8'} style={{ marginRight: 6 }} />
                  <Text style={[styles.roleText, role === 'PATIENT' && styles.roleTextActive]}>Patient</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  activeOpacity={0.8}
                  style={[styles.roleButton, role === 'NURSE' && styles.roleButtonActive]}
                  onPress={() => { setRole('NURSE'); setOtpSent(false); setIdentifier(''); }}
                >
                  <Ionicons name="medkit" size={18} color={role === 'NURSE' ? '#fff' : '#94a3b8'} style={{ marginRight: 6 }} />
                  <Text style={[styles.roleText, role === 'NURSE' && styles.roleTextActive]}>Nurse / Staff</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.cardTitle}>
                {otpSent ? 'Secure Verification' : 'Welcome Back'}
              </Text>
              <Text style={styles.cardSubtitle}>
                {otpSent ? 'Enter the code sent to your device' : `Sign in to your ${role === 'PATIENT' ? 'Patient' : 'Nurse'} account`}
              </Text>

              {!otpSent ? (
                <>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Email or Mobile Number"
                      placeholderTextColor="#94a3b8"
                      autoCapitalize="none"
                      value={identifier}
                      onChangeText={setIdentifier}
                    />
                  </View>
                  <TouchableOpacity activeOpacity={0.8} onPress={handleSendOtp}>
                    <LinearGradient
                      colors={['#14b8a6', '#0f766e']}
                      style={styles.primaryButton}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.primaryButtonText}>Send OTP</Text>
                      <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { letterSpacing: 8, fontSize: 18 }]}
                      placeholder="------"
                      placeholderTextColor="#94a3b8"
                      keyboardType="numeric"
                      maxLength={6}
                      value={otp}
                      onChangeText={setOtp}
                    />
                  </View>
                  <TouchableOpacity activeOpacity={0.8} onPress={handleVerifyOtp}>
                    <LinearGradient
                      colors={['#14b8a6', '#0f766e']}
                      style={styles.primaryButton}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.primaryButtonText}>Verify & Login</Text>
                      <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setOtpSent(false)} style={styles.secondaryAction}>
                    <Text style={styles.secondaryActionText}>Wrong email/number? Change it</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            {!otpSent && (
              <View style={styles.footer}>
                <Text style={styles.footerText}>New to NurseNow? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register', { role })}>
                  <Text style={styles.footerLink}>Create an Account</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  toastContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 12,
    zIndex: 9999,
    shadowColor: '#5eead4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5eead4'
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    maxWidth: 450,
    width: '100%',
    alignSelf: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoGlow: {
    shadowColor: '#5eead4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 30, // Squircle shape
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  brandName: {
    fontSize: 46,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccfbf1',
    marginTop: 8,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    width: '100%',
    borderRadius: 30,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    // Fake backdrop blur for web using simple shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 10,
  },
  roleToggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
    padding: 6,
    marginBottom: 32,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  roleText: {
    fontWeight: '600',
    fontSize: 15,
    color: '#94a3b8',
  },
  roleTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 15,
    color: '#cbd5e1',
    fontWeight: '400',
    marginBottom: 32,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 18,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
    backgroundColor: 'transparent',
    // @ts-ignore
    outlineStyle: 'none',
  },
  primaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    paddingVertical: 18,
    shadowColor: '#0d9488',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginRight: 8,
  },
  secondaryAction: {
    marginTop: 24,
    alignItems: 'center',
  },
  secondaryActionText: {
    color: '#5eead4',
    fontWeight: '600',
    fontSize: 15,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 32,
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 15,
    fontWeight: '500',
  },
  footerLink: {
    color: '#5eead4',
    fontWeight: '700',
    fontSize: 15,
  }
});
