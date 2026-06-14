import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function FamilyDashboardScreen({ navigation }: any) {
  const [patients] = useState([
    { id: 1, name: 'Anil Johnson', relation: 'Father', status: 'Healthy', lastVisit: '2 days ago', upcoming: null },
    { id: 2, name: 'Sita Johnson', relation: 'Mother', status: 'Nurse En Route', lastVisit: 'Today', upcoming: 'IV Injection' }
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Family Dashboard</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="person-add" size={20} color="#1d4ed8" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.premiumBanner}>
          <Ionicons name="shield-checkmark" size={24} color="#fff" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.bannerTitle}>NurseNow Care+ Active</Text>
            <Text style={styles.bannerDesc}>You are receiving real-time alerts for all linked family members.</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Linked Loved Ones</Text>

        {patients.map(patient => (
          <View key={patient.id} style={styles.patientCard}>
            <View style={styles.patientHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{patient.name.charAt(0)}</Text>
              </View>
              <View style={styles.patientInfo}>
                <Text style={styles.patientName}>{patient.name}</Text>
                <Text style={styles.patientRelation}>{patient.relation}</Text>
              </View>
              <View style={[styles.statusBadge, patient.status === 'Nurse En Route' && styles.statusActive]}>
                <Text style={[styles.statusText, patient.status === 'Nurse En Route' && styles.statusTextActive]}>
                  {patient.status}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.patientDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Last Visit</Text>
                <Text style={styles.detailValue}>{patient.lastVisit}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Next Due</Text>
                <Text style={styles.detailValue}>{patient.upcoming || 'None'}</Text>
              </View>
            </View>

            {patient.status === 'Nurse En Route' && (
              <TouchableOpacity 
                style={styles.trackBtn} 
                onPress={() => navigation.navigate('Tracking', { bookingId: 'mock-id' })}
              >
                <Ionicons name="location" size={16} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.trackBtnText}>Track Live GPS</Text>
              </TouchableOpacity>
            )}

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="document-text-outline" size={20} color="#1d4ed8" />
                <Text style={styles.actionText}>Health Reports</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="medical-outline" size={20} color="#1d4ed8" />
                <Text style={styles.actionText}>Medications</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.inviteCard}>
          <View style={styles.inviteIcon}>
            <Ionicons name="link" size={24} color="#0f766e" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.inviteTitle}>Link Another Member</Text>
            <Text style={styles.inviteDesc}>Enter their UHID or share an invite link.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  content: { padding: 20 },
  premiumBanner: { backgroundColor: '#1d4ed8', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 24, shadowColor: '#1d4ed8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  bannerTitle: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 4 },
  bannerDesc: { color: '#bfdbfe', fontSize: 13, lineHeight: 18 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 16 },
  patientCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  patientHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#e0e7ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 20, fontWeight: '800', color: '#4338ca' },
  patientInfo: { flex: 1 },
  patientName: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  patientRelation: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  statusBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusActive: { backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fca5a5' },
  statusText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  statusTextActive: { color: '#ef4444' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginBottom: 16 },
  patientDetails: { flexDirection: 'row', marginBottom: 16 },
  detailItem: { flex: 1 },
  detailLabel: { fontSize: 12, color: '#94a3b8', fontWeight: '600', marginBottom: 4 },
  detailValue: { fontSize: 14, color: '#0f172a', fontWeight: '700' },
  trackBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ef4444', height: 44, borderRadius: 12, marginBottom: 16 },
  trackBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eff6ff', height: 44, borderRadius: 12, marginHorizontal: 4 },
  actionText: { color: '#1d4ed8', fontSize: 13, fontWeight: '700', marginLeft: 6 },
  inviteCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ecfdf5', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#d1fae5', marginTop: 8 },
  inviteIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#ccfbf1', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  inviteTitle: { fontSize: 16, fontWeight: '800', color: '#065f46', marginBottom: 4 },
  inviteDesc: { fontSize: 13, color: '#047857' }
});
