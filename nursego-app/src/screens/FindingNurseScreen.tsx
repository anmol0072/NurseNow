import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FindingNurseScreen({ navigation, route }: any) {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        })
      ])
    ).start();

    // After 3.5 seconds, navigate to Checkout screen simulating "Nurse Found"
    const timer = setTimeout(() => {
      navigation.replace('Checkout', route.params);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapBackground}>
        {/* We would use an image map background here in production, but a dark overlay gives a good effect */}
      </View>
      
      <View style={styles.content}>
        <View style={styles.radarContainer}>
          <Animated.View style={[
            styles.pulse,
            {
              transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 3] }) }],
              opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0] })
            }
          ]} />
          <Animated.View style={[
            styles.pulse2,
            {
              transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 2] }) }],
              opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] })
            }
          ]} />
          <View style={styles.centerIcon}>
            <Ionicons name="medical" size={40} color="#ffffff" />
          </View>
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.searchingText}>Finding nearby nurses...</Text>
          <Text style={styles.subText}>Matching you with the best available professional in your area</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Dark theme for searching
  },
  mapBackground: {
    ...StyleSheet.absoluteFill,
    opacity: 0.2,
    backgroundColor: '#020617',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
  },
  pulse: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2dd4bf',
  },
  pulse2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0f766e',
  },
  centerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0f766e',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2dd4bf',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 10,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  searchingText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 12,
  },
  subText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
  },
});
