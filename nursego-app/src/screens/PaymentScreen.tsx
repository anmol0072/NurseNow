import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RazorpayCheckout from 'react-native-razorpay';

export default function PaymentScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  // If accessed from Profile, route.params might be undefined
  const { total = 0, serviceName = 'Wallet Top-up' } = route?.params || {};
  const isCheckoutFlow = total > 0;

  const handlePay = async () => {
    setIsProcessing(true);
    const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
    
    if (isCheckoutFlow) {
      try {
        const userStr = await AsyncStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const patientId = user?.id || 'anonymous';

        // Cash on Arrival skips gateway
        if (selectedMethod === 'cash') {
           const res = await fetch(`${BASE_URL}/api/bookings`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ patientId, serviceName, totalAmount: total, distance: 4, paymentMethod: selectedMethod })
           });
           const data = await res.json();
           setIsProcessing(false);
           if (data.success) {
             navigation.replace('Rating', { serviceName, total, paymentMethod: 'Cash on Arrival' });
           } else {
             Alert.alert('Booking Error', data.message || 'Failed to create booking.');
           }
           return;
        }

        // Real Gateway for UPI/Card
        const orderRes = await fetch(`${BASE_URL}/api/payments/create-order`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ amount: total })
        });
        const orderData = await orderRes.json();

        if (orderRes.status !== 200 || !orderData.id) {
           setIsProcessing(false);
           Alert.alert('Gateway Error', orderData.error || 'Failed to initialize payment gateway.');
           return;
        }

        if (Platform.OS === 'web') {
           const openRazorpayWeb = () => {
              const rzpOptions = {
                 key: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_xxxxxx',
                 amount: orderData.amount,
                 currency: 'INR',
                 name: 'NurseGo',
                 description: serviceName,
                 order_id: orderData.id,
                 handler: async function (response: any) {
                    await fetch(`${BASE_URL}/api/payments/verify`, {
                       method: 'POST',
                       headers: { 'Content-Type': 'application/json' },
                       body: JSON.stringify(response)
                    });
                    await fetch(`${BASE_URL}/api/bookings`, {
                       method: 'POST',
                       headers: { 'Content-Type': 'application/json' },
                       body: JSON.stringify({ patientId, serviceName, totalAmount: total, distance: 4, paymentMethod: selectedMethod })
                    });
                    setIsProcessing(false);
                    navigation.replace('Rating', { serviceName, total, paymentMethod: selectedMethod.toUpperCase() });
                 },
                 theme: {color: '#1d4ed8'}
              };
              const rzp = new (window as any).Razorpay(rzpOptions);
              rzp.on('payment.failed', function (response: any){
                 setIsProcessing(false);
                 Alert.alert('Payment Failed', response.error.description);
              });
              rzp.open();
           };

           if ((window as any).Razorpay) {
              openRazorpayWeb();
           } else {
              const script = document.createElement('script');
              script.src = 'https://checkout.razorpay.com/v1/checkout.js';
              script.async = true;
              script.onload = openRazorpayWeb;
              script.onerror = () => {
                 setIsProcessing(false);
                 Alert.alert('Error', 'Failed to load payment gateway script.');
              };
              document.body.appendChild(script);
           }
        } else {
           const options = {
             description: serviceName,
             image: 'https://nursenow.in/logo.png',
             currency: 'INR',
             key: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_xxxxxx',
             amount: orderData.amount,
             name: 'NurseGo',
             order_id: orderData.id,
             theme: {color: '#1d4ed8'}
           }

           RazorpayCheckout.open(options).then(async (data: any) => {
             // Verify with backend
             await fetch(`${BASE_URL}/api/payments/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
             });
             
             // Create Booking
             await fetch(`${BASE_URL}/api/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ patientId, serviceName, totalAmount: total, distance: 4, paymentMethod: selectedMethod })
             });
             
             setIsProcessing(false);
             navigation.replace('Rating', { serviceName, total, paymentMethod: selectedMethod.toUpperCase() });

           }).catch((error: any) => {
             setIsProcessing(false);
             Alert.alert('Payment Failed', `Error: ${error.code} | ${error.description}`);
           });
        }

      } catch (error) {
        setIsProcessing(false);
        Alert.alert('Network Error', 'Could not connect to the server.');
      }
    } else {
      // Wallet Top-up Flow (Fixed to ₹500 for testing)
      const topupAmount = 500;
      
      try {
        const orderRes = await fetch(`${BASE_URL}/api/payments/create-order`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ amount: topupAmount })
        });
        const orderData = await orderRes.json();

        if (orderRes.status !== 200 || !orderData.id) {
           setIsProcessing(false);
           Alert.alert('Gateway Error', orderData.error || 'Failed to initialize payment gateway.');
           return;
        }

        if (Platform.OS === 'web') {
           const script = document.createElement('script');
           script.src = 'https://checkout.razorpay.com/v1/checkout.js';
           script.async = true;
           script.onload = () => {
              const options = {
                 key: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_xxxxxx',
                 amount: orderData.amount,
                 currency: 'INR',
                 name: 'NurseGo Wallet Top-up',
                 description: 'Adding funds to wallet',
                 order_id: orderData.id,
                 handler: async function (response: any) {
                    setIsProcessing(false);
                    Alert.alert('Top-up Successful', '₹500 has been added to your wallet.');
                    navigation.goBack();
                 },
                 theme: { color: '#1d4ed8' }
              };
              const rzp = new (window as any).Razorpay(options);
              rzp.on('payment.failed', function (response: any) {
                 setIsProcessing(false);
                 alert('Payment Failed: ' + response.error.description);
              });
              rzp.open();
           };
           document.body.appendChild(script);
        } else {
           const options = {
             description: 'Adding funds to wallet',
             image: 'https://nursenow.in/logo.png',
             currency: 'INR',
             key: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_xxxxxx',
             amount: orderData.amount,
             name: 'NurseGo Wallet Top-up',
             order_id: orderData.id,
             theme: {color: '#1d4ed8'}
           }

           RazorpayCheckout.open(options).then(async (data: any) => {
             setIsProcessing(false);
             Alert.alert('Top-up Successful', '₹500 has been added to your wallet.');
             navigation.goBack();
           }).catch((error: any) => {
             setIsProcessing(false);
             Alert.alert('Payment Failed', `Error: ${error.code} | ${error.description}`);
           });
        }

      } catch (error) {
        setIsProcessing(false);
        Alert.alert('Network Error', 'Could not connect to the server.');
      }
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
            <Ionicons name="qr-code-outline" size={24} color="#1d4ed8" />
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
            <Ionicons name="card-outline" size={24} color="#1d4ed8" />
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
            <Ionicons name="cash-outline" size={24} color="#1d4ed8" />
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

      {isCheckoutFlow ? (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View style={styles.footerRow}>
            <Text style={styles.totalLabel}>Total to Pay</Text>
            <Text style={styles.totalAmount}>₹ {total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.payButton, isProcessing && {opacity: 0.7}]} 
            onPress={handlePay}
            disabled={isProcessing}
          >
            <Text style={styles.payButtonText}>{isProcessing ? 'Processing...' : 'Proceed to Pay'}</Text>
            {!isProcessing && <Ionicons name="lock-closed" size={16} color="#fff" style={{marginLeft: 8}} />}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <TouchableOpacity 
            style={[styles.payButton, isProcessing && {opacity: 0.7}]} 
            onPress={handlePay}
            disabled={isProcessing}
          >
            <Text style={styles.payButtonText}>{isProcessing ? 'Processing...' : 'Save Default Payment Method'}</Text>
          </TouchableOpacity>
        </View>
      )}
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
  methodCardSelected: { borderColor: '#1d4ed8', backgroundColor: '#eff6ff' },
  methodIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
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
  radioSelected: { borderColor: '#1d4ed8' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#1d4ed8' },
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
    backgroundColor: '#1d4ed8',
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
