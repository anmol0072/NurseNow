import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet, Switch, Platform, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SideMenu from '../components/SideMenu';
import ProfileMenu from '../components/ProfileMenu';

export default function NurseDashboard({ navigation }: any) {
  const [isOnline, setIsOnline] = useState(false);
  const [incomingJob, setIncomingJob] = useState<boolean>(false);
  const [locationSet, setLocationSet] = useState(false);
  const insets = useSafeAreaInsets();
  
  const mapRef = useRef<View>(null);
  const mapInstanceRef = useRef<any>(null);
  const nurseMarkerRef = useRef<any>(null);
  
  // Menu States
  const [isSideMenuVisible, setSideMenuVisible] = useState(false);
  const [isProfileMenuVisible, setProfileMenuVisible] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const u = await AsyncStorage.getItem('user');
      if (u) setUser(JSON.parse(u));
    };
    loadUser();
  }, []);

  // Removed broken Google Maps API Initialization

  // Mock function to simulate a patient booking a service
  const triggerMockJob = () => {
    if (!isOnline) {
      Alert.alert('Offline', 'You must go online to receive requests.');
      return;
    }
    setIncomingJob(true);
  };

  const handleAccept = () => {
    setIncomingJob(false);
    Alert.alert('Job Accepted', 'Navigate to Patient Location.');
  };

  const handleDecline = () => {
    setIncomingJob(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* Floating Header similar to Patient Dashboard */}
      <View style={[styles.floatingHeader, { top: Math.max(insets.top, 20) }]}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setSideMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="#0f172a" />
        </TouchableOpacity>
        
        <View style={{ flex: 1 }} />

        <TouchableOpacity 
          onPress={() => setProfileMenuVisible(true)}
          style={styles.profileButton}
        >
          <Text style={styles.profileText}>
            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'JD'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={[styles.scrollView, { marginTop: 60 }]} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Hi, {user?.name ? user.name.split(' ')[0] : 'Nurse'} 👋</Text>
            <Text style={styles.subGreeting}>Ready to save lives today?</Text>
          </View>
          <View style={styles.statusToggle}>
            <Text style={[styles.statusText, isOnline ? styles.textOnline : styles.textOffline]}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </Text>
            <Switch
              trackColor={{ false: '#cbd5e1', true: '#5eead4' }}
              thumbColor={isOnline ? '#0f766e' : '#f8fafc'}
              ios_backgroundColor="#cbd5e1"
              onValueChange={() => setIsOnline(!isOnline)}
              value={isOnline}
            />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Today's Earnings</Text>
            <Text style={styles.statValue}>₹1,450</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Completed Visits</Text>
            <Text style={styles.statValue}>3</Text>
          </View>
        </View>

        {/* Map & Location Placeholder */}
        <View style={locationSet ? styles.mapActive : styles.mapPlaceholder}>
          {locationSet && Platform.OS === 'web' && (
            <iframe 
              src="https://www.openstreetmap.org/export/embed.html?bbox=77.10%2C28.50%2C77.30%2C28.70&layer=mapnik"
              style={{ position: 'absolute', width: '100%', height: '100%', border: 'none' }}
            />
          )}
          {locationSet && Platform.OS !== 'web' && (
            <Image 
              source={{ uri: 'https://cdn.pixabay.com/photo/2019/09/22/16/20/location-4496459_1280.png' }} 
              style={{ ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' }} 
              resizeMode="cover"
            />
          )}

          {!locationSet && (
            <>
              <Text style={styles.mapIcon}>📍</Text>
              <Text style={styles.mapText}>Location Not Set</Text>
              <Text style={styles.mapSubText}>You must set your location to receive jobs</Text>
              <TouchableOpacity style={[styles.testBtn, { backgroundColor: '#0f766e' }]} onPress={() => setLocationSet(true)}>
                <Text style={styles.testBtnText}>Set Current Location</Text>
              </TouchableOpacity>
            </>
          )}
          {locationSet && (
            <View style={styles.mapOverlayControls}>
              <Text style={styles.mapOverlayText}>Broadcasting Location...</Text>
              <TouchableOpacity style={styles.testBtnOverlay} onPress={triggerMockJob}>
                <Text style={styles.testBtnText}>Test Incoming Job</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Incoming Job Modal/Card */}
        {incomingJob && (
          <View style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertTitle}>🚨 New Request!</Text>
              <Text style={styles.alertDistance}>5.5 km away</Text>
            </View>
            
            <View style={styles.jobDetails}>
              <Text style={styles.jobService}>IV Injection</Text>
              <Text style={styles.jobPrice}>Est. Earning: ₹699</Text>
              <Text style={styles.jobPatient}>Patient: John Doe (Male, 45)</Text>
            </View>

            <View style={styles.alertActions}>
              <TouchableOpacity style={[styles.actionBtn, styles.declineBtn]} onPress={handleDecline}>
                <Text style={styles.declineBtnText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.acceptBtn]} onPress={handleAccept}>
                <Text style={styles.acceptBtnText}>Accept Job</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!incomingJob && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🩺</Text>
            <Text style={styles.emptyStateText}>
              {isOnline ? 'Waiting for incoming requests...' : 'Go online to receive requests'}
            </Text>
          </View>
        )}

      </ScrollView>

      <SideMenu 
        visible={isSideMenuVisible} 
        onClose={() => setSideMenuVisible(false)} 
        navigation={navigation} 
      />

      <ProfileMenu 
        visible={isProfileMenuVisible} 
        onClose={() => setProfileMenuVisible(false)} 
        navigation={navigation} 
        user={user} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, maxWidth: 600, width: '100%', alignSelf: 'center', paddingBottom: 60 },
  
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, marginTop: 10 },
  greeting: { fontSize: 28, fontWeight: '900', color: '#0f172a', letterSpacing: -0.5 },
  subGreeting: { fontSize: 16, color: '#64748b', marginTop: 4, fontWeight: '500' },
  statusToggle: { alignItems: 'center' },
  statusText: { fontSize: 12, fontWeight: '800', marginBottom: 4 },
  textOnline: { color: '#0f766e' },
  textOffline: { color: '#94a3b8' },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statBox: { flex: 1, backgroundColor: '#ffffff', borderRadius: 20, padding: 20, marginHorizontal: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
  statLabel: { fontSize: 13, color: '#64748b', fontWeight: '700', marginBottom: 8 },
  statValue: { fontSize: 28, fontWeight: '900', color: '#0f766e' },

  mapPlaceholder: { width: '100%', height: 250, backgroundColor: '#e2e8f0', borderRadius: 24, marginBottom: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#cbd5e1', borderStyle: 'dashed' },
  mapActive: { width: '100%', height: 250, borderRadius: 24, marginBottom: 24, overflow: 'hidden', backgroundColor: '#e2e8f0' },
  mapIcon: { fontSize: 32, marginBottom: 8 },
  mapText: { color: '#475569', fontWeight: '700', fontSize: 16 },
  mapSubText: { color: '#64748b', fontSize: 14, marginTop: 4 },
  testBtn: { marginTop: 16, backgroundColor: '#334155', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  testBtnText: { color: '#fff', fontWeight: 'bold' },
  mapOverlayControls: { position: 'absolute', bottom: 16, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', padding: 12, borderRadius: 16, zIndex: 1000 },
  mapOverlayText: { color: '#0f766e', fontWeight: '800', fontSize: 14 },
  testBtnOverlay: { backgroundColor: '#0f172a', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },

  alertCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 24, shadowColor: '#ef4444', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 8, borderWidth: 2, borderColor: '#fee2e2' },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  alertTitle: { fontSize: 20, fontWeight: '900', color: '#ef4444' },
  alertDistance: { fontSize: 14, fontWeight: '700', color: '#64748b', backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  jobDetails: { marginBottom: 24 },
  jobService: { fontSize: 24, fontWeight: '800', color: '#1e293b', marginBottom: 4 },
  jobPrice: { fontSize: 18, fontWeight: '700', color: '#0f766e', marginBottom: 8 },
  jobPatient: { fontSize: 15, color: '#475569', fontWeight: '500' },
  alertActions: { flexDirection: 'row', justifyContent: 'space-between' },
  actionBtn: { flex: 1, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginHorizontal: 6 },
  declineBtn: { backgroundColor: '#f1f5f9' },
  declineBtnText: { color: '#475569', fontWeight: 'bold', fontSize: 16 },
  acceptBtn: { backgroundColor: '#0f766e', shadowColor: '#0f766e', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  acceptBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },

  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyStateIcon: { fontSize: 48, marginBottom: 16, opacity: 0.5 },
  emptyStateText: { color: '#94a3b8', fontSize: 16, fontWeight: '600' },

  floatingHeader: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  menuButton: {
    width: 48,
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  profileButton: {
    width: 48,
    height: 48,
    backgroundColor: '#0f766e',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  profileText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
});
