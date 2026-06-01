import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Image, Platform, TextInput, FlatList } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

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
          icon: { url: 'https://cdn-icons-png.flaticon.com/512/25/25694.png', scaledSize: new window.google.maps.Size(30, 30) }
        });

        // Add 3 dummy nurse markers around the location
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

      // @ts-ignore
      if (!window.google || !window.google.maps.places) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAEJ6oMNsGwveIlwNLlCVbw4DzcNGNzBl4&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.body.appendChild(script);
      } else {
        initMap();
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
      { input: text },
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
        mapInstanceRef.current.setZoom(15);
        if (patientMarkerRef.current) {
          patientMarkerRef.current.setPosition(location);
        }
      }
    });
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
        <TouchableOpacity style={styles.menuButton}>
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
          onPress={() => navigation.navigate('History')}
          style={styles.profileButton}
        >
          <Text style={styles.profileText}>JD</Text>
        </TouchableOpacity>
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
});
