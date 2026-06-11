import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SubscriptionScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    // Simulate a payment flow for the pitch demo
    setTimeout(async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.isSubscribed = true;
          await AsyncStorage.setItem('user', JSON.stringify(user));
        }
        Alert.alert('Welcome to Care+!', 'You are now a NurseNow Care+ member. Enjoy your priority booking and 10% discounts!');
        navigation.goBack();
      } catch (e) {
         console.error(e);
      } finally {
         setLoading(false);
      }
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header Image / Graphic */}
        <View style={styles.headerImageContainer}>
           <Image 
             source={{uri: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=600&h=400'}} 
             style={styles.headerImage}
           />
           <View style={styles.overlay}>
             <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
               <Ionicons name="close" size={24} color="#fff" />
             </TouchableOpacity>
           </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.brandTitle}>NurseNow <Text style={styles.brandPlus}>Care+</Text></Text>
          <Text style={styles.subtitle}>The ultimate healthcare membership for your family.</Text>

          <View style={styles.priceContainer}>
             <Text style={styles.priceAmount}>₹499</Text>
             <Text style={styles.priceDuration}>/ month</Text>
          </View>

          <Text style={styles.benefitsTitle}>Membership Benefits</Text>

          <View style={styles.benefitRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="flash" size={20} color="#fbbf24" />
            </View>
            <View style={styles.benefitTextContainer}>
              <Text style={styles.benefitTitle}>Priority Booking</Text>
              <Text style={styles.benefitDesc}>Skip the queue. Your requests are sent to top-rated nurses first.</Text>
            </View>
          </View>

          <View style={styles.benefitRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="pricetag" size={20} color="#10b981" />
            </View>
            <View style={styles.benefitTextContainer}>
              <Text style={styles.benefitTitle}>10% Flat Discount</Text>
              <Text style={styles.benefitDesc}>Save 10% on every single injection, dressing, or procedure.</Text>
            </View>
          </View>

          <View style={styles.benefitRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="videocam" size={20} color="#6366f1" />
            </View>
            <View style={styles.benefitTextContainer}>
              <Text style={styles.benefitTitle}>Free Telehealth Consult</Text>
              <Text style={styles.benefitDesc}>Get 1 free video consultation with a senior nurse every month.</Text>
            </View>
          </View>

          <View style={styles.benefitRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={20} color="#3b82f6" />
            </View>
            <View style={styles.benefitTextContainer}>
              <Text style={styles.benefitTitle}>Family Dashboard</Text>
              <Text style={styles.benefitDesc}>Unlock remote monitoring and deep-links for your loved ones.</Text>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Sticky Bottom Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.subscribeBtn} onPress={handleSubscribe} disabled={loading}>
          <LinearGradient colors={['#1d4ed8', '#4338ca']} style={styles.gradientBtn} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
             <Text style={styles.subscribeBtnText}>{loading ? 'Processing...' : 'Subscribe Now'}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.termsText}>Cancel anytime. Terms & conditions apply.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerImageContainer: { height: 280, position: 'relative' },
  headerImage: { width: '100%', height: '100%' },
  overlay: { position: 'absolute', top: 20, left: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  content: { padding: 24, marginTop: -30, backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  brandTitle: { fontSize: 32, fontWeight: '900', color: '#0f172a' },
  brandPlus: { color: '#3b82f6' },
  subtitle: { fontSize: 15, color: '#64748b', marginTop: 8, lineHeight: 22 },
  priceContainer: { flexDirection: 'row', alignItems: 'baseline', marginTop: 24, marginBottom: 32, backgroundColor: '#f8fafc', alignSelf: 'flex-start', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16 },
  priceAmount: { fontSize: 36, fontWeight: '900', color: '#1d4ed8' },
  priceDuration: { fontSize: 16, fontWeight: '600', color: '#64748b', marginLeft: 4 },
  benefitsTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 20 },
  benefitRow: { flexDirection: 'row', marginBottom: 24 },
  iconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  benefitTextContainer: { flex: 1 },
  benefitTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  benefitDesc: { fontSize: 14, color: '#64748b', lineHeight: 20 },
  footer: { paddingHorizontal: 24, paddingVertical: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  subscribeBtn: { width: '100%', height: 56, borderRadius: 28, overflow: 'hidden' },
  gradientBtn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  subscribeBtnText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  termsText: { textAlign: 'center', color: '#94a3b8', fontSize: 12, marginTop: 12 }
});
