import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { PatientStackParamList } from '../../../navigation/types';
import { AppHeader } from '../../../shared/components/AppHeader';

type DoctorDetailsScreenProps = NativeStackScreenProps<PatientStackParamList, 'DoctorDetails'>;

export const DoctorDetailsScreen = ({ navigation, route }: DoctorDetailsScreenProps) => {
  const { doctor } = route.params;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <AppHeader
        title="Doctor Details"
        showBack
        onBackPress={() => navigation.navigate('PatientTabs', { screen: 'PatientDoctors' })}
      />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={46} color="#6B941F" />
          </View>
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.specialty}>{doctor.specialty}</Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={18} color="#F5B942" />
            <Text style={styles.rating}>{doctor.rating}</Text>
            <Text style={styles.reviews}>({doctor.reviews} reviews)</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <InfoRow icon="medkit-outline" label="Specialty" value={doctor.specialty} />
          <InfoRow icon="time-outline" label="Availability" value="Choose a date to view open slots" />
          <InfoRow icon="location-outline" label="Location" value="MedSphere Clinic" />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('BookAppointment', { doctor })}
          style={({ pressed }) => [styles.bookButton, pressed && styles.bookButtonPressed]}
        >
          <Text style={styles.bookButtonText}>Book Appointment</Text>
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
    paddingBottom: 32,
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 22,
    borderWidth: 1,
    padding: 22,
    shadowColor: '#23330D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 2,
  },
  avatar: {
    width: 92,
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F6EC',
    borderRadius: 28,
    marginBottom: 16,
  },
  name: {
    color: '#1F271A',
    fontSize: 23,
    fontWeight: '800',
    textAlign: 'center',
  },
  specialty: {
    color: '#66715E',
    fontSize: 15,
    marginTop: 6,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  rating: {
    color: '#303A28',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 6,
  },
  reviews: {
    color: '#66715E',
    fontSize: 13,
    marginLeft: 5,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 16,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
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
    marginTop: 3,
  },
  bookButton: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B941F',
    borderRadius: 16,
    marginTop: 18,
  },
  bookButtonPressed: {
    opacity: 0.88,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
