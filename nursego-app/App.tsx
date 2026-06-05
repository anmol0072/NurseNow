import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './src/screens/AuthScreen';
import PatientDashboard from './src/screens/PatientDashboard';
import NurseDashboard from './src/screens/NurseDashboard';
import NurseDocumentScreen from './src/screens/NurseDocumentScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import ReceiptScreen from './src/screens/ReceiptScreen';
import ChatScreen from './src/screens/ChatScreen';
import TrackingScreen from './src/screens/TrackingScreen';
import AIAssistantScreen from './src/screens/AIAssistantScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import RatingScreen from './src/screens/RatingScreen';
import BookingHistoryScreen from './src/screens/BookingHistoryScreen';
import FindingNurseScreen from './src/screens/FindingNurseScreen';

import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.role === 'PATIENT') setInitialRoute('Patient');
          else setInitialRoute('Nurse');
        } else {
          setInitialRoute('Auth');
        }
      } catch (e) {
        setInitialRoute('Auth');
      }
    };
    checkAuth();
  }, []);

  if (initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#020617' }}>
        <ActivityIndicator size="large" color="#14b8a6" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Register" component={RegistrationScreen} />
        <Stack.Screen name="Patient" component={PatientDashboard} />
        <Stack.Screen name="FindingNurse" component={FindingNurseScreen} />
        <Stack.Screen name="Nurse" component={NurseDashboard} />
        <Stack.Screen name="NurseDocument" component={NurseDocumentScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="Receipt" component={ReceiptScreen} />
        <Stack.Screen name="Tracking" component={TrackingScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="AIAssistant" component={AIAssistantScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="BookingHistory" component={BookingHistoryScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="Rating" component={RatingScreen} options={{ presentation: 'modal' }} />
      </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
