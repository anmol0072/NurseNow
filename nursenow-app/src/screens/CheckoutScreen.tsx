import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function CheckoutScreen({ route, navigation }: any) {
  const { serviceName = 'IV Injection', basePrice = 699, distance = 3.2 } = route.params || {};

  const distanceRate = 12; // ₹12 per km after 4km
  const chargeableDistance = Math.max(0, distance - 4);
  const distanceCost = chargeableDistance * distanceRate;
  const subtotal = basePrice + distanceCost;
  const gst = subtotal * 0.18;
  
  const [tipAmount, setTipAmount] = useState<number>(0);
  const total = subtotal + gst + tipAmount;

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'CASH'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (paymentMethod === 'CASH') {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        navigation.replace('Tracking', { serviceName, total, paymentMethod });
      }, 1500);
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Fetch Order ID from backend
      const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${BASE_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total })
      });
      const order = await response.json();

      // 2. Initialize Razorpay (Web integration)
      if (Platform.OS === 'web') {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        
        script.onload = () => {
          const options = {
            key: 'rzp_test_mockkey123456', // Test key (Razorpay will show an invalid key error but UI will load)
            amount: order.amount,
            currency: order.currency,
            name: 'NurseGo Premium',
            description: `Payment for ${serviceName}`,
            image: 'https://cdn-icons-png.flaticon.com/512/3063/3063205.png',
            order_id: order.id,
            handler: function (response: any) {
              // Success callback
              setIsProcessing(false);
              navigation.replace('Tracking', { serviceName, total, paymentMethod });
            },
            prefill: {
              name: 'John Doe',
              email: 'patient@nursego.com',
              contact: '9999999999'
            },
            theme: { color: '#0f766e' }
          };

          // @ts-ignore
          const rzp = new window.Razorpay(options);
          
          rzp.on('payment.failed', function (response: any){
            // For Demo purposes, if payment fails (due to fake key), we proceed to tracking anyway
            console.log("Razorpay Error:", response.error);
            setIsProcessing(false);
            navigation.replace('Tracking', { serviceName, total, paymentMethod });
          });

          rzp.open();
        };
        
        script.onerror = () => {
           setIsProcessing(false);
           navigation.replace('Tracking', { serviceName, total, paymentMethod });
        };
        
        document.body.appendChild(script);
      } else {
        // Native mobile integration fallback
        setTimeout(() => {
          setIsProcessing(false);
          navigation.replace('Tracking', { serviceName, total, paymentMethod });
        }, 1500);
      }

    } catch (error) {
      console.error('Checkout error:', error);
      setIsProcessing(false);
      Alert.alert("Error", "Failed to contact payment gateway.");
    }
  };

  if (isProcessing) {
    return (
      <View style={styles.processingContainer}>
        <ActivityIndicator size="large" color="#0f766e" />
        <Text style={styles.processingText}>Processing Payment securely...</Text>
        <Text style={styles.processingSub}>Connecting to payment gateway</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review & Pay</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        {/* Nurse Profile Card */}
        <View style={styles.nurseCard}>
          <View style={styles.nurseHeader}>
            <View style={styles.nurseAvatar}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>AJ</Text>
            </View>
            <View>
              <Text style={styles.nurseName}>Asha Johnson</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="star" size={14} color="#f59e0b" />
                <Text style={styles.nurseRating}> 4.9 (120+ trips)</Text>
              </View>
            </View>
          </View>
          <View style={styles.etaBadge}>
            <Text style={styles.etaText}>4 MINS AWAY</Text>
          </View>
        </View>

        {/* Bill Breakdown Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bill Summary</Text>
          
          <View style={styles.row}>
            <Text style={styles.itemText}>{serviceName} (Base)</Text>
            <Text style={styles.priceText}>₹{basePrice.toFixed(2)}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.itemText}>Travel Fee ({distance.toFixed(1)} km)</Text>
            <Text style={styles.priceText}>₹{distanceCost.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />
          
          <View style={styles.row}>
            <Text style={styles.itemText}>Taxes (18% GST)</Text>
            <Text style={styles.priceText}>₹{gst.toFixed(2)}</Text>
          </View>
          
          <View style={[styles.divider, styles.thickDivider]} />
          
          <View style={styles.row}>
            <Text style={styles.totalText}>Subtotal</Text>
            <Text style={styles.totalPrice}>₹{(subtotal + gst).toFixed(2)}</Text>
          </View>
        </View>

        {/* Tip Section */}
        <Text style={styles.sectionTitle}>Add a Tip for Asha (Optional)</Text>
        <View style={styles.tipRow}>
          {[0, 20, 50, 100].map((amount) => (
            <TouchableOpacity 
              key={amount}
              style={[styles.tipBtn, tipAmount === amount && styles.tipBtnActive]}
              onPress={() => setTipAmount(amount)}
            >
              <Text style={[styles.tipText, tipAmount === amount && styles.tipTextActive]}>
                {amount === 0 ? 'None' : `₹${amount}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        
        <TouchableOpacity 
          style={[styles.paymentOption, paymentMethod === 'UPI' && styles.paymentOptionActive]} 
          onPress={() => {setPaymentMethod('UPI'); setShowCardInput(false);}}
        >
          <View style={styles.paymentIconContainer}>
            <Ionicons name="qr-code-outline" size={24} color={paymentMethod === 'UPI' ? '#0f766e' : '#64748b'} />
          </View>
          <Text style={[styles.paymentText, paymentMethod === 'UPI' && styles.paymentTextActive]}>UPI (GPay, PhonePe)</Text>
          {paymentMethod === 'UPI' && <Ionicons name="checkmark-circle" size={24} color="#0f766e" />}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.paymentOption, paymentMethod === 'CARD' && styles.paymentOptionActive]} 
          onPress={() => setPaymentMethod('CARD')}
        >
          <View style={styles.paymentIconContainer}>
            <Ionicons name="card-outline" size={24} color={paymentMethod === 'CARD' ? '#0f766e' : '#64748b'} />
          </View>
          <Text style={[styles.paymentText, paymentMethod === 'CARD' && styles.paymentTextActive]}>Credit / Debit Card</Text>
          {paymentMethod === 'CARD' && <Ionicons name="checkmark-circle" size={24} color="#0f766e" />}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.paymentOption, paymentMethod === 'CASH' && styles.paymentOptionActive]} 
          onPress={() => setPaymentMethod('CASH')}
        >
          <View style={styles.paymentIconContainer}>
            <Ionicons name="cash-outline" size={24} color={paymentMethod === 'CASH' ? '#0f766e' : '#64748b'} />
          </View>
          <Text style={[styles.paymentText, paymentMethod === 'CASH' && styles.paymentTextActive]}>Cash on Delivery</Text>
          {paymentMethod === 'CASH' && <Ionicons name="checkmark-circle" size={24} color="#0f766e" />}
        </TouchableOpacity>

      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerTotalLabel}>Total Pay</Text>
          <Text style={styles.footerTotalPrice}>₹{total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity onPress={handlePayment} activeOpacity={0.8}>
          <LinearGradient colors={['#14b8a6', '#0f766e']} style={styles.payBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.payBtnText}>Proceed to Razorpay</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  backBtn: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 100, maxWidth: 600, width: '100%', alignSelf: 'center' },
  
  nurseCard: { backgroundColor: '#0f766e', borderRadius: 20, padding: 20, marginBottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#0f766e', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  nurseHeader: { flexDirection: 'row', alignItems: 'center' },
  nurseAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ccfbf1', alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 2, borderColor: '#fff' },
  nurseName: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 2 },
  nurseRating: { fontSize: 14, color: '#ccfbf1', fontWeight: '600' },
  etaBadge: { backgroundColor: '#ccfbf1', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  etaText: { color: '#0f766e', fontWeight: '900', fontSize: 12 },

  card: { backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 4 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  itemText: { fontSize: 15, color: '#64748b', fontWeight: '500' },
  priceText: { fontSize: 15, color: '#334155', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 12 },
  thickDivider: { height: 2, backgroundColor: '#e2e8f0', borderStyle: 'dashed' },
  totalText: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  totalPrice: { fontSize: 22, fontWeight: '900', color: '#0f766e' },

  tipRow: { flexDirection: 'row', gap: 12, marginBottom: 32, marginTop: 8 },
  tipBtn: { flex: 1, paddingVertical: 14, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  tipBtnActive: { backgroundColor: '#ccfbf1', borderColor: '#0f766e', borderWidth: 2 },
  tipText: { fontWeight: '700', color: '#64748b' },
  tipTextActive: { color: '#0f766e', fontWeight: '900' },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#334155', marginBottom: 16, marginTop: 8 },
  paymentOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 2, borderColor: '#f1f5f9' },
  paymentOptionActive: { borderColor: '#5eead4', backgroundColor: '#f0fdfa' },
  paymentIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  paymentText: { flex: 1, fontSize: 16, fontWeight: '600', color: '#475569' },
  paymentTextActive: { color: '#0f766e', fontWeight: '800' },

  cardInputContainer: { backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  cardInput: { backgroundColor: '#f8fafc', padding: 14, borderRadius: 12, fontSize: 15, fontWeight: '500', color: '#0f172a', borderWidth: 1, borderColor: '#e2e8f0' },

  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 24, paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 10 },
  footerTotalLabel: { fontSize: 13, color: '#64748b', fontWeight: '700', textTransform: 'uppercase' },
  footerTotalPrice: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
  payBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, borderRadius: 16 },
  payBtnText: { color: '#fff', fontWeight: '800', fontSize: 16, marginRight: 8 },

  processingContainer: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  processingText: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginTop: 24 },
  processingSub: { fontSize: 15, color: '#94a3b8', marginTop: 8 }
});
