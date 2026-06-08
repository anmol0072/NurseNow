import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';

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

  const generatePDF = async () => {
    try {
      const html = `
        <html>
          <body style="font-family: Helvetica, sans-serif; padding: 40px; color: #0f172a;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #1d4ed8; margin: 0;">NurseGo</h1>
              <p style="color: #64748b; font-size: 14px; letter-spacing: 2px;">DIGITAL RECEIPT</p>
            </div>
            
            <table style="width: 100%; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px;">
              <tr><td style="color: #64748b; padding: 5px 0;">Transaction ID</td><td style="text-align: right; font-weight: bold;">${transactionId}</td></tr>
              <tr><td style="color: #64748b; padding: 5px 0;">Date & Time</td><td style="text-align: right; font-weight: bold;">${date}</td></tr>
              <tr><td style="color: #64748b; padding: 5px 0;">Payment Method</td><td style="text-align: right; font-weight: bold;">${paymentMethod}</td></tr>
            </table>

            <table style="width: 100%; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px;">
              <tr><td style="color: #0f172a; font-weight: bold; padding: 8px 0;">${serviceName}</td><td style="text-align: right; font-weight: bold;">₹${basePrice.toFixed(2)}</td></tr>
              <tr><td style="color: #0f172a; font-weight: bold; padding: 8px 0;">Distance Surcharge</td><td style="text-align: right; font-weight: bold;">₹${distanceCost.toFixed(2)}</td></tr>
              <tr><td style="color: #0f172a; font-weight: bold; padding: 8px 0;">Taxes (18% GST)</td><td style="text-align: right; font-weight: bold;">₹${gst.toFixed(2)}</td></tr>
            </table>

            <table style="width: 100%;">
              <tr>
                <td style="font-size: 20px; font-weight: bold; color: #0f172a;">Amount Paid</td>
                <td style="text-align: right; font-size: 28px; font-weight: 900; color: #1d4ed8;">₹${total.toFixed(2)}</td>
              </tr>
            </table>
            
            <div style="text-align: center; margin-top: 60px; color: #94a3b8; font-size: 12px;">
              <p>Thank you for choosing NurseGo.</p>
              <p>For any queries, contact support@nursenow.in</p>
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      if (Platform.OS === 'web') {
        window.open(uri);
      } else {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert('Download Complete', 'PDF has been generated at: ' + uri);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Could not generate PDF');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.replace('Patient')} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={[styles.successHeader, { marginTop: 0 }]}>
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
          <TouchableOpacity style={styles.secondaryBtn} onPress={generatePDF}>
            <Ionicons name="download-outline" size={20} color="#1d4ed8" style={{ marginRight: 8 }} />
            <Text style={styles.secondaryBtnText}>Download PDF</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Tracking')}
          >
            <Ionicons name="location" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.primaryBtnText}>Track Live Map</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1d4ed8' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  backBtn: { padding: 8 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, paddingTop: 12, maxWidth: 600, width: '100%', alignSelf: 'center', paddingBottom: 60 },
  
  successHeader: { alignItems: 'center', marginTop: 20, marginBottom: 40 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 4, borderColor: '#eff6ff' },
  successTitle: { fontSize: 28, fontWeight: '900', color: '#fff', marginBottom: 8 },
  successSub: { fontSize: 16, color: '#eff6ff', fontWeight: '500' },

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
  totalValue: { fontSize: 28, color: '#1d4ed8', fontWeight: '900' },

  actionContainer: { marginTop: 40 },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eff6ff', paddingVertical: 16, borderRadius: 16, marginBottom: 16 },
  secondaryBtnText: { color: '#1d4ed8', fontWeight: '800', fontSize: 16 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', paddingVertical: 18, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 6 },
  primaryBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
