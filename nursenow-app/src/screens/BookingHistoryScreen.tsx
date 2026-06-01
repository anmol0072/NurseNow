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
      
      <View style={styles.cardFooter}>
        <View style={styles.nurseInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.nurseName.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.nurseName}>{item.nurseName}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="star" size={12} color="#f59e0b" />
              <Text style={styles.nurseRating}> {item.nurseRating}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.receiptButton} onPress={() => navigation.navigate('Receipt', { serviceName: item.service, total: item.amount, paymentMethod: 'UPI' })}>
          <Text style={styles.receiptText}>Receipt</Text>
          <Ionicons name="chevron-forward" size={16} color="#0f766e" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
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
    </SafeAreaView>
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
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
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
    color: '#0f766e',
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
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nurseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0f766e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  nurseName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  nurseRating: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  receiptText: {
    color: '#0f766e',
    fontWeight: '700',
    marginRight: 4,
  }
});
