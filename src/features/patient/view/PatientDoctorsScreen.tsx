import { Ionicons } from '@expo/vector-icons';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { PatientStackParamList, PatientTabParamList } from '../../../navigation/types';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import { LoadingView } from '../../../shared/components/LoadingView';
import type { PatientDoctor } from '../model/Patient';
import { usePatientDoctorsViewModel } from '../viewmodel/usePatientDoctorsViewModel';

type PatientDoctorsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<PatientTabParamList, 'PatientDoctors'>,
  NativeStackScreenProps<PatientStackParamList>
>;

export const PatientDoctorsScreen = ({ navigation }: PatientDoctorsScreenProps) => {
  const viewModel = usePatientDoctorsViewModel();

  const handleBook = (doctor: PatientDoctor) => {
    navigation.navigate('DoctorDetails', { doctor });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Doctors</Text>
        <ErrorMessage message={viewModel.error} />
        {viewModel.isLoading && <LoadingView />}
        {!viewModel.isLoading && !viewModel.error && viewModel.doctors.length === 0 && (
          <Text style={styles.emptyText}>No doctors found.</Text>
        )}
        {!viewModel.isLoading && viewModel.doctors.map((doctor) => (
          <View key={doctor.id} style={styles.card}>
            <View style={styles.avatar}>
              <Ionicons name="person-outline" size={28} color="#6B941F" />
            </View>

            <View style={styles.doctorInfo}>
              <Text style={styles.name}>{doctor.name}</Text>
              <Text style={styles.specialty}>{doctor.specialty}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={15} color="#F5B942" />
                <Text style={styles.rating}>{doctor.rating}</Text>
                <Text style={styles.reviews}>({doctor.reviews})</Text>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => handleBook(doctor)}
              style={({ pressed }) => [styles.bookButton, pressed && styles.bookButtonPressed]}
            >
              <Text style={styles.bookButtonText}>View</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

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
    marginBottom: 18,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 14,
    padding: 14,
    shadowColor: '#23330D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F6EC',
    borderRadius: 18,
    marginRight: 12,
  },
  doctorInfo: {
    flex: 1,
    paddingRight: 8,
  },
  name: {
    color: '#1F271A',
    fontSize: 16,
    fontWeight: '800',
  },
  specialty: {
    color: '#66715E',
    fontSize: 13,
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  rating: {
    color: '#303A28',
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 4,
  },
  reviews: {
    color: '#66715E',
    fontSize: 12,
    marginLeft: 4,
  },
  emptyText: {
    color: '#66715E',
    fontSize: 14,
  },
  bookButton: {
    backgroundColor: '#6B941F',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  bookButtonPressed: {
    opacity: 0.88,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
