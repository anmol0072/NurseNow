import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NurseDocumentScreen({ navigation }: any) {
  const [docs, setDocs] = useState({
    aadhar: false,
    incDiploma: false,
    degree: false,
  });

  const handleUpload = (docType: keyof typeof docs) => {
    // Mock file upload
    Alert.alert('Upload Document', `Simulating file picker for ${docType}...`, [
      { 
        text: 'Select File', 
        onPress: () => setDocs(prev => ({ ...prev, [docType]: true })) 
      }
    ]);
  };

  const handleSubmit = () => {
    if (!docs.aadhar || !docs.incDiploma) {
      Alert.alert('Incomplete', 'Aadhar and INC Diploma are mandatory.');
      return;
    }
    Alert.alert('Success', 'Documents submitted for verification!', [
      { text: 'Go to Dashboard', onPress: () => navigation.replace('Nurse') }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerContainer}>
          <Text style={styles.title}>KYC Verification</Text>
          <Text style={styles.subtitle}>Upload documents to start earning.</Text>
        </View>

        <View style={styles.card}>
          
          <View style={styles.docItem}>
            <View style={styles.docInfo}>
              <Text style={styles.docTitle}>Aadhar Card <Text style={styles.mandatory}>*</Text></Text>
              <Text style={styles.docStatus}>{docs.aadhar ? '✅ Uploaded' : 'Pending'}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.uploadBtn, docs.aadhar && styles.uploadedBtn]} 
              onPress={() => handleUpload('aadhar')}
            >
              <Text style={styles.uploadBtnText}>{docs.aadhar ? 'Replace' : 'Upload'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.docItem}>
            <View style={styles.docInfo}>
              <Text style={styles.docTitle}>INC Diploma <Text style={styles.mandatory}>*</Text></Text>
              <Text style={styles.docStatus}>{docs.incDiploma ? '✅ Uploaded' : 'Pending'}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.uploadBtn, docs.incDiploma && styles.uploadedBtn]} 
              onPress={() => handleUpload('incDiploma')}
            >
              <Text style={styles.uploadBtnText}>{docs.incDiploma ? 'Replace' : 'Upload'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.docItem}>
            <View style={styles.docInfo}>
              <Text style={styles.docTitle}>Nursing Degree</Text>
              <Text style={styles.docStatus}>{docs.degree ? '✅ Uploaded' : 'Optional'}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.uploadBtn, docs.degree && styles.uploadedBtn]} 
              onPress={() => handleUpload('degree')}
            >
              <Text style={styles.uploadBtnText}>{docs.degree ? 'Replace' : 'Upload'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
            <Text style={styles.primaryButtonText}>Submit Documents</Text>
          </TouchableOpacity>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 60,
  },
  headerContainer: {
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1e293b',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 8,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  docItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  docInfo: {
    flex: 1,
  },
  docTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  mandatory: {
    color: '#ef4444',
  },
  docStatus: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
    fontWeight: '600',
  },
  uploadBtn: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  uploadedBtn: {
    backgroundColor: '#ccfbf1',
  },
  uploadBtnText: {
    color: '#0f766e',
    fontWeight: '700',
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: '#0f766e',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 32,
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
