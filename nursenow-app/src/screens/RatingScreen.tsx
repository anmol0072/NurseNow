import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function RatingScreen({ navigation }: any) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    // Navigate back to Dashboard after rating
    navigation.replace('Patient');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <View style={styles.avatarContainer}>
          <View style={styles.avatarGlow}>
            <Text style={styles.avatarText}>S</Text>
          </View>
        </View>

        <Text style={styles.title}>Service Completed</Text>
        <Text style={styles.subtitle}>How was your experience with Sarah?</Text>

        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7}>
              <Ionicons 
                name={rating >= star ? 'star' : 'star-outline'} 
                size={48} 
                color={rating >= star ? '#fbbf24' : '#cbd5e1'} 
                style={styles.star}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.ratingText}>
          {rating === 1 && 'Terrible'}
          {rating === 2 && 'Bad'}
          {rating === 3 && 'Okay'}
          {rating === 4 && 'Good'}
          {rating === 5 && 'Excellent!'}
          {rating === 0 && 'Tap a star to rate'}
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Leave a review (optional)"
            placeholderTextColor="#94a3b8"
            multiline
            value={feedback}
            onChangeText={setFeedback}
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitBtn, rating === 0 && styles.submitBtnDisabled]} 
          onPress={handleSubmit}
          disabled={rating === 0}
        >
          <LinearGradient 
            colors={rating > 0 ? ['#14b8a6', '#0f766e'] : ['#e2e8f0', '#cbd5e1']} 
            style={styles.gradientBtn}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          >
            <Text style={[styles.submitBtnText, rating === 0 && { color: '#94a3b8' }]}>Submit Feedback</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSubmit} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', maxWidth: 500, width: '100%', alignSelf: 'center' },
  
  avatarContainer: { marginBottom: 32 },
  avatarGlow: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#0f766e', alignItems: 'center', justifyContent: 'center', shadowColor: '#0f766e', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10, borderWidth: 4, borderColor: '#ccfbf1' },
  avatarText: { fontSize: 40, fontWeight: '900', color: '#fff' },

  title: { fontSize: 32, fontWeight: '900', color: '#0f172a', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#64748b', fontWeight: '500', marginBottom: 40, textAlign: 'center' },

  starsContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  star: { marginHorizontal: 4 },
  
  ratingText: { fontSize: 18, fontWeight: '800', color: '#0f766e', marginBottom: 40, height: 24 },

  inputContainer: { width: '100%', backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 2, marginBottom: 32 },
  input: { height: 120, padding: 20, paddingTop: 20, fontSize: 16, color: '#0f172a', textAlignVertical: 'top' },

  submitBtn: { width: '100%', borderRadius: 16, shadowColor: '#0f766e', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 8 },
  submitBtnDisabled: { shadowOpacity: 0, elevation: 0 },
  gradientBtn: { width: '100%', paddingVertical: 18, alignItems: 'center', borderRadius: 16 },
  submitBtnText: { color: '#fff', fontSize: 18, fontWeight: '800' },

  skipBtn: { marginTop: 24, padding: 12 },
  skipText: { color: '#64748b', fontWeight: '700', fontSize: 16 },
});
