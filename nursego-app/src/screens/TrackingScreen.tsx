import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function TrackingScreen({ route, navigation }: any) {
  const mapRef = useRef<View>(null);

  // Removed broken Google Maps API Initialization

  return (
    <View style={styles.container}>
      {/* Map Fallback */}
      {Platform.OS === 'web' ? (
        <iframe 
          src="https://www.openstreetmap.org/export/embed.html?bbox=77.10%2C28.50%2C77.30%2C28.70&layer=mapnik"
          style={{ position: 'absolute', width: '100%', height: '100%', border: 'none' }}
        />
      ) : (
        <Image 
          source={{ uri: 'https://cdn.pixabay.com/photo/2019/09/22/16/20/location-4496459_1280.png' }} 
          style={StyleSheet.absoluteFillObject} 
          resizeMode="cover"
        />
      )}

      {/* Back Button Overlay */}
      <SafeAreaView style={styles.topOverlay} pointerEvents="box-none">
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        
        <View style={styles.etaBadge}>
          <Text style={styles.etaText}>Arriving in 14 min</Text>
        </View>
      </SafeAreaView>

      {/* Bottom Information Sheet */}
      <View style={styles.bottomSheet}>
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
          style={styles.gradientTop}
        />
        
        <View style={styles.sheetContent}>
          <View style={styles.handleBar} />
          
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>En Route to Patient</Text>
            <View style={styles.pinContainer}>
              <Text style={styles.pinLabel}>Visit PIN</Text>
              <Text style={styles.pinValue}>8492</Text>
            </View>
          </View>

          <View style={styles.nurseInfoCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>S</Text>
            </View>
            <View style={styles.nurseDetails}>
              <Text style={styles.nurseName}>Sarah Jenkins</Text>
              <Text style={styles.nurseRole}>Certified IV Specialist</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#fbbf24" />
                <Text style={styles.ratingText}>4.9 (120 visits)</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Chat')}>
              <Ionicons name="chatbubble" size={24} color="#1d4ed8" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="call" size={24} color="#1d4ed8" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Rating', route?.params || {})}>
              <Text style={styles.primaryButtonText}>Finish Service</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e2e8f0',
  },
  topOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 10,
  },
  backButton: {
    backgroundColor: '#fff',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  etaBadge: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 100,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  etaText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  markerContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  homeMarker: {
    backgroundColor: '#0f172a',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  pulseRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(15, 118, 110, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(15, 118, 110, 0.5)',
  },
  nurseMarker: {
    backgroundColor: '#0f766e',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  nurseTag: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nurseTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 20,
  },
  gradientTop: {
    height: 40,
    width: '100%',
  },
  sheetContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 20,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
  },
  pinContainer: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  pinLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  pinValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1d4ed8',
    letterSpacing: 2,
  },
  nurseInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 24,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  nurseDetails: {
    flex: 1,
  },
  nurseName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  nurseRole: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
    marginLeft: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#0f172a',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
