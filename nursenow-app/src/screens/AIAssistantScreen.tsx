import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function AIAssistantScreen({ navigation }: any) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hi there! I am the NurseNow AI Triage Assistant. What symptoms are you experiencing today?', sender: 'AI', time: 'Just now' },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    const userMsg = {
      id: Date.now().toString(),
      text: message,
      sender: 'USER',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setMessage('');

    // Simulate AI typing and response
    setTimeout(() => {
      let aiResponse = 'Based on your symptoms, I recommend booking an IV Nurse for hydration.';
      if (userMsg.text.toLowerCase().includes('cut') || userMsg.text.toLowerCase().includes('wound')) {
        aiResponse = 'For cuts and wounds, please book our Wound Care / Dressing service so a nurse can properly clean and bandage it.';
      } else if (userMsg.text.toLowerCase().includes('emergency') || userMsg.text.toLowerCase().includes('heart')) {
        aiResponse = '🚨 This sounds like a medical emergency. Please call your local emergency services (112 or 911) immediately.';
      }
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'AI',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Ionicons name="sparkles" size={20} color="#fcd34d" style={{ marginRight: 8 }} />
          <Text style={styles.headerTitle}>NurseNow AI</Text>
        </View>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>AI recommendations do not replace professional medical advice.</Text>
          </View>

          {messages.map((msg) => {
            const isUser = msg.sender === 'USER';
            return (
              <View key={msg.id} style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowAI]}>
                {!isUser && (
                  <View style={styles.aiAvatar}>
                    <Ionicons name="medical" size={16} color="#fff" />
                  </View>
                )}
                <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
                  <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextAI]}>
                    {msg.text}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.inputArea}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Describe your symptoms..."
              placeholderTextColor="#94a3b8"
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity onPress={handleSend} style={[styles.sendBtn, !message.trim() && styles.sendBtnDisabled]}>
              <Ionicons name="arrow-up" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16 },
  backBtn: { padding: 8, marginLeft: -8 },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  
  keyboardView: { flex: 1, backgroundColor: '#f8fafc', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  chatArea: { flex: 1 },
  chatContent: { padding: 16, paddingBottom: 32 },
  
  disclaimer: { alignSelf: 'center', backgroundColor: '#fef3c7', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100, marginBottom: 24 },
  disclaimerText: { fontSize: 11, color: '#d97706', fontWeight: '700' },

  messageRow: { flexDirection: 'row', marginBottom: 20, maxWidth: '85%' },
  messageRowUser: { alignSelf: 'flex-end', justifyContent: 'flex-end' },
  messageRowAI: { alignSelf: 'flex-start', justifyContent: 'flex-start' },
  
  aiAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#0f766e', alignItems: 'center', justifyContent: 'center', marginRight: 12, alignSelf: 'flex-end', marginBottom: 4 },
  
  bubble: { padding: 16, borderRadius: 20 },
  bubbleUser: { backgroundColor: '#0f172a', borderBottomRightRadius: 4 },
  bubbleAI: { backgroundColor: '#fff', borderBottomLeftRadius: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: '#f1f5f9' },
  
  bubbleText: { fontSize: 16, lineHeight: 24 },
  bubbleTextUser: { color: '#fff' },
  bubbleTextAI: { color: '#334155' },

  inputArea: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  inputWrapper: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: '#f8fafc', borderRadius: 28, paddingLeft: 20, paddingRight: 8, paddingVertical: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  input: { flex: 1, maxHeight: 120, paddingVertical: 10, paddingRight: 12, fontSize: 16, color: '#0f172a' },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0f766e', alignItems: 'center', justifyContent: 'center', shadowColor: '#0f766e', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  sendBtnDisabled: { backgroundColor: '#cbd5e1', shadowOpacity: 0 },
});
