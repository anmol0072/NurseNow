import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FeatureUnavailableModal from '../components/FeatureUnavailableModal';

export default function ProfileScreen({ navigation }: any) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalData, setModalData] = React.useState({ title: '', message: '' });

  const showModal = (title: string, message: string) => {
    setModalData({ title, message });
    setModalVisible(true);
  };
  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <TouchableOpacity 
              style={styles.editAvatarBtn}
              onPress={() => showModal('Edit Image', 'Image upload coming soon!')}
            >
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.nameRow}>
            <Text style={styles.userName}>John Doe</Text>
            <TouchableOpacity 
              onPress={() => showModal('Edit Profile', 'Profile editing coming soon!')}
              style={{ marginLeft: 8 }}
            >
              <Ionicons name="pencil" size={20} color="#1d4ed8" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userPhone}>+91 98765 43210</Text>
          <View style={styles.uhidBadge}>
            <Text style={styles.uhidText}>UHID: NN-1A2B3C</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical History</Text>
          <View style={styles.medicalGrid}>
            <View style={styles.medicalBox}>
              <Text style={styles.medicalLabel}>Blood Type</Text>
              <Text style={styles.medicalValue}>O+</Text>
            </View>
            <View style={styles.medicalBox}>
              <Text style={styles.medicalLabel}>Allergies</Text>
              <Text style={styles.medicalValue}>Penicillin</Text>
            </View>
            <View style={styles.medicalBox}>
              <Text style={styles.medicalLabel}>Weight</Text>
              <Text style={styles.medicalValue}>72 kg</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('BookingHistory')}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#e0e7ff' }]}>
                <Ionicons name="time-outline" size={20} color="#4f46e5" />
              </View>
              <Text style={styles.menuItemText}>Booking History</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#fce7f3' }]}>
                <Ionicons name="location-outline" size={20} color="#db2777" />
              </View>
              <Text style={styles.menuItemText}>Saved Addresses</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Payment')}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="wallet-outline" size={20} color="#d97706" />
              </View>
              <Text style={styles.menuItemText}>Payment Methods & Wallet</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => Linking.openURL('https://nursenow.in')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#dcfce7' }]}>
                <Ionicons name="help-buoy-outline" size={20} color="#16a34a" />
              </View>
              <Text style={styles.menuItemText}>Help Center</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>

      <FeatureUnavailableModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        title={modalData.title}
        message={modalData.message}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, maxWidth: 600, width: '100%', alignSelf: 'center', paddingBottom: 60 },
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  
  profileCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 5 },
  avatarWrapper: { position: 'relative', marginBottom: 16 },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1d4ed8', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#eff6ff' },
  avatarText: { fontSize: 32, fontWeight: '900', color: '#fff' },
  editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#1d4ed8', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  userName: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
  userPhone: { fontSize: 16, color: '#64748b', fontWeight: '500', marginBottom: 16 },
  
  uhidBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  uhidText: { color: '#475569', fontWeight: '800', fontSize: 14, letterSpacing: 1 },

  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 16 },
  
  medicalGrid: { flexDirection: 'row', gap: 12 },
  medicalBox: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  medicalLabel: { fontSize: 13, color: '#64748b', fontWeight: '500', marginBottom: 4 },
  medicalValue: { fontSize: 16, color: '#ef4444', fontWeight: '800' },

  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  menuItemText: { fontSize: 16, fontWeight: '600', color: '#334155' },

  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fee2e2', padding: 16, borderRadius: 16, marginTop: 16 },
  logoutText: { color: '#ef4444', fontSize: 16, fontWeight: '800' },
});
