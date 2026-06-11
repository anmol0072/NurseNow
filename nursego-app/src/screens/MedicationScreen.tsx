import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

export default function MedicationScreen({ navigation }: any) {
  const [pills, setPills] = useState([
    { id: 1, name: 'Amlodipine 5mg', time: '08:00 AM', type: 'After Breakfast', taken: false, color: '#3b82f6' },
    { id: 2, name: 'Metformin 500mg', time: '01:00 PM', type: 'With Lunch', taken: false, color: '#10b981' },
    { id: 3, name: 'Atorvastatin 20mg', time: '09:00 PM', type: 'After Dinner', taken: false, color: '#8b5cf6' }
  ]);

  const togglePill = (id: number) => {
    setPills(pills.map(p => p.id === id ? { ...p, taken: !p.taken } : p));
  };

  const uploadPrescription = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
      });
      if (!res.canceled) {
        alert('Prescription uploaded! AI is extracting your schedule...');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Smart Pill Reminder</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.banner}>
           <View style={styles.bannerIcon}>
             <Ionicons name="scan-outline" size={28} color="#fff" />
           </View>
           <View style={{ flex: 1, marginLeft: 16 }}>
             <Text style={styles.bannerTitle}>Auto-Schedule Pills</Text>
             <Text style={styles.bannerDesc}>Upload your prescription and let AI create your reminder schedule automatically.</Text>
           </View>
        </View>

        <TouchableOpacity style={styles.uploadBtn} onPress={uploadPrescription}>
           <Ionicons name="document-text" size={20} color="#1d4ed8" />
           <Text style={styles.uploadBtnText}>Upload Prescription</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Today's Schedule</Text>

        {pills.map(pill => (
          <View key={pill.id} style={[styles.pillCard, pill.taken && styles.pillCardTaken]}>
            <View style={[styles.pillIcon, { backgroundColor: pill.color + '20' }]}>
               <Ionicons name="medical" size={24} color={pill.color} />
            </View>
            <View style={styles.pillInfo}>
               <Text style={[styles.pillName, pill.taken && styles.textTaken]}>{pill.name}</Text>
               <View style={styles.pillMetaRow}>
                 <Ionicons name="time-outline" size={14} color="#64748b" />
                 <Text style={styles.pillMetaText}>{pill.time} • {pill.type}</Text>
               </View>
            </View>
            <TouchableOpacity 
              style={[styles.checkBtn, pill.taken ? styles.checkBtnTaken : styles.checkBtnPending]} 
              onPress={() => togglePill(pill.id)}
            >
               <Ionicons name="checkmark" size={20} color={pill.taken ? '#fff' : '#cbd5e1'} />
            </TouchableOpacity>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  content: { padding: 20 },
  banner: { backgroundColor: '#1d4ed8', borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  bannerIcon: { width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  bannerTitle: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 4 },
  bannerDesc: { fontSize: 13, color: '#bfdbfe', lineHeight: 18 },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eff6ff', height: 56, borderRadius: 12, borderWidth: 1, borderColor: '#bfdbfe', marginBottom: 32 },
  uploadBtnText: { fontSize: 16, fontWeight: '700', color: '#1d4ed8', marginLeft: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 16 },
  pillCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' },
  pillCardTaken: { backgroundColor: '#f8fafc', borderColor: '#e2e8f0', opacity: 0.7 },
  pillIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  pillInfo: { flex: 1 },
  pillName: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  textTaken: { textDecorationLine: 'line-through', color: '#64748b' },
  pillMetaRow: { flexDirection: 'row', alignItems: 'center' },
  pillMetaText: { fontSize: 13, color: '#64748b', marginLeft: 4 },
  checkBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  checkBtnPending: { borderColor: '#e2e8f0', backgroundColor: '#fff' },
  checkBtnTaken: { borderColor: '#10b981', backgroundColor: '#10b981' }
});
