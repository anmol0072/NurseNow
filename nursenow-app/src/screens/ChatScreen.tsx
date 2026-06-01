import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen({ navigation }: any) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello! I am on my way. I should be there in 15 mins.', sender: 'NURSE', time: '10:30 AM' },
    { id: '2', text: 'Great, see you soon. Take the second left after the park.', sender: 'PATIENT', time: '10:32 AM' },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      text: message,
      sender: 'PATIENT',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMsg]);
    setMessage('');

    // Mock auto-reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: 'Noted! See you.',
        sender: 'NURSE',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 2000);
  };

  const handleSOS = () => {
    Alert.alert('🚨 EMERGENCY SOS', 'Connecting to 24/7 Support line via Masked Call...', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call Now', style: 'destructive' }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8, marginLeft: -8 }}>
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>S</Text>
          </View>
          <View>
            <Text style={styles.nurseName}>Sarah Jenkins</Text>
            <Text style={styles.nurseStatus}>Nurse • Active Job</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.sosBtn} onPress={handleSOS}>
          <Ionicons name="call" size={16} color="#fff" style={{ marginRight: 4 }} />
          <Text style={styles.sosText}>SOS / CALL</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
          <View style={styles.systemMessage}>
            <Text style={styles.systemText}>Your call is masked to protect privacy.</Text>
          </View>

          {messages.map((msg) => {
            const isMe = msg.sender === 'PATIENT';
            return (
              <View key={msg.id} style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowThem]}>
                {!isMe && <View style={styles.smallAvatar}><Text style={styles.smallAvatarText}>S</Text></View>}
                <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
                  <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>{msg.text}</Text>
                  <Text style={[styles.timeText, isMe ? styles.timeTextMe : styles.timeTextThem]}>{msg.time}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputArea}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="#94a3b8"
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity onPress={handleSend} style={[styles.sendBtn, !message.trim() && styles.sendBtnDisabled]}>
              <Ionicons name="send" size={18} color="#fff" style={{ marginLeft: 2 }} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#0f766e', alignItems: 'center', justifyContent: 'center', marginLeft: 8, marginRight: 12 },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  nurseName: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  nurseStatus: { fontSize: 12, color: '#10b981', fontWeight: '700' },
  
  sosBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 100, shadowColor: '#ef4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  sosText: { color: '#fff', fontWeight: '800', fontSize: 12 },

  keyboardView: { flex: 1 },
  chatArea: { flex: 1 },
  chatContent: { padding: 16, paddingBottom: 32 },
  
  systemMessage: { alignSelf: 'center', backgroundColor: '#e2e8f0', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 100, marginBottom: 24 },
  systemText: { fontSize: 12, color: '#64748b', fontWeight: '600' },

  messageRow: { flexDirection: 'row', marginBottom: 16, maxWidth: '80%' },
  messageRowMe: { alignSelf: 'flex-end', justifyContent: 'flex-end' },
  messageRowThem: { alignSelf: 'flex-start', justifyContent: 'flex-start' },
  
  smallAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center', marginRight: 8, alignSelf: 'flex-end', marginBottom: 4 },
  smallAvatarText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  bubble: { padding: 14, borderRadius: 20 },
  bubbleMe: { backgroundColor: '#0f766e', borderBottomRightRadius: 4 },
  bubbleThem: { backgroundColor: '#fff', borderBottomLeftRadius: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, borderWidth: 1, borderColor: '#f1f5f9' },
  
  bubbleText: { fontSize: 15, lineHeight: 22 },
  bubbleTextMe: { color: '#fff' },
  bubbleTextThem: { color: '#334155' },

  timeText: { fontSize: 11, marginTop: 4, alignSelf: 'flex-end' },
  timeTextMe: { color: '#ccfbf1' },
  timeTextThem: { color: '#94a3b8' },

  inputArea: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  inputWrapper: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: '#f1f5f9', borderRadius: 24, paddingLeft: 20, paddingRight: 6, paddingVertical: 6, borderWidth: 1, borderColor: '#e2e8f0' },
  input: { flex: 1, maxHeight: 100, paddingVertical: 10, paddingRight: 12, fontSize: 16, color: '#0f172a' },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#0f766e', alignItems: 'center', justifyContent: 'center', shadowColor: '#0f766e', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 2 },
  sendBtnDisabled: { backgroundColor: '#94a3b8', shadowOpacity: 0 },
});
