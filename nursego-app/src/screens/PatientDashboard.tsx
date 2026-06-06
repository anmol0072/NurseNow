import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, TextInput, Platform, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const CATEGORIES = ['All', 'Injection', 'Procedure', 'Diagnostic', 'Care'];

const SERVICES = [
  { id: 1, name: 'IM Injection', desc: 'Intramuscular injection by certified nurse', category: 'Injection', time: '30 min', price: 400, icon: 'pulse-outline', color: '#3b82f6', bg: '#eff6ff', rx: false },
  { id: 2, name: 'IV Injection', desc: 'Intravenous injection and fluid setup', category: 'Injection', time: '45 min', price: 699, icon: 'water-outline', color: '#2563eb', bg: '#eff6ff', rx: true },
  { id: 3, name: 'Catheterisation', desc: 'Urinary catheter insertion by specialist', category: 'Procedure', time: '60 min', price: 1000, icon: 'thermometer-outline', color: '#9333ea', bg: '#faf5ff', rx: true },
  { id: 4, name: 'Blood Test', desc: 'Sample collection and lab dispatch', category: 'Diagnostic', time: '20 min', price: 299, icon: 'clipboard-outline', color: '#059669', bg: '#ecfdf5', rx: false },
  { id: 5, name: 'Wound Dressing', desc: 'Professional wound cleaning and dressing', category: 'Care', time: '40 min', price: 450, icon: 'medkit-outline', color: '#ea580c', bg: '#fff7ed', rx: false },
  { id: 6, name: 'Physiotherapy', desc: 'Post-op or general mobility sessions', category: 'Care', time: '60 min', price: 1200, icon: 'body-outline', color: '#4f46e5', bg: '#eef2ff', rx: false },
  { id: 7, name: 'ECG at Home', desc: '12-lead ECG with cardiologist review', category: 'Diagnostic', time: '30 min', price: 800, icon: 'heart-outline', color: '#e11d48', bg: '#fff1f2', rx: true },
  { id: 8, name: 'Nebulization', desc: 'Respiratory therapy for asthma/COPD', category: 'Procedure', time: '20 min', price: 350, icon: 'cloud-outline', color: '#0891b2', bg: '#ecfeff', rx: true },
];

export default function PatientDashboard({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [destination, setDestination] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const u = await AsyncStorage.getItem('user');
      if (u) setUser(JSON.parse(u));
    };
    loadUser();
  }, []);

  const filteredServices = SERVICES.filter(s => {
    const matchesCat = activeCategory === 'All' || s.category === activeCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <View style={styles.container}>
      {/* Top Blue Header */}
      <View style={[styles.headerBackground, { paddingTop: Math.max(insets.top, 20) }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greetingText}>Good afternoon,</Text>
            <Text style={styles.nameText}>{user?.name ? user.name.charAt(0).toUpperCase() : 'S'} 👋</Text>
          </View>
          <View style={styles.uhidBadge}>
            <Ionicons name="shield-checkmark-outline" size={14} color="#f8fafc" />
            <Text style={styles.uhidText}>UHID-2026-9743</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statColumn}>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statColumn}>
            <Text style={styles.statValue}>4.8<Text style={{fontSize:16}}>⭐</Text></Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statColumn}>
            <Text style={styles.statValue}>24/7</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Location & Map Section */}
        <View style={styles.locationCard}>
          <View style={styles.mapContainer}>
            {Platform.OS === 'web' ? (
              <iframe 
                src="https://www.openstreetmap.org/export/embed.html?bbox=77.10%2C28.50%2C77.30%2C28.70&layer=mapnik"
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            ) : (
              <Image 
                source={{ uri: 'https://cdn.pixabay.com/photo/2019/09/22/16/20/location-4496459_1280.png' }} 
                style={{ width: '100%', height: '100%' }} 
                resizeMode="cover"
              />
            )}
          </View>
          <View style={styles.destinationInputContainer}>
            <Ionicons name="location" size={20} color="#e11d48" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search destination..."
              placeholderTextColor="#94a3b8"
              value={destination}
              onChangeText={setDestination}
            />
            <TouchableOpacity style={styles.setLocationBtn} onPress={() => {}}>
              <Text style={styles.setLocationBtnText}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search & Filter Services */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search services..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={24} color="#0f172a" />
          </TouchableOpacity>
        </View>

        {/* Category Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <TouchableOpacity 
                key={cat} 
                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Section Title */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Available Services</Text>
          <Text style={styles.sectionSubtitle}>{filteredServices.length} services</Text>
        </View>

        {/* Services List */}
        <View style={styles.servicesList}>
          {filteredServices.map(service => (
            <TouchableOpacity 
              key={service.id} 
              style={styles.serviceCard}
              onPress={() => navigation.navigate('FindingNurse', { serviceName: service.name, basePrice: service.price, distance: 2.5 })}
            >
              <View style={[styles.serviceIconContainer, { backgroundColor: service.bg }]}>
                <Ionicons name={service.icon as any} size={28} color={service.color} />
              </View>
              
              <View style={styles.serviceDetails}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDesc} numberOfLines={1}>{service.desc}</Text>
                <View style={styles.badgesRow}>
                  <View style={[styles.categoryBadge, { backgroundColor: service.bg }]}>
                    <Text style={[styles.categoryBadgeText, { color: service.color }]}>{service.category}</Text>
                  </View>
                  <View style={styles.timeBadge}>
                    <Ionicons name="time-outline" size={12} color="#64748b" />
                    <Text style={styles.timeBadgeText}>{service.time}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.servicePriceColumn}>
                <Text style={styles.servicePrice}>₹{service.price}</Text>
                {service.rx && (
                  <View style={styles.rxBadge}>
                    <Text style={styles.rxText}>Rx</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={16} color="#cbd5e1" style={{ marginTop: 4 }} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerBackground: {
    backgroundColor: '#1d4ed8',
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  greetingText: {
    color: '#bfdbfe',
    fontSize: 16,
    fontWeight: '500',
  },
  nameText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
  },
  uhidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  uhidText: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    color: '#bfdbfe',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  scrollContainer: {
    flex: 1,
    marginTop: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  locationCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  mapContainer: {
    height: 140,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
    marginBottom: 12,
  },
  destinationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    height: 52,
    borderRadius: 12,
    paddingLeft: 16,
    paddingRight: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  setLocationBtn: {
    backgroundColor: '#1d4ed8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  setLocationBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
    // @ts-ignore
    outlineStyle: 'none'
  },
  filterButton: {
    width: 52,
    height: 52,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoriesScroll: {
    marginBottom: 24,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 12,
  },
  categoryChipActive: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  servicesList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  serviceCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  serviceDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  serviceName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  serviceDesc: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeBadgeText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginLeft: 4,
  },
  servicePriceColumn: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
  },
  rxBadge: {
    backgroundColor: '#fff7ed',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  rxText: {
    color: '#ea580c',
    fontSize: 10,
    fontWeight: '800',
  }
});
