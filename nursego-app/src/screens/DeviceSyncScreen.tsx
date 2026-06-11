import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function DeviceSyncScreen({ navigation }: any) {
  const [scanning, setScanning] = useState(true);
  const [connected, setConnected] = useState(false);
  const [bpm, setBpm] = useState(72);
  const [sys, setSys] = useState(120);
  const [dia, setDia] = useState(80);

  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    if (scanning) {
      const timer = setTimeout(() => {
        setScanning(false);
        setConnected(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [scanning]);

  useEffect(() => {
    let interval: any;
    if (connected) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      ).start();

      interval = setInterval(() => {
        setBpm(prev => prev + Math.floor(Math.random() * 5) - 2);
        setSys(prev => 120 + Math.floor(Math.random() * 6) - 3);
        setDia(prev => 80 + Math.floor(Math.random() * 4) - 2);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [connected]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vitals Sync</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {scanning ? (
          <View style={styles.centerBox}>
            <View style={styles.radarRing}>
              <Ionicons name="bluetooth" size={48} color="#1d4ed8" />
            </View>
            <Text style={styles.scanTitle}>Scanning for Devices...</Text>
            <Text style={styles.scanDesc}>Make sure your Apple Watch or Omron BP Monitor is in pairing mode.</Text>
          </View>
        ) : (
          <View style={styles.dashboard}>
            <View style={styles.deviceConnectedCard}>
              <Ionicons name="watch-outline" size={32} color="#10b981" />
              <View style={{ marginLeft: 16 }}>
                 <Text style={styles.deviceName}>Apple Watch Series 9</Text>
                 <Text style={styles.deviceStatus}>Connected • Syncing Live</Text>
              </View>
            </View>

            <View style={styles.metricsGrid}>
               <View style={styles.metricCard}>
                  <View style={styles.metricHeader}>
                     <Ionicons name="heart" size={20} color="#ef4444" />
                     <Text style={styles.metricLabel}>Heart Rate</Text>
                  </View>
                  <Animated.Text style={[styles.metricValue, { transform: [{ scale: pulseAnim }] }]}>
                    {bpm} <Text style={styles.metricUnit}>BPM</Text>
                  </Animated.Text>
               </View>

               <View style={styles.metricCard}>
                  <View style={styles.metricHeader}>
                     <Ionicons name="water" size={20} color="#3b82f6" />
                     <Text style={styles.metricLabel}>Blood Pressure</Text>
                  </View>
                  <Text style={styles.metricValue}>
                    {sys}/{dia} <Text style={styles.metricUnit}>mmHg</Text>
                  </Text>
               </View>

               <View style={styles.metricCard}>
                  <View style={styles.metricHeader}>
                     <Ionicons name="medical" size={20} color="#8b5cf6" />
                     <Text style={styles.metricLabel}>Blood Oxygen</Text>
                  </View>
                  <Text style={styles.metricValue}>
                    98 <Text style={styles.metricUnit}>%</Text>
                  </Text>
               </View>

               <View style={styles.metricCard}>
                  <View style={styles.metricHeader}>
                     <Ionicons name="thermometer" size={20} color="#f59e0b" />
                     <Text style={styles.metricLabel}>Body Temp</Text>
                  </View>
                  <Text style={styles.metricValue}>
                    98.6 <Text style={styles.metricUnit}>°F</Text>
                  </Text>
               </View>
            </View>

            <View style={styles.alertBox}>
               <Ionicons name="shield-checkmark" size={24} color="#10b981" />
               <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.alertTitle}>Vitals Normal</Text>
                  <Text style={styles.alertDesc}>Your family and assigned nurse are receiving these updates in real-time.</Text>
               </View>
            </View>

          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  content: { flex: 1, padding: 20 },
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  radarRing: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#eff6ff', borderWidth: 2, borderColor: '#bfdbfe', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  scanTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  scanDesc: { fontSize: 14, color: '#64748b', textAlign: 'center', paddingHorizontal: 40, lineHeight: 22 },
  dashboard: { flex: 1 },
  deviceConnectedCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#ecfdf5' },
  deviceName: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  deviceStatus: { fontSize: 13, color: '#10b981', fontWeight: '600', marginTop: 4 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  metricCard: { width: '48%', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  metricHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  metricLabel: { fontSize: 13, fontWeight: '600', color: '#64748b', marginLeft: 8 },
  metricValue: { fontSize: 28, fontWeight: '900', color: '#0f172a' },
  metricUnit: { fontSize: 14, fontWeight: '600', color: '#94a3b8' },
  alertBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ecfdf5', padding: 16, borderRadius: 16, marginTop: 8 },
  alertTitle: { fontSize: 15, fontWeight: '800', color: '#065f46', marginBottom: 4 },
  alertDesc: { fontSize: 12, color: '#047857', lineHeight: 18 }
});
