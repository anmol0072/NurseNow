import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function VideoConsultScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Remote Video Feed (Nurse) */}
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1000' }} 
        style={styles.remoteVideo}
        resizeMode="cover"
      >
        <LinearGradient 
           colors={['rgba(0,0,0,0.6)', 'transparent', 'transparent', 'rgba(0,0,0,0.8)']} 
           style={styles.gradientOverlay} 
        />

        <SafeAreaView style={styles.safeArea}>
           <View style={styles.header}>
             <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
               <Ionicons name="chevron-down" size={24} color="#fff" />
             </TouchableOpacity>
             <View style={styles.timerBadge}>
               <View style={styles.recordingDot} />
               <Text style={styles.timerText}>{formatTime(seconds)}</Text>
             </View>
             <TouchableOpacity style={styles.iconBtn}>
               <Ionicons name="camera-reverse" size={24} color="#fff" />
             </TouchableOpacity>
           </View>

           <View style={styles.bottomSection}>
              <View style={styles.nurseInfo}>
                <Text style={styles.nurseName}>Nurse Asha Johnson</Text>
                <Text style={styles.nurseRole}>Senior Clinical Advisor</Text>
              </View>

              {/* Local Video Feed (Patient) */}
              <View style={styles.localVideoContainer}>
                 {!isVideoOff ? (
                   <Image 
                     source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300' }} 
                     style={styles.localVideo} 
                   />
                 ) : (
                   <View style={[styles.localVideo, { backgroundColor: '#334155', alignItems: 'center', justifyContent: 'center' }]}>
                     <Ionicons name="person" size={40} color="#94a3b8" />
                   </View>
                 )}
              </View>

              {/* Controls */}
              <View style={styles.controlsRow}>
                 <TouchableOpacity 
                   style={[styles.controlBtn, isMuted && styles.controlBtnActive]} 
                   onPress={() => setIsMuted(!isMuted)}
                 >
                   <Ionicons name={isMuted ? "mic-off" : "mic"} size={28} color={isMuted ? "#ef4444" : "#fff"} />
                 </TouchableOpacity>

                 <TouchableOpacity 
                   style={[styles.controlBtn, isVideoOff && styles.controlBtnActive]} 
                   onPress={() => setIsVideoOff(!isVideoOff)}
                 >
                   <Ionicons name={isVideoOff ? "videocam-off" : "videocam"} size={28} color={isVideoOff ? "#ef4444" : "#fff"} />
                 </TouchableOpacity>

                 <TouchableOpacity style={[styles.controlBtn, styles.endCallBtn]} onPress={() => navigation.goBack()}>
                   <Ionicons name="call" size={28} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
                 </TouchableOpacity>
              </View>
           </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  remoteVideo: { flex: 1, width: '100%', height: '100%' },
  gradientOverlay: { ...StyleSheet.absoluteFillObject },
  safeArea: { flex: 1, justifyContent: 'space-between' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  timerBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  recordingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444', marginRight: 8 },
  timerText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  bottomSection: { paddingHorizontal: 20, paddingBottom: 40 },
  nurseInfo: { marginBottom: 24 },
  nurseName: { color: '#fff', fontSize: 24, fontWeight: '800', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  nurseRole: { color: '#cbd5e1', fontSize: 15, fontWeight: '600', marginTop: 4 },
  localVideoContainer: { position: 'absolute', right: 20, bottom: 120, width: 100, height: 150, borderRadius: 16, overflow: 'hidden', borderWidth: 2, borderColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 10 },
  localVideo: { width: '100%', height: '100%' },
  controlsRow: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', paddingVertical: 16, borderRadius: 40, backdropFilter: 'blur(10px)' },
  controlBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  controlBtnActive: { backgroundColor: '#fff' },
  endCallBtn: { backgroundColor: '#ef4444', width: 64, height: 64, borderRadius: 32 }
});
