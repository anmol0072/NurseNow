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
  const autocompleteServiceRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const patientMarkerRef = useRef<any>(null);
  
  // UI States
  const [isBooked, setIsBooked] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  
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
        if (!window.google) return;
        const mapElement = mapRef.current as unknown as HTMLElement;
        if (!mapElement) return;

        // @ts-ignore
        const map = new window.google.maps.Map(mapElement, {
          center: { lat: 28.6139, lng: 77.2090 }, // New Delhi coordinates
          zoom: 14,
          disableDefaultUI: true,
          styles: [
            { "elementType": "geometry", "stylers": [{"color": "#f5f5f5"}] },
            { "elementType": "labels.icon", "stylers": [{"visibility": "off"}] },
            { "elementType": "labels.text.fill", "stylers": [{"color": "#616161"}] },
            { "elementType": "labels.text.stroke", "stylers": [{"color": "#f5f5f5"}] },
            { "featureType": "water", "elementType": "geometry", "stylers": [{"color": "#c9c9c9"}] }
          ]
        });
        
        mapInstanceRef.current = map;
        // @ts-ignore
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        // @ts-ignore
        geocoderRef.current = new window.google.maps.Geocoder();

        // Add Patient Marker
        // @ts-ignore
        patientMarkerRef.current = new window.google.maps.Marker({
          position: { lat: 28.6139, lng: 77.2090 },
          map,
          draggable: true,
          icon: { url: 'https://cdn-icons-png.flaticon.com/512/25/25694.png', scaledSize: new window.google.maps.Size(30, 30) }
        });

        // @ts-ignore
        window.google.maps.event.addListener(patientMarkerRef.current, 'dragend', function() {
          const position = patientMarkerRef.current.getPosition();
          map.panTo(position);
          
          if (geocoderRef.current) {
            geocoderRef.current.geocode({ location: position }, (results: any, status: any) => {
              // @ts-ignore
              if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
                const addr = results[0].formatted_address;
                setAddressQuery(addr);
                fetchHospitals(position.lat(), position.lng());
              }
            });
          }
        });

        // Dummy Nurses
        const nurses = [
          { lat: 28.6150, lng: 77.2100 },
          { lat: 28.6110, lng: 77.2050 },
          { lat: 28.6170, lng: 77.2150 }
        ];

        nurses.forEach(coord => {
          // @ts-ignore
          new window.google.maps.Marker({
            position: coord,
            map,
            icon: {
              url: 'https://cdn-icons-png.flaticon.com/512/3063/3063205.png',
              // @ts-ignore
              scaledSize: new window.google.maps.Size(40, 40)
            }
          });
        });
      };

      // Ensure initMap runs after component mounts
      const checkAndInitMap = () => {
        if (mapRef.current) {
          initMap();
        } else {
          setTimeout(checkAndInitMap, 100);
        }
      };

      // @ts-ignore
      if (!window.google || !window.google.maps.places) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAEJ6oMNsGwveIlwNLlCVbw4DzcNGNzBl4&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = checkAndInitMap;
        document.body.appendChild(script);
      } else {
        checkAndInitMap();
      }
    }
  }, []);

  const handleSearch = (text: string) => {
    setAddressQuery(text);
    if (!text || !autocompleteServiceRef.current) {
      setPredictions([]);
      return;
    }
    autocompleteServiceRef.current.getPlacePredictions(
      { input: text, componentRestrictions: { country: 'in' } },
      (results: any, status: any) => {
        // @ts-ignore
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          setPredictions(results);
        } else {
          setPredictions([]);
        }
      }
    );
  };

  const selectPlace = (placeId: string, description: string) => {
    setAddressQuery(description);
    setPredictions([]);
    if (!geocoderRef.current || !mapInstanceRef.current) return;

    geocoderRef.current.geocode({ placeId }, (results: any, status: any) => {
      // @ts-ignore
      if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
        const location = results[0].geometry.location;
        mapInstanceRef.current.panTo(location);
        mapInstanceRef.current.setZoom(14);
        if (patientMarkerRef.current) {
          patientMarkerRef.current.setPosition(location);
        }

        fetchHospitals(location.lat(), location.lng());
      }
    });
  };

  const fetchHospitals = (lat: number, lng: number) => {
    // @ts-ignore
    const service = new window.google.maps.places.PlacesService(mapInstanceRef.current);
    service.nearbySearch(
      {
        location: { lat, lng },
        radius: 5000,
        type: ['hospital']
      },
      (places: any, placesStatus: any) => {
        // @ts-ignore
        if (placesStatus === window.google.maps.places.PlacesServiceStatus.OK && places) {
          
          const hospitalSvg = encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="#ef4444" stroke="#ffffff" stroke-width="5"/>
              <rect x="40" y="25" width="20" height="50" fill="#ffffff" rx="2"/>
              <rect x="25" y="40" width="50" height="20" fill="#ffffff" rx="2"/>
            </svg>
          `);

          places.forEach((place: any) => {
            // @ts-ignore
            new window.google.maps.Marker({
              position: place.geometry.location,
              map: mapInstanceRef.current,
              title: place.name,
              icon: {
                url: `data:image/svg+xml;charset=utf-8,${hospitalSvg}`,
                // @ts-ignore
                scaledSize: new window.google.maps.Size(35, 35)
              }
            });
          });
        }
      }
    );
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
              {predictions.map((p, idx) => (
                <TouchableOpacity key={idx} style={styles.predictionItem} onPress={() => selectPlace(p.place_id, p.description)}>
                  <Ionicons name="location-outline" size={20} color="#64748b" style={{marginRight: 8}}/>
                  <Text style={styles.predictionText} numberOfLines={1}>{p.description}</Text>
                </TouchableOpacity>
              ))}
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

      {/* Map Controls */}
      <View style={[styles.mapControls, { top: Math.max(insets.top, 80) }]}>
        <TouchableOpacity style={styles.controlButton} onPress={() => setIsMapExpanded(!isMapExpanded)}>
          <Ionicons name={isMapExpanded ? "contract" : "expand"} size={24} color="#0f172a" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={() => setIsBooked(!isBooked)}>
          <Ionicons name="medical" size={24} color={isBooked ? "#0f766e" : "#64748b"} />
        </TouchableOpacity>
      </View>

      {/* Emergency SOS Button */}
      <TouchableOpacity 
        style={[styles.sosButton, { top: Math.max(insets.top, 80) + 120 }]} 
        onPress={() => {
          if (Platform.OS === 'web') {
            window.alert('🚨 EMERGENCY SOS\\nCalling nearest ambulance to your location...');
          } else {
            Alert.alert('🚨 EMERGENCY SOS', 'Calling nearest ambulance to your location...', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Call Ambulance', style: 'destructive' }
            ]);
          }
        }}
      >
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>

      {/* Live Tracking Card (Food Delivery Style) */}
      {isBooked && (
        <View style={[styles.trackingCard, { bottom: isMapExpanded ? 40 : 380 }]}>
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
      )}

      {/* Bottom Sheet */}
      {!isMapExpanded && (
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

        <View style={styles.actionButtonsRow}>
          <TouchableOpacity 
            style={[styles.scheduleButton, !selectedService && styles.bookButtonDisabled]} 
            onPress={() => {
              if (Platform.OS === 'web') window.alert('Schedule Date/Time functionality coming soon');
              else Alert.alert('Schedule Date', 'Select a date and time for the nurse to arrive.');
            }}
          >
            <Ionicons name="calendar-outline" size={24} color="#0f766e" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.bookButton, !selectedService && styles.bookButtonDisabled, { flex: 1 }]} 
            onPress={handleBookNow}
          >
            <Text style={styles.bookButtonText}>Find Nearby Nurse</Text>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" style={{marginLeft: 8}} />
          </TouchableOpacity>
        </View>
      </View>
      )}

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
  mapControls: {
    position: 'absolute',
    right: 20,
    flexDirection: 'column',
    gap: 12,
    zIndex: 9,
  },
  controlButton: {
    width: 48,
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  sosButton: {
    position: 'absolute',
    right: 20,
    width: 48,
    height: 48,
    backgroundColor: '#ef4444',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 9,
  },
  sosText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
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
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  scheduleButton: {
    width: 60,
    height: 56,
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
