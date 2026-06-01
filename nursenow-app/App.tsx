import React from 'react';
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
import RatingScreen from './src/screens/RatingScreen';
import TrackingScreen from './src/screens/TrackingScreen';
import AIAssistantScreen from './src/screens/AIAssistantScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import BookingHistoryScreen from './src/screens/BookingHistoryScreen';
import FindingNurseScreen from './src/screens/FindingNurseScreen';

import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
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
        <Stack.Screen name="Rating" component={RatingScreen} />
        <Stack.Screen name="AIAssistant" component={AIAssistantScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="BookingHistory" component={BookingHistoryScreen} />
      </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
