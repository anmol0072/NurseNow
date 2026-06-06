import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator, Platform, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function CheckoutScreen({ route, navigation }: any) {
  const { serviceName = 'IV Injection', basePrice = 699, distance = 3.2 } = route.params || {};

  const distanceRate = 12; // ₹12 per km after 4km
  const chargeableDistance = Math.max(0, distance - 4);
  const distanceCost = chargeableDistance * distanceRate;
  const subtotal = basePrice + distanceCost;
  const gst = subtotal * 0.18;
  
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [showBiodata, setShowBiodata] = useState(false);
  const total = subtotal + gst + tipAmount;

  const handleContinueToPayment = () => {
    navigation.navigate('Payment', { total, serviceName });
  };

  // Removed processing overlay since payment is moved to PaymentScreen

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review & Pay</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        {/* Nurse Profile Card */}
        <TouchableOpacity style={styles.nurseCard} activeOpacity={0.9} onPress={() => setShowBiodata(true)}>
          <View style={styles.nurseHeader}>
            <Image source={{uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200'}} style={styles.nurseAvatarImg} />
            <View>
              <Text style={styles.nurseName}>Asha Johnson</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="star" size={14} color="#f59e0b" />
                <Text style={styles.nurseRating}> 4.9 (120+ trips)</Text>
              </View>
              <Text style={styles.viewBiodataText}>Tap to view biodata</Text>
            </View>
          </View>
          <View style={styles.etaBadge}>
            <Text style={styles.etaText}>4 MINS AWAY</Text>
          </View>
        </TouchableOpacity>

        {/* Bill Breakdown Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bill Summary</Text>
          
          <View style={styles.row}>
            <Text style={styles.itemText}>{serviceName} (Base)</Text>
            <Text style={styles.priceText}>₹{basePrice.toFixed(2)}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.itemText}>Travel Fee ({distance.toFixed(1)} km)</Text>
            <Text style={styles.priceText}>₹{distanceCost.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />
          
          <View style={styles.row}>
            <Text style={styles.itemText}>Taxes (18% GST)</Text>
            <Text style={styles.priceText}>₹{gst.toFixed(2)}</Text>
          </View>
          
          <View style={[styles.divider, styles.thickDivider]} />
          
          <View style={styles.row}>
            <Text style={styles.totalText}>Subtotal</Text>
            <Text style={styles.totalPrice}>₹{(subtotal + gst).toFixed(2)}</Text>
          </View>
        </View>

        {/* Tip Section */}
        <Text style={styles.sectionTitle}>Add a Tip for Asha (Optional)</Text>
        <View style={styles.tipRow}>
          {[0, 20, 50, 100].map((amount) => (
            <TouchableOpacity 
              key={amount}
              style={[styles.tipBtn, tipAmount === amount && styles.tipBtnActive]}
              onPress={() => setTipAmount(amount)}
            >
              <Text style={[styles.tipText, tipAmount === amount && styles.tipTextActive]}>
                {amount === 0 ? 'None' : `₹${amount}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerTotalLabel}>Total Pay</Text>
          <Text style={styles.footerTotalPrice}>₹{total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity onPress={handleContinueToPayment} activeOpacity={0.8}>
          <LinearGradient colors={['#3b82f6', '#1d4ed8']} style={styles.payBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.payBtnText}>Continue to Payment</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Nurse Biodata Modal */}
      <Modal visible={showBiodata} animationType="slide" transparent={true} onRequestClose={() => setShowBiodata(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setShowBiodata(false)}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>

            <Image source={{uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=400'}} style={styles.modalAvatar} />
            
            <View style={styles.modalTitleRow}>
              <Text style={styles.modalName}>Asha Johnson</Text>
              <Ionicons name="checkmark-circle" size={24} color="#1d4ed8" />
            </View>
            <Text style={styles.modalRole}>Senior IV & Critical Care Nurse</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statBoxValue}>8 Yrs</Text>
                <Text style={styles.statBoxLabel}>Experience</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statBoxValue}>4.9 ⭐</Text>
                <Text style={styles.statBoxLabel}>Rating</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statBoxValue}>120+</Text>
                <Text style={styles.statBoxLabel}>Visits</Text>
              </View>
            </View>

            <ScrollView style={styles.bioScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.bioSectionTitle}>About Asha</Text>
              <Text style={styles.bioText}>
                Asha is a highly trained critical care nurse specializing in intravenous therapies, post-operative care, and geriatric support. She has a pristine record of delivering painless and compassionate care directly to patients' homes.
              </Text>

              <Text style={styles.bioSectionTitle}>Languages Spoken</Text>
              <View style={styles.tagsContainer}>
                <View style={styles.tag}><Text style={styles.tagText}>English</Text></View>
                <View style={styles.tag}><Text style={styles.tagText}>Hindi</Text></View>
                <View style={styles.tag}><Text style={styles.tagText}>Tamil</Text></View>
              </View>

              <Text style={styles.bioSectionTitle}>Credentials & Verification</Text>
              <View style={styles.credentialRow}>
                <Ionicons name="shield-checkmark" size={20} color="#10b981" />
                <Text style={styles.credentialText}>Background Check Passed</Text>
              </View>
              <View style={styles.credentialRow}>
                <Ionicons name="medkit" size={20} color="#1d4ed8" />
                <Text style={styles.credentialText}>B.Sc. Nursing (AIIMS Delhi)</Text>
              </View>
              <View style={styles.credentialRow}>
                <Ionicons name="document-text" size={20} color="#f59e0b" />
                <Text style={styles.credentialText}>State Medical Council Registered</Text>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.modalPrimaryBtn} onPress={() => setShowBiodata(false)}>
              <Text style={styles.modalPrimaryBtnText}>Close Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  backBtn: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 100, maxWidth: 600, width: '100%', alignSelf: 'center' },
  
  nurseCard: { backgroundColor: '#1d4ed8', borderRadius: 20, padding: 20, marginBottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#1d4ed8', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  nurseHeader: { flexDirection: 'row', alignItems: 'center' },
  nurseAvatarImg: { width: 50, height: 50, borderRadius: 25, marginRight: 12, borderWidth: 2, borderColor: '#fff' },
  nurseName: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 2 },
  nurseRating: { fontSize: 14, color: '#eff6ff', fontWeight: '600' },
  viewBiodataText: { fontSize: 11, color: '#93c5fd', marginTop: 4, fontWeight: '600', textDecorationLine: 'underline' },
  etaBadge: { backgroundColor: '#eff6ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  etaText: { color: '#1d4ed8', fontWeight: '900', fontSize: 12 },

  card: { backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 4 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  itemText: { fontSize: 15, color: '#64748b', fontWeight: '500' },
  priceText: { fontSize: 15, color: '#334155', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 12 },
  thickDivider: { height: 2, backgroundColor: '#e2e8f0', borderStyle: 'dashed' },
  totalText: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  totalPrice: { fontSize: 22, fontWeight: '900', color: '#1d4ed8' },

  tipRow: { flexDirection: 'row', gap: 12, marginBottom: 32, marginTop: 8 },
  tipBtn: { flex: 1, paddingVertical: 14, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  tipBtnActive: { backgroundColor: '#eff6ff', borderColor: '#1d4ed8', borderWidth: 2 },
  tipText: { fontWeight: '700', color: '#64748b' },
  tipTextActive: { color: '#1d4ed8', fontWeight: '900' },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#334155', marginBottom: 16, marginTop: 8 },
  paymentOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 2, borderColor: '#f1f5f9' },
  paymentOptionActive: { borderColor: '#60a5fa', backgroundColor: '#eff6ff' },
  paymentIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  paymentText: { flex: 1, fontSize: 16, fontWeight: '600', color: '#475569' },
  paymentTextActive: { color: '#1d4ed8', fontWeight: '800' },

  cardInputContainer: { backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  cardInput: { backgroundColor: '#f8fafc', padding: 14, borderRadius: 12, fontSize: 15, fontWeight: '500', color: '#0f172a', borderWidth: 1, borderColor: '#e2e8f0' },

  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 24, paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 10 },
  footerTotalLabel: { fontSize: 13, color: '#64748b', fontWeight: '700', textTransform: 'uppercase' },
  footerTotalPrice: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
  payBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, borderRadius: 16 },
  payBtnText: { color: '#fff', fontWeight: '800', fontSize: 16, marginRight: 8 },

  processingContainer: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  processingText: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginTop: 24 },
  processingSub: { fontSize: 15, color: '#94a3b8', marginTop: 8 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24, maxHeight: '85%' },
  closeModalBtn: { position: 'absolute', top: 24, right: 24, zIndex: 10, padding: 8, backgroundColor: '#f1f5f9', borderRadius: 20 },
  modalAvatar: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginTop: 10, marginBottom: 16, borderWidth: 3, borderColor: '#eff6ff' },
  modalTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  modalName: { fontSize: 24, fontWeight: '900', color: '#0f172a', marginRight: 6 },
  modalRole: { fontSize: 15, color: '#64748b', textAlign: 'center', fontWeight: '600', marginBottom: 24 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, backgroundColor: '#f8fafc', borderRadius: 16, padding: 16 },
  statBox: { alignItems: 'center', flex: 1 },
  statBoxValue: { fontSize: 18, fontWeight: '900', color: '#1d4ed8', marginBottom: 4 },
  statBoxLabel: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  bioScroll: { marginBottom: 20 },
  bioSectionTitle: { fontSize: 16, fontWeight: '800', color: '#334155', marginBottom: 8, marginTop: 16 },
  bioText: { fontSize: 14, color: '#475569', lineHeight: 22, fontWeight: '500' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: '#eff6ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#bfdbfe' },
  tagText: { color: '#1d4ed8', fontWeight: '700', fontSize: 13 },
  credentialRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, backgroundColor: '#f8fafc', padding: 12, borderRadius: 12 },
  credentialText: { fontSize: 14, fontWeight: '600', color: '#334155', marginLeft: 12 },
  modalPrimaryBtn: { backgroundColor: '#0f172a', paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  modalPrimaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' }
});
