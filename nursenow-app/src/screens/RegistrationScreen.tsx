import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api/auth';

export default function RegistrationScreen({ route, navigation }: any) {
  const { identifier, role } = route.params || { identifier: '', role: 'PATIENT' };
  
  const isEmail = identifier ? identifier.includes('@') : false;
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    address: '',
    phone: isEmail ? '' : identifier,
    email: isEmail ? identifier : '',
  });

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleRegister = async () => {
    try {
      if (!formData.name) {
        showAlert('Missing Info', 'Please enter your Full Name.');
        return;
      }
      if (!formData.email && !formData.phone) {
        showAlert('Missing Info', 'Please provide an Email or Phone number.');
        return;
      }
      
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role })
      });
      
      const data = await res.json();

      if (res.ok && data.success) {
        // Save token
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));

        showAlert('Success', `Account created successfully!`);
        
        if (role === 'NURSE') {
          navigation.replace('NurseDocument');
        } else {
          navigation.replace('Patient');
        }
      } else {
        showAlert('Registration Error', data.message || 'Something went wrong.');
      }
    } catch (e: any) {
      showAlert('Network Error', e.message || 'Cannot connect to server. Check your connection.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
          
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back to Login</Text>
          </TouchableOpacity>

          <View style={styles.headerContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Register as a {role === 'PATIENT' ? 'Patient' : 'Nurse / Staff'}</Text>
          </View>

          <View style={styles.card}>
            
            {/* Global CSS injection for Web Autofill */}
            {Platform.OS === 'web' && (
              <style type="text/css">{`
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus, 
                input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 30px #f8fafc inset !important;
                    -webkit-text-fill-color: #0f172a !important;
                    transition: background-color 5000s ease-in-out 0s;
                }
                input:focus {
                    outline: none !important;
                }
              `}</style>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor="#94a3b8"
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address {isEmail ? '*' : '(Optional)'}</Text>
              <TextInput
                style={[styles.input, isEmail && styles.disabledInput]}
                placeholder="Email Address"
                value={formData.email}
                editable={!isEmail}
                onChangeText={(text) => setFormData({...formData, email: text})}
              />
            </View>

            <View style={styles.rowGroup}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={styles.inputLabel}>Age</Text>
                <TextInput
                  style={styles.input}
                  placeholder="25"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  value={formData.age}
                  onChangeText={(text) => setFormData({...formData, age: text})}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Gender</Text>
                <View style={styles.genderRow}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                      styles.genderButton,
                      formData.gender === 'Male' && styles.genderButtonActive
                    ]}
                    onPress={() => setFormData({ ...formData, gender: 'Male' })}
                  >
                    <Text style={[
                      styles.genderText,
                      formData.gender === 'Male' && styles.genderTextActive
                    ]}>Male</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                      styles.genderButton,
                      formData.gender === 'Female' && styles.genderButtonActive
                    ]}
                    onPress={() => setFormData({ ...formData, gender: 'Female' })}
                  >
                    <Text style={[
                      styles.genderText,
                      formData.gender === 'Female' && styles.genderTextActive
                    ]}>Female</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mobile Number {!isEmail ? '*' : '(Optional)'}</Text>
              <TextInput
                style={[styles.input, !isEmail && styles.disabledInput]}
                placeholder="10-digit mobile number"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                maxLength={10}
                value={formData.phone}
                editable={isEmail}
                onChangeText={(text) => setFormData({...formData, phone: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="House No, Street, City"
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={formData.address}
                onChangeText={(text) => setFormData({...formData, address: text})}
              />
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
              <Text style={styles.primaryButtonText}>Complete Registration</Text>
            </TouchableOpacity>
          </View>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0fdfa', 
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  backButton: {
    marginBottom: 24,
  },
  backButtonText: {
    color: '#0f766e',
    fontWeight: '700',
    fontSize: 16,
  },
  headerContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#1e293b',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 8,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  inputGroup: {
    marginBottom: 20,
  },
  rowGroup: {
    flexDirection: 'row',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '500',
  },
  textArea: {
    height: 100,
  },
  disabledInput: {
    backgroundColor: '#f1f5f9',
    color: '#94a3b8',
  },
  primaryButton: {
    backgroundColor: '#0f766e',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  genderButton: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#0f766e',
    borderColor: '#0f766e',
  },
  genderText: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '600',
  },
  genderTextActive: {
    color: '#ffffff',
  },
});
