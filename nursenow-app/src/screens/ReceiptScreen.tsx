import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ReceiptScreen({ route, navigation }: any) {
  const { 
    serviceName = 'IV Injection', 
    basePrice = 699, 
    distanceCost = 0, 
    gst = 0, 
    total = 0,
    paymentMethod = 'UPI' 
  } = route.params || {};

  const transactionId = 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const date = new Date().toLocaleString();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.successHeader}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={40} color="#fff" />
          </View>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successSub}>Your booking is confirmed.</Text>
        </View>

        <View style={styles.receiptCard}>
          <View style={styles.receiptHeader}>
            <Text style={styles.brandName}>NurseGo</Text>
            <Text style={styles.receiptLabel}>DIGITAL RECEIPT</Text>
          </View>

          <View style={styles.dashedDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction ID</Text>
            <Text style={styles.detailValue}>{transactionId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue}>{date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method</Text>
            <Text style={styles.detailValue}>{paymentMethod}</Text>
          </View>

          <View style={styles.dashedDivider} />

          <View style={styles.itemRow}>
            <Text style={styles.itemText}>{serviceName}</Text>
            <Text style={styles.itemPrice}>₹{basePrice.toFixed(2)}</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>Distance Surcharge</Text>
            <Text style={styles.itemPrice}>₹{distanceCost.toFixed(2)}</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>Taxes (18% GST)</Text>
            <Text style={styles.itemPrice}>₹{gst.toFixed(2)}</Text>
          </View>

          <View style={styles.solidDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Amount Paid</Text>
            <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.secondaryBtn}>
            <Ionicons name="download-outline" size={20} color="#0f766e" style={{ marginRight: 8 }} />
            <Text style={styles.secondaryBtnText}>Download PDF</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Tracking')}
          >
            <Ionicons name="location" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.primaryBtnText}>Track Live Map</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.replace('Patient')} style={{ marginTop: 24, alignItems: 'center' }}>
            <Text style={{ color: '#64748b', fontWeight: '700', fontSize: 16 }}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0f766e' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, maxWidth: 600, width: '100%', alignSelf: 'center', paddingBottom: 60 },
  
  successHeader: { alignItems: 'center', marginTop: 20, marginBottom: 40 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#14b8a6', alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 4, borderColor: '#ccfbf1' },
  successTitle: { fontSize: 28, fontWeight: '900', color: '#fff', marginBottom: 8 },
  successSub: { fontSize: 16, color: '#ccfbf1', fontWeight: '500' },

  receiptCard: { backgroundColor: '#fff', borderRadius: 24, padding: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.15, shadowRadius: 30, elevation: 10 },
  receiptHeader: { alignItems: 'center', marginBottom: 20 },
  brandName: { fontSize: 24, fontWeight: '900', color: '#0f172a', letterSpacing: -1 },
  receiptLabel: { fontSize: 12, fontWeight: '800', color: '#94a3b8', letterSpacing: 2, marginTop: 4 },
  
  dashedDivider: { height: 1, borderWidth: 1, borderColor: '#e2e8f0', borderStyle: 'dashed', marginVertical: 20 },
  solidDivider: { height: 2, backgroundColor: '#f1f5f9', marginVertical: 20 },

  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  detailLabel: { fontSize: 14, color: '#64748b', fontWeight: '500' },
  detailValue: { fontSize: 14, color: '#0f172a', fontWeight: '700' },

  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  itemText: { fontSize: 16, color: '#334155', fontWeight: '600' },
  itemPrice: { fontSize: 16, color: '#0f172a', fontWeight: '800' },

  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 18, color: '#0f172a', fontWeight: '900' },
  totalValue: { fontSize: 28, color: '#0f766e', fontWeight: '900' },

  actionContainer: { marginTop: 40 },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ccfbf1', paddingVertical: 16, borderRadius: 16, marginBottom: 16 },
  secondaryBtnText: { color: '#0f766e', fontWeight: '800', fontSize: 16 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', paddingVertical: 18, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 6 },
  primaryBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
