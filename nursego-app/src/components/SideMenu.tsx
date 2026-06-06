import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions, Animated, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FeatureUnavailableModal from './FeatureUnavailableModal';

const { width, height } = Dimensions.get('window');

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
  navigation: any;
}

export default function SideMenu({ visible, onClose, navigation }: SideMenuProps) {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = React.useState(false);
  
  const MENU_ITEMS = [
    { id: 'home', title: 'Home', icon: 'home-outline' },
    { id: 'offers', title: 'Offers & Promos', icon: 'pricetag-outline' },
    { id: 'support', title: 'Help & Support', icon: 'help-circle-outline' },
    { id: 'refer', title: 'Refer a Friend', icon: 'gift-outline' },
    { id: 'emergency', title: 'Emergency Contacts', icon: 'warning-outline' },
  ];

  const handlePress = (id: string) => {
    onClose();
    if (id === 'home') {
      // Already on home mostly
    } else if (id === 'support') {
      import('react-native').then(({ Linking }) => {
        Linking.openURL('https://nursenow.in');
      });
    } else {
      setModalVisible(true);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        
        <View style={[styles.menuContainer, { paddingTop: insets.top }]}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>NurseGo</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.menuItems}>
            {MENU_ITEMS.map(item => (
              <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => handlePress(item.id)}>
                <Ionicons name={item.icon as any} size={24} color="#0f766e" style={styles.menuIcon} />
                <Text style={styles.menuText}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </View>
      </View>
      <FeatureUnavailableModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        title="Coming Soon"
        message="This feature will be available shortly."
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContainer: {
    width: width * 0.75,
    maxWidth: 320,
    backgroundColor: '#ffffff',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f766e',
  },
  closeBtn: {
    padding: 4,
  },
  menuItems: {
    flex: 1,
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    alignItems: 'center',
  },
  versionText: {
    color: '#94a3b8',
    fontSize: 12,
  },
});
