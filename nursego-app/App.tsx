import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './src/screens/AuthScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';
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
import OffersScreen from './src/screens/OffersScreen';
import ReferralScreen from './src/screens/ReferralScreen';
import EmergencyContactsScreen from './src/screens/EmergencyContactsScreen';
import FamilyDashboardScreen from './src/screens/FamilyDashboardScreen';
import SubscriptionScreen from './src/screens/SubscriptionScreen';
import HealthRecordsScreen from './src/screens/HealthRecordsScreen';
import TreatmentReportForm from './src/screens/TreatmentReportForm';
import MedicationScreen from './src/screens/MedicationScreen';
import AIChatScreen from './src/screens/AIChatScreen';
import DeviceSyncScreen from './src/screens/DeviceSyncScreen';
import VideoConsultScreen from './src/screens/VideoConsultScreen';
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

    // Prevent Render Free Tier from sleeping while the app is open
    const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
    if (BASE_URL.includes('onrender.com')) {
      const pingInterval = setInterval(() => {
        fetch(`${BASE_URL}/health`).catch(() => {});
      }, 10 * 60 * 1000); // Every 10 mins
      return () => clearInterval(pingInterval);
    }
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
        <Stack.Screen name="Patient" component={MainTabNavigator} />
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
        <Stack.Screen name="Offers" component={OffersScreen} />
        <Stack.Screen name="Referral" component={ReferralScreen} />
        <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} />
        <Stack.Screen name="FamilyDashboard" component={FamilyDashboardScreen} />
        <Stack.Screen name="Subscription" component={SubscriptionScreen} />
        <Stack.Screen name="HealthRecords" component={HealthRecordsScreen} />
        <Stack.Screen name="TreatmentReportForm" component={TreatmentReportForm} />
        <Stack.Screen name="Medication" component={MedicationScreen} />
        <Stack.Screen name="AIChat" component={AIChatScreen} />
        <Stack.Screen name="DeviceSync" component={DeviceSyncScreen} />
        <Stack.Screen name="VideoConsult" component={VideoConsultScreen} />
      </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
