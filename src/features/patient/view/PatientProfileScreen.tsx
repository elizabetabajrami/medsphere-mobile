import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { PatientStackParamList } from '../../../navigation/types';
import { usePatientProfileViewModel } from '../viewmodel/usePatientProfileViewModel';

type PatientProfileScreenProps = {
  onLogout: () => void;
};

export const PatientProfileScreen = ({ onLogout }: PatientProfileScreenProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<PatientStackParamList>>();
  const viewModel = usePatientProfileViewModel();
  const { profile } = viewModel;

  const handleLogout = async () => {
    const didLogout = await viewModel.logout();

    if (didLogout) {
      onLogout();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Manage your account</Text>

        <View style={styles.card}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Ionicons name="person-outline" size={42} color="#6B941F" />
            </View>
            <View style={styles.editIcon}>
              <Ionicons name="pencil" size={14} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.email}>{profile.email}</Text>

          <View style={styles.infoList}>
            <InfoRow icon="mail-outline" label="Email" value={profile.email} />
            <InfoRow icon="call-outline" label="Phone" value={profile.phone} />
            <InfoRow icon="location-outline" label="Location" value={profile.location} />
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('ProfileEdit')}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </Pressable>

        <Pressable accessibilityRole="button" onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

type InfoRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIcon}>
      <Ionicons name={icon} size={20} color="#6B941F" />
    </View>
    <View style={styles.infoText}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAF5',
  },
  screen: {
    flex: 1,
    backgroundColor: '#F8FAF5',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  title: {
    color: '#303A28',
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    color: '#66715E',
    fontSize: 15,
    marginTop: 6,
    marginBottom: 18,
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#23330D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 2,
  },
  avatarWrapper: {
    marginBottom: 14,
  },
  avatar: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F6EC',
    borderRadius: 28,
  },
  editIcon: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B941F',
    borderColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 3,
  },
  name: {
    color: '#1F271A',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  email: {
    color: '#66715E',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  infoList: {
    alignSelf: 'stretch',
    marginTop: 22,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCFDF9',
    borderColor: '#E8EEDF',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  infoIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F6EC',
    borderRadius: 14,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    color: '#66715E',
    fontSize: 12,
    fontWeight: '700',
  },
  infoValue: {
    color: '#1F271A',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4,
  },
  editButton: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B941F',
    borderRadius: 16,
    marginTop: 18,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  logoutButton: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE6D2',
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 12,
  },
  logoutButtonText: {
    color: '#6B941F',
    fontSize: 16,
    fontWeight: '800',
  },
});
