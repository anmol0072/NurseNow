import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PaymentScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [selectedMethod, setSelectedMethod] = useState('upi');

  const handlePay = () => {
    if (Platform.OS === 'web') {
      window.alert('Payment processing simulated successfully.');
    } else {
      Alert.alert('Success', 'Payment processed successfully.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.header, { marginTop: Math.max(insets.top, 10) }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Wallet Balance Card */}
        <View style={styles.walletCard}>
          <Text style={styles.walletLabel}>NurseNow Wallet Balance</Text>
          <Text style={styles.walletBalance}>₹ 1,250.00</Text>
          <TouchableOpacity style={styles.addMoneyBtn}>
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.addMoneyText}>Add Money</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Select Payment Method</Text>

        {/* UPI Option */}
        <TouchableOpacity 
          style={[styles.methodCard, selectedMethod === 'upi' && styles.methodCardSelected]}
          onPress={() => setSelectedMethod('upi')}
        >
          <View style={styles.methodIconBox}>
            <Ionicons name="qr-code-outline" size={24} color="#0f766e" />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>UPI (GPay, PhonePe, Paytm)</Text>
            <Text style={styles.methodSubtitle}>Pay directly via UPI apps</Text>
          </View>
          <View style={[styles.radio, selectedMethod === 'upi' && styles.radioSelected]}>
            {selectedMethod === 'upi' && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        {/* Card Option */}
        <TouchableOpacity 
          style={[styles.methodCard, selectedMethod === 'card' && styles.methodCardSelected]}
          onPress={() => setSelectedMethod('card')}
        >
          <View style={styles.methodIconBox}>
            <Ionicons name="card-outline" size={24} color="#0f766e" />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>Credit / Debit Card</Text>
            <Text style={styles.methodSubtitle}>Visa, MasterCard, RuPay</Text>
          </View>
          <View style={[styles.radio, selectedMethod === 'card' && styles.radioSelected]}>
            {selectedMethod === 'card' && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        {/* Cash Option */}
        <TouchableOpacity 
          style={[styles.methodCard, selectedMethod === 'cash' && styles.methodCardSelected]}
          onPress={() => setSelectedMethod('cash')}
        >
          <View style={styles.methodIconBox}>
            <Ionicons name="cash-outline" size={24} color="#0f766e" />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>Cash on Arrival</Text>
            <Text style={styles.methodSubtitle}>Pay the nurse directly</Text>
          </View>
          <View style={[styles.radio, selectedMethod === 'cash' && styles.radioSelected]}>
            {selectedMethod === 'cash' && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View style={styles.footerRow}>
          <Text style={styles.totalLabel}>Total to Pay</Text>
          <Text style={styles.totalAmount}>₹ 499.00</Text>
        </View>
        <TouchableOpacity style={styles.payButton} onPress={handlePay}>
          <Text style={styles.payButtonText}>Proceed to Pay</Text>
          <Ionicons name="lock-closed" size={16} color="#fff" style={{marginLeft: 8}} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  content: { padding: 20 },
  walletCard: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    padding: 24,
    marginBottom: 30,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  walletLabel: { color: '#94a3b8', fontSize: 14, fontWeight: '500', marginBottom: 8 },
  walletBalance: { color: '#fff', fontSize: 36, fontWeight: '800', marginBottom: 20 },
  addMoneyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addMoneyText: { color: '#fff', fontWeight: '600', marginLeft: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 16 },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  methodCardSelected: { borderColor: '#0f766e', backgroundColor: '#f0fdfa' },
  methodIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#ccfbf1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  methodInfo: { flex: 1 },
  methodTitle: { fontSize: 16, fontWeight: '600', color: '#0f172a', marginBottom: 4 },
  methodSubtitle: { fontSize: 13, color: '#64748b' },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: '#0f766e' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#0f766e' },
  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  totalLabel: { fontSize: 16, color: '#64748b', fontWeight: '500' },
  totalAmount: { fontSize: 24, color: '#0f172a', fontWeight: '800' },
  payButton: {
    backgroundColor: '#0f766e',
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
