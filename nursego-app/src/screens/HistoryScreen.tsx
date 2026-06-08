import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function HistoryScreen({ navigation }: any) {
  const [userRole, setUserRole] = useState('PATIENT');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const u = await AsyncStorage.getItem('user');
        if (u) {
          const parsed = JSON.parse(u);
          if (parsed.role) setUserRole(parsed.role);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchUser();
  }, []);

  const isNurse = userRole === 'NURSE';
  
  // Theme colors based on role
  const primaryColor = isNurse ? '#14b8a6' : '#0f172a'; // Green for Nurse, Dark Blue for Patient
  const secondaryColor = isNurse ? '#0f766e' : '#0f766e'; // Both can use teal for amounts/receipts

  // Dummy History Data
  const MOCK_HISTORY = [
    { id: '1', date: 'Oct 12, 2026', time: '10:30 AM', service: 'IV Drip', status: 'Completed', amount: '699', nurse: 'Sarah Jenkins' },
    { id: '2', date: 'Oct 10, 2026', time: '02:00 PM', service: 'Injection', status: 'Completed', amount: '400', nurse: 'Michael Doe' },
    { id: '3', date: 'Oct 05, 2026', time: '11:15 AM', service: 'Physiotherapy', status: 'Cancelled', amount: '1200', nurse: 'Emily Chen' },
  ];

  const handleDownloadReceipt = async (item: any) => {
    try {
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
              .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
              .title { font-size: 28px; font-weight: bold; color: ${primaryColor}; margin: 0; }
              .subtitle { font-size: 16px; color: #666; margin-top: 5px; }
              .row { display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid #f9f9f9; padding-bottom: 10px; }
              .label { font-weight: bold; color: #555; }
              .value { color: #111; }
              .total { font-size: 22px; font-weight: bold; color: ${primaryColor}; text-align: right; margin-top: 30px; }
              .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #aaa; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 class="title">NurseGo Receipt</h1>
              <p class="subtitle">Transaction ID: TRP-000${item.id}</p>
            </div>
            <div class="row"><span class="label">Date:</span><span class="value">${item.date}</span></div>
            <div class="row"><span class="label">Time:</span><span class="value">${item.time}</span></div>
            <div class="row"><span class="label">Service:</span><span class="value">${item.service}</span></div>
            <div class="row"><span class="label">Nurse:</span><span class="value">${item.nurse}</span></div>
            <div class="row"><span class="label">Status:</span><span class="value" style="color: green;">${item.status}</span></div>
            
            <div class="total">Total Paid: ₹${item.amount}</div>
            
            <div class="footer">Thank you for choosing NurseGo. For support, contact support@nursenow.in</div>
          </body>
        </html>
      `;

      if (Platform.OS === 'web') {
        await Print.printAsync({ html: htmlContent });
      } else {
        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert('Success', 'Receipt PDF generated, but sharing is not available on this device.');
        }
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate receipt PDF.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking History</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {MOCK_HISTORY.map((item) => (
          <View key={item.id} style={styles.historyCard}>
            <View style={styles.cardHeader}>
              <View style={styles.dateContainer}>
                <Ionicons name="calendar-outline" size={16} color="#64748b" />
                <Text style={styles.dateText}>{item.date} • {item.time}</Text>
              </View>
              <View style={[styles.statusBadge, item.status === 'Completed' ? styles.statusSuccess : styles.statusFail]}>
                <Text style={[styles.statusText, item.status === 'Completed' ? styles.statusTextSuccess : styles.statusTextFail]}>
                  {item.status}
                </Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <View>
                <Text style={styles.serviceTitle}>{item.service}</Text>
                <Text style={styles.nurseName}>Nurse: {item.nurse}</Text>
              </View>
              <Text style={[styles.amountText, { color: secondaryColor }]}>₹{item.amount}</Text>
            </View>

            {item.status === 'Completed' && (
              <View style={styles.cardFooter}>
                <TouchableOpacity style={styles.receiptBtn} onPress={() => handleDownloadReceipt(item)}>
                  <Ionicons name="download-outline" size={16} color={secondaryColor} />
                  <Text style={[styles.receiptText, { color: secondaryColor }]}>View Receipt</Text>
                </TouchableOpacity>
                {!isNurse && (
                  <TouchableOpacity style={styles.rebookBtn}>
                    <Text style={styles.rebookText}>Rebook</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    ...Platform.select({
      web: { marginTop: 0 },
      default: { marginTop: 20 }
    })
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 6,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusSuccess: {
    backgroundColor: '#dcfce7',
  },
  statusFail: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusTextSuccess: {
    color: '#15803d',
  },
  statusTextFail: {
    color: '#ef4444',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  nurseName: {
    fontSize: 14,
    color: '#64748b',
  },
  amountText: {
    fontSize: 18,
    fontWeight: '800',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  receiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  receiptText: {
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 14,
  },
  rebookBtn: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  rebookText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  }
});
