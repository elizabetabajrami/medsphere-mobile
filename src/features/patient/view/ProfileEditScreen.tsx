import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { PatientStackParamList } from '../../../navigation/types';
import { AppHeader } from '../../../shared/components/AppHeader';
import { usePatientProfileViewModel } from '../viewmodel/usePatientProfileViewModel';

type ProfileEditScreenProps = NativeStackScreenProps<PatientStackParamList, 'ProfileEdit'>;

export const ProfileEditScreen = ({ navigation }: ProfileEditScreenProps) => {
  const { profile } = usePatientProfileViewModel();

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <AppHeader
        title="Edit Profile"
        showBack
        onBackPress={() => navigation.navigate('PatientTabs', { screen: 'PatientProfile' })}
      />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Field icon="person-outline" label="Name" value={profile.name} />
          <Field icon="mail-outline" label="Email" value={profile.email} />
          <Field icon="call-outline" label="Phone" value={profile.phone} />
          <Field icon="location-outline" label="Location" value={profile.location} />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('PatientTabs', { screen: 'PatientProfile' })}
          style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

type FieldProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

const Field = ({ icon, label, value }: FieldProps) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputContainer}>
      <Ionicons name={icon} size={20} color="#8A9581" style={styles.inputIcon} />
      <TextInput
        defaultValue={value}
        placeholderTextColor="#A7B09E"
        style={styles.input}
      />
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
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EEDF',
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    shadowColor: '#23330D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 2,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    color: '#303A28',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputContainer: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCFDF9',
    borderColor: '#DDE6D2',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#1F271A',
    fontSize: 16,
    paddingVertical: 12,
  },
  saveButton: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B941F',
    borderRadius: 16,
    marginTop: 18,
  },
  saveButtonPressed: {
    opacity: 0.88,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
