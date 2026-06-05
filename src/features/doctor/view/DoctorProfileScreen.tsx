import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDoctorProfileViewModel } from '../viewmodel/useDoctorProfileViewModel';

type DoctorProfileScreenProps = {
  onLogout: () => void;
};

export const DoctorProfileScreen = ({ onLogout }: DoctorProfileScreenProps) => {
  const viewModel = useDoctorProfileViewModel();
  const { loadProfile, profile } = viewModel;

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile]),
  );

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
        <Text style={styles.subtitle}>Manage your doctor account</Text>

        <View style={styles.card}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Ionicons name="medkit-outline" size={42} color="#6B941F" />
            </View>
          </View>

          <Text style={styles.name}>Dr. {profile.name}</Text>
          <Text style={styles.email}>{profile.email}</Text>

          {viewModel.isLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#6B941F" />
              <Text style={styles.loadingText}>Loading profile</Text>
            </View>
          ) : null}

          {viewModel.error ? <Text style={styles.errorText}>{viewModel.error}</Text> : null}

          <View style={styles.infoList}>
            <InfoRow icon="mail-outline" label="Email" value={profile.email || 'Not provided'} />
            <InfoRow icon="call-outline" label="Phone" value={profile.phone} />
            <InfoRow icon="business-outline" label="Department" value={profile.department} />
            <InfoRow icon="ribbon-outline" label="Specialization" value={profile.specialization} />
          </View>
        </View>

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
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
  },
  loadingText: {
    color: '#66715E',
    fontSize: 13,
    fontWeight: '700',
  },
  errorText: {
    color: '#B42318',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 14,
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
  logoutButton: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE6D2',
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 18,
  },
  logoutButtonText: {
    color: '#6B941F',
    fontSize: 16,
    fontWeight: '800',
  },
});
