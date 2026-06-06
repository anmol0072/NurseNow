import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, SafeAreaView, Platform, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FeatureUnavailableModal from '../components/FeatureUnavailableModal';

export default function SettingsScreen({ navigation }: any) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({ title: '', message: '' });

  const showModal = (title: string, message: string) => {
    setModalData({ title, message });
    setModalVisible(true);
  };
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const Section = ({ title, children }: any) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>
        {children}
      </View>
    </View>
  );

  const ToggleRow = ({ icon, label, value, onValueChange, isLast }: any) => (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={22} color="#64748b" style={styles.rowIcon} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Switch
        trackColor={{ false: '#cbd5e1', true: '#5eead4' }}
        thumbColor={value ? '#0f766e' : '#f8fafc'}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );

  const LinkRow = ({ icon, label, onPress, isLast, color = "#64748b" }: any) => (
    <TouchableOpacity style={[styles.row, !isLast && styles.rowBorder]} onPress={onPress}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={22} color={color} style={styles.rowIcon} />
        <Text style={[styles.rowLabel, { color: color === '#64748b' ? '#334155' : color }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        <Section title="NOTIFICATIONS">
          <ToggleRow icon="notifications-outline" label="Push Notifications" value={pushEnabled} onValueChange={setPushEnabled} />
          <ToggleRow icon="mail-outline" label="Email Updates" value={emailEnabled} onValueChange={setEmailEnabled} />
          <ToggleRow icon="chatbubble-outline" label="SMS Alerts" value={smsEnabled} onValueChange={setSmsEnabled} isLast />
        </Section>

        <Section title="PRIVACY & SECURITY">
          <ToggleRow icon="location-outline" label="Location Services" value={locationEnabled} onValueChange={setLocationEnabled} />
          <LinkRow icon="lock-closed-outline" label="Change Password" onPress={() => showModal('Change Password', 'This feature is coming soon!')} />
          <LinkRow icon="shield-checkmark-outline" label="Two-Factor Authentication" onPress={() => showModal('2FA', 'Two-Factor Authentication is coming soon!')} isLast />
        </Section>

        <Section title="ABOUT">
          <LinkRow icon="document-text-outline" label="Terms of Service" onPress={() => Linking.openURL('https://nursenow.in/terms')} />
          <LinkRow icon="shield-half-outline" label="Privacy Policy" onPress={() => Linking.openURL('https://nursenow.in/privacy')} />
          <LinkRow icon="information-circle-outline" label="About NurseGo" onPress={() => Linking.openURL('https://nursenow.in')} isLast />
        </Section>

        <View style={styles.deleteSection}>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => Alert.alert('Delete Account', 'Are you sure you want to delete your account? This action cannot be undone.', [{text: 'Cancel', style: 'cancel'}, {text: 'Delete', style: 'destructive'}])}>
            <Text style={styles.deleteBtnText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94a3b8',
    marginBottom: 8,
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
  },
  deleteSection: {
    marginTop: 12,
    marginBottom: 40,
  },
  deleteBtn: {
    backgroundColor: '#fef2f2',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  deleteBtnText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  }
});
