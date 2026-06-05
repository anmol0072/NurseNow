import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, Platform, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RatingScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      if (Platform.OS === 'web') window.alert('Please select a rating');
      else Alert.alert('Error', 'Please select a rating');
      return;
    }
    
    if (Platform.OS === 'web') {
      window.alert('Thank you for your feedback!');
      navigation.navigate('PatientDashboard');
    } else {
      Alert.alert('Success', 'Thank you for your feedback!', [
        { text: 'OK', onPress: () => navigation.navigate('PatientDashboard') }
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, 40) }]}>
          
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Ionicons name="close" size={28} color="#94a3b8" />
          </TouchableOpacity>

          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>SA</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="checkmark-circle" size={16} color="#0f766e" />
            </View>
          </View>

          <Text style={styles.title}>How was your experience?</Text>
          <Text style={styles.subtitle}>Rate your nurse Sarah Adams</Text>

          {/* Star Rating */}
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons 
                  name={rating >= star ? "star" : "star-outline"} 
                  size={48} 
                  color={rating >= star ? "#fbbf24" : "#cbd5e1"} 
                  style={styles.star}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Tip Section */}
          <Text style={styles.sectionLabel}>Add a tip for Sarah</Text>
          <View style={styles.tipsRow}>
            {['₹50', '₹100', '₹200', 'Custom'].map((tip, idx) => (
              <TouchableOpacity key={idx} style={styles.tipChip}>
                <Text style={styles.tipText}>{tip}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Comment */}
          <Text style={styles.sectionLabel}>Leave a compliment</Text>
          <TextInput 
            style={styles.input}
            placeholder="She was very professional and kind..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
          />

        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>Submit Feedback</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24, alignItems: 'center' },
  closeBtn: { alignSelf: 'flex-start', marginBottom: 20 },
  avatarContainer: { marginBottom: 24, position: 'relative' },
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#ccfbf1', alignItems: 'center', justifyContent: 'center',
    borderWidth: 4, borderColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 8
  },
  avatarText: { fontSize: 36, fontWeight: '800', color: '#0f766e' },
  badge: {
    position: 'absolute', bottom: 4, right: 4,
    backgroundColor: '#fff', borderRadius: 12, padding: 2
  },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#64748b', marginBottom: 40 },
  starsContainer: { flexDirection: 'row', gap: 8, marginBottom: 40 },
  star: { marginHorizontal: 4 },
  sectionLabel: { alignSelf: 'flex-start', fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  tipsRow: { flexDirection: 'row', gap: 12, marginBottom: 30, width: '100%' },
  tipChip: {
    flex: 1, paddingVertical: 12, borderRadius: 12,
    borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center'
  },
  tipText: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
  input: {
    width: '100%', height: 120,
    backgroundColor: '#f8fafc', borderRadius: 16,
    padding: 16, fontSize: 16, color: '#0f172a',
    borderWidth: 1, borderColor: '#e2e8f0',
    textAlignVertical: 'top'
  },
  footer: { paddingHorizontal: 24, paddingTop: 20 },
  submitBtn: {
    backgroundColor: '#0f766e', height: 56, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center'
  },
  submitBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' }
});
