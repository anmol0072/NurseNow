import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Image, Platform, TextInput, FlatList } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SideMenu from '../components/SideMenu';
import ProfileMenu from '../components/ProfileMenu';

const { width, height } = Dimensions.get('window');

const SERVICES = [
  { id: 1, name: 'Injection', icon: 'needle', basePrice: 400 },
  { id: 2, name: 'IV Drip', icon: 'water', basePrice: 699 },
  { id: 3, name: 'Wound Care', icon: 'bandage', basePrice: 850 },
  { id: 4, name: 'Physio', icon: 'human-handsup', basePrice: 1200 },
  { id: 5, name: 'Checkup', icon: 'stethoscope', basePrice: 500 },
];

export default function PatientDashboard({ navigation }: any) {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  
  // Location Selection States
  const [addressQuery, setAddressQuery] = useState('');
  const [predictions, setPredictions] = useState<any[]>([]);
  const mapInstanceRef = useRef<any>(null);
  const patientMarkerRef = useRef<any>(null);
  const hospitalsLayerRef = useRef<any>(null);
  const searchTimeoutRef = useRef<any>(null);
  
  // Menu States
  const [isSideMenuVisible, setSideMenuVisible] = useState(false);
  const [isProfileMenuVisible, setProfileMenuVisible] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const u = await AsyncStorage.getItem('user');
      if (u) setUser(JSON.parse(u));
    };
    loadUser();
  }, []);

  const insets = useSafeAreaInsets();
  const mapRef = useRef<View>(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const initMap = () => {
        // @ts-ignore
        if (!window.L) return;
        const mapElement = mapRef.current as unknown as HTMLElement;
        if (!mapElement) return;

        // Prevent re-initialization error
        // @ts-ignore
        if (mapElement._leaflet_id) return;

        // @ts-ignore
        const map = window.L.map(mapElement, {
          zoomControl: false,
          attributionControl: false
        }).setView([28.6139, 77.2090], 14); // New Delhi

        // @ts-ignore
        window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
        }).addTo(map);
        
        mapInstanceRef.current = map;

        // Add Patient Marker
        // @ts-ignore
        const customIcon = window.L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/25/25694.png',
          iconSize: [30, 30],
          iconAnchor: [15, 30]
        });
        
        // @ts-ignore
        patientMarkerRef.current = window.L.marker([28.6139, 77.2090], { icon: customIcon, draggable: true }).addTo(map);

        patientMarkerRef.current.on('dragend', async (e: any) => {
          const position = e.target.getLatLng();
          mapInstanceRef.current.setView(position);
          
          try {
            const res = await fetch(`https://photon.komoot.io/reverse?lon=${position.lng}&lat=${position.lat}`);
            const data = await res.json();
            let displayName = 'Selected Location';
            if (data.features && data.features.length > 0) {
               const props = data.features[0].properties;
               displayName = [props.name, props.street, props.city].filter(Boolean).join(', ') || displayName;
            }
            selectPlace(position.lat.toString(), position.lng.toString(), displayName);
          } catch(err) { 
            console.log('Reverse geocode error', err);
            selectPlace(position.lat.toString(), position.lng.toString(), 'Selected Location');
          }
        });

        // Dummy Nurses
        const nurses = [
          [28.6150, 77.2100],
          [28.6110, 77.2050],
          [28.6170, 77.2150]
        ];

        // @ts-ignore
        const nurseIcon = window.L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063205.png',
          iconSize: [40, 40],
          iconAnchor: [20, 40]
        });

        nurses.forEach(coord => {
          // @ts-ignore
          window.L.marker(coord, { icon: nurseIcon }).addTo(map);
        });
      };

      // @ts-ignore
      if (!window.L) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = initMap;
        document.head.appendChild(script);
      } else {
        initMap();
      }
    }
  }, []);

  const handleSearch = (text: string) => {
    setAddressQuery(text);
    if (!text || text.length < 3) {
      setPredictions([]);
      return;
    }
    
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(text)}&limit=5`);
        const data = await res.json();
        setPredictions(data.features || []);
      } catch (e) {
        console.log('Search error:', e);
      }
    }, 500);
  };

  const selectPlace = async (lat: string, lon: string, displayName: string) => {
    setAddressQuery(displayName);
    setPredictions([]);
    
    if (!mapInstanceRef.current) return;
    
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);

    mapInstanceRef.current.setView([latNum, lonNum], 14);
    if (patientMarkerRef.current) {
      patientMarkerRef.current.setLatLng([latNum, lonNum]);
    }

    // Fetch Nearby Hospitals via Overpass API
    try {
      const query = `[out:json];node(around:5000,${latNum},${lonNum})[amenity=hospital];out 10;`;
      const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      // Clear old hospitals
      if (hospitalsLayerRef.current) {
        mapInstanceRef.current.removeLayer(hospitalsLayerRef.current);
      }
      
      // @ts-ignore
      hospitalsLayerRef.current = window.L.layerGroup().addTo(mapInstanceRef.current);
      
      // @ts-ignore
      const hospitalIcon = window.L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/4320/4320350.png',
        iconSize: [35, 35],
        iconAnchor: [17, 35]
      });

      data.elements.forEach((hospital: any) => {
        // @ts-ignore
        window.L.marker([hospital.lat, hospital.lon], { icon: hospitalIcon })
          .bindPopup(hospital.tags?.name || 'Hospital')
          .addTo(hospitalsLayerRef.current);
      });
    } catch (e) {
      console.log('Hospital fetch error:', e);
    }
  };

  const handleBookNow = () => {
    if (!selectedService) {
      if (Platform.OS === 'web') {
        window.alert('Please select a service category first');
      } else {
        // @ts-ignore
        Alert.alert('Error', 'Please select a service category first');
      }
      return;
    }
    const service = SERVICES.find(s => s.id === selectedService);
    const dynamicDistance = parseFloat((Math.random() * 8 + 1).toFixed(1)); // Random distance between 1.0 and 9.0 km

    navigation.navigate('FindingNurse', {
      serviceName: service?.name,
      basePrice: service?.basePrice,
      distance: dynamicDistance 
    });
  };

  return (
    <View style={styles.container}>
      {/* Real Google Map */}
      <View ref={mapRef} style={styles.mapBackground} />
      
      {/* Floating Header */}
      <View style={[styles.floatingHeader, { top: Math.max(insets.top, 20) }]}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setSideMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="#0f172a" />
        </TouchableOpacity>
        
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <View style={styles.searchBar}>
            <View style={styles.dot} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search destination..."
              value={addressQuery}
              onChangeText={handleSearch}
              placeholderTextColor="#94a3b8"
            />
          </View>
          
          {predictions.length > 0 && (
            <View style={styles.predictionsContainer}>
              {predictions.map((p, idx) => {
                const displayName = [p.properties.name, p.properties.street, p.properties.city, p.properties.state].filter(Boolean).join(', ');
                return (
                  <TouchableOpacity key={idx} style={styles.predictionItem} onPress={() => selectPlace(p.geometry.coordinates[1].toString(), p.geometry.coordinates[0].toString(), displayName)}>
                    <Ionicons name="location-outline" size={20} color="#64748b" style={{marginRight: 8}}/>
                    <Text style={styles.predictionText} numberOfLines={1}>{displayName}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        <TouchableOpacity 
          onPress={() => setProfileMenuVisible(true)}
          style={styles.profileButton}
        >
          <Text style={styles.profileText}>
            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'JD'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Live Tracking Card (Food Delivery Style) */}
      <View style={[styles.trackingCard, { bottom: 380 }]}>
        <View style={styles.trackingHeader}>
          <View>
            <Text style={styles.trackingTitle}>Nurse Sarah is on the way!</Text>
            <Text style={styles.trackingSubtitle}>Arriving in 12 mins • 3.2 km away</Text>
          </View>
          <View style={styles.pulsingDot}>
            <View style={styles.pulsingCore} />
          </View>
        </View>
        <View style={styles.trackingActions}>
          <TouchableOpacity style={styles.trackingCallBtn}>
            <Ionicons name="call" size={16} color="#fff" />
            <Text style={styles.trackingCallText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.trackingMsgBtn}>
            <Ionicons name="chatbubble" size={16} color="#0f766e" />
            <Text style={styles.trackingMsgText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />
        
        <Text style={styles.sheetTitle}>Where do you need a nurse?</Text>

        {/* AI Banner inside Bottom Sheet */}
        <TouchableOpacity style={styles.aiBanner} onPress={() => navigation.navigate('AIAssistant')}>
          <View style={styles.aiBannerLeft}>
            <Ionicons name="sparkles" size={20} color="#0f766e" />
            <Text style={styles.aiBannerText}>Not sure? Ask our AI Assistant</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#0f766e" />
        </TouchableOpacity>

        <Text style={styles.subTitle}>Select Service Category</Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.serviceScroll}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
        >
          {SERVICES.map((service) => {
            const isSelected = selectedService === service.id;
            return (
              <TouchableOpacity
                key={service.id}
                onPress={() => setSelectedService(service.id)}
                style={[styles.serviceBox, isSelected && styles.serviceBoxSelected]}
              >
                <View style={[styles.iconWrapper, isSelected && styles.iconWrapperSelected]}>
                  <MaterialCommunityIcons 
                    name={service.icon as any} 
                    size={32} 
                    color={isSelected ? '#ffffff' : '#0f766e'} 
                  />
                </View>
                <Text style={[styles.serviceBoxName, isSelected && styles.serviceBoxNameSelected]}>
                  {service.name}
                </Text>
                <Text style={styles.serviceBoxPrice}>₹{service.basePrice}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity 
          style={[styles.bookButton, !selectedService && styles.bookButtonDisabled]} 
          onPress={handleBookNow}
        >
          <Text style={styles.bookButtonText}>Find Nearby Nurse</Text>
          <Ionicons name="arrow-forward" size={20} color="#ffffff" style={{marginLeft: 8}} />
        </TouchableOpacity>
      </View>

      <SideMenu 
        visible={isSideMenuVisible} 
        onClose={() => setSideMenuVisible(false)} 
        navigation={navigation} 
      />

      <ProfileMenu 
        visible={isProfileMenuVisible} 
        onClose={() => setProfileMenuVisible(false)} 
        navigation={navigation} 
        user={user} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e2e8f0', // Fallback color
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  floatingHeader: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  menuButton: {
    width: 48,
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  searchBar: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    // @ts-ignore
    outlineStyle: 'none'
  },
  predictionsContainer: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  predictionText: {
    fontSize: 14,
    color: '#334155',
    flex: 1
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0f766e',
    marginRight: 12,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  profileButton: {
    width: 48,
    height: 48,
    backgroundColor: '#0f766e',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  profileText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
  marker: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  nurseMarkerIcon: {
    width: 24,
    height: 24,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
    alignItems: 'center',
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 16,
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
    letterSpacing: -0.5,
  },
  aiBanner: {
    backgroundColor: '#f0fdfa',
    borderWidth: 1,
    borderColor: '#ccfbf1',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 24,
    width: '100%',
    maxWidth: width - 48,
    marginBottom: 24,
  },
  aiBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiBannerText: {
    color: '#0f766e',
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 8,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 16,
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
  },
  serviceScroll: {
    width: '100%',
    marginBottom: 24,
  },
  serviceBox: {
    width: 110,
    height: 130,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  serviceBoxSelected: {
    backgroundColor: '#f0fdfa',
    borderColor: '#0f766e',
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconWrapperSelected: {
    backgroundColor: '#0f766e',
  },
  serviceBoxName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
    marginBottom: 4,
  },
  serviceBoxNameSelected: {
    color: '#0f766e',
  },
  serviceBoxPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
  },
  bookButton: {
    backgroundColor: '#0f172a',
    width: '100%',
    maxWidth: width - 48,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  bookButtonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
    elevation: 0,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  trackingCard: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: '#f0fdfa',
  },
  trackingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trackingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  trackingSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f766e',
  },
  pulsingDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(20, 184, 166, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulsingCore: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#0f766e',
  },
  trackingActions: {
    flexDirection: 'row',
    gap: 12,
  },
  trackingCallBtn: {
    flex: 1,
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  trackingCallText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 8,
  },
  trackingMsgBtn: {
    flex: 1,
    backgroundColor: '#f0fdfa',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccfbf1',
  },
  trackingMsgText: {
    color: '#0f766e',
    fontWeight: '700',
    marginLeft: 8,
  }
});
