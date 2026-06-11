import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function AIChatScreen({ navigation }: any) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm NurseNow AI. I can explain your procedures, help you understand discharge notes, or answer general health questions.", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const predefinedResponses: any = {
    "injection": "After an IM injection, you may experience mild soreness. Do not massage the area vigorously. Apply a cold compress if needed. If redness persists for over 24 hours, contact your nurse.",
    "catheter": "Catheter care is important. Always keep the drainage bag below bladder level to prevent backflow. Wash the area daily with mild soap and water.",
    "wound": "Keep your dressing dry. If it gets wet or loose, book a 'Wound Dressing' service so a nurse can properly change it to avoid infection.",
    "default": "That's a great question! For a detailed clinical answer, I recommend booking a Free Telehealth Consult (included in NurseNow Care+) or asking your assigned nurse."
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const query = input.toLowerCase();
    let responseText = predefinedResponses.default;
    
    if (query.includes('injection')) responseText = predefinedResponses.injection;
    else if (query.includes('catheter')) responseText = predefinedResponses.catheter;
    else if (query.includes('wound') || query.includes('dressing')) responseText = predefinedResponses.wound;

    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: responseText, sender: 'ai' }]);
      setIsTyping(false);
    }, 1500);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
           <Ionicons name="sparkles" size={16} color="#1d4ed8" style={{marginRight: 6}} />
           <Text style={styles.headerTitle}>AI Health Assistant</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.chatContent}
        >
          {messages.map(msg => (
            <View key={msg.id} style={[styles.messageRow, msg.sender === 'user' ? styles.messageRowUser : styles.messageRowAi]}>
              {msg.sender === 'ai' && (
                <View style={styles.aiAvatar}>
                  <Ionicons name="sparkles" size={14} color="#fff" />
                </View>
              )}
              <View style={[styles.bubble, msg.sender === 'user' ? styles.bubbleUser : styles.bubbleAi]}>
                 <Text style={[styles.bubbleText, msg.sender === 'user' ? styles.textUser : styles.textAi]}>{msg.text}</Text>
              </View>
            </View>
          ))}
          
          {isTyping && (
            <View style={[styles.messageRow, styles.messageRowAi]}>
              <View style={styles.aiAvatar}>
                <Ionicons name="sparkles" size={14} color="#fff" />
              </View>
              <View style={[styles.bubble, styles.bubbleAi]}>
                 <Text style={[styles.bubbleText, styles.textAi]}>Thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.textInput}
            placeholder="Ask me anything..."
            placeholderTextColor="#94a3b8"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <LinearGradient colors={['#1d4ed8', '#4338ca']} style={styles.sendBtnGradient}>
              <Ionicons name="send" size={16} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  chatContent: { padding: 20, paddingBottom: 40 },
  messageRow: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-end' },
  messageRowUser: { justifyContent: 'flex-end' },
  messageRowAi: { justifyContent: 'flex-start' },
  aiAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#1d4ed8', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  bubble: { maxWidth: '80%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  bubbleUser: { backgroundColor: '#1d4ed8', borderBottomRightRadius: 4 },
  bubbleAi: { backgroundColor: '#fff', borderBottomLeftRadius: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  textUser: { color: '#fff' },
  textAi: { color: '#334155' },
  inputContainer: { flexDirection: 'row', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0', alignItems: 'center' },
  textInput: { flex: 1, backgroundColor: '#f1f5f9', height: 48, borderRadius: 24, paddingHorizontal: 20, fontSize: 15, color: '#0f172a', marginRight: 12 },
  sendBtn: { width: 48, height: 48, borderRadius: 24, overflow: 'hidden' },
  sendBtnGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' }
});
