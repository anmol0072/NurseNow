import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const PAST_BOOKINGS = [
  {
    id: 'TRP-10492',
    date: '12 May, 2026',
    time: '10:30 AM',
    service: 'IV Drip Administration',
    nurseName: 'Asha Johnson',
    nurseRating: '4.9',
    amount: 850,
    status: 'Completed',
    location: '12, Safdarjung Enclave, New Delhi'
  },
  {
    id: 'TRP-09821',
    date: '02 Apr, 2026',
    time: '04:15 PM',
    service: 'Wound Dressing',
    nurseName: 'Ravi Kumar',
    nurseRating: '4.8',
    amount: 600,
    status: 'Completed',
    location: 'B-45, Vasant Vihar, New Delhi'
  },
  {
    id: 'TRP-08211',
    date: '14 Feb, 2026',
    time: '09:00 AM',
    service: 'Physiotherapy Session',
    nurseName: 'Priya Sharma',
    nurseRating: '5.0',
    amount: 1200,
    status: 'Completed',
    location: '12, Safdarjung Enclave, New Delhi'
  }
];

export default function BookingHistoryScreen({ navigation }: any) {
  const renderBooking = ({ item }: { item: typeof PAST_BOOKINGS[0] }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.dateText}>{item.date} at {item.time}</Text>
          <Text style={styles.serviceText}>{item.service}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>₹{item.amount}</Text>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.nurseInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.nurseName.charAt(0)}</Text>
        </View>
        <View>
          <Text style={styles.nurseLabel}>Nurse:</Text>
          <Text style={styles.nurseName}>{item.nurseName}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.viewReceiptBtn} onPress={() => navigation.navigate('Receipt', { serviceName: item.service, total: item.amount, paymentMethod: 'UPI' })}>
          <Ionicons name="receipt-outline" size={16} color="#2563eb" />
          <Text style={styles.viewReceiptText}>View Receipt</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rebookBtn} onPress={() => navigation.navigate('PatientDashboard', { preselectService: item.service })}>
          <Text style={styles.rebookText}>Rebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(50, 20) }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={PAST_BOOKINGS}
        keyExtractor={item => item.id}
        renderItem={renderBooking}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: '#1d4ed8',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  listContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dateText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
  },
  serviceText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1d4ed8',
  },
  statusText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '700',
    marginTop: 2,
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  nurseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  nurseLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  nurseName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  viewReceiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewReceiptText: {
    color: '#2563eb',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 6,
  },
  rebookBtn: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  rebookText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  }
});
