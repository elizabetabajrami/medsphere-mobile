export type Patient = {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
};

export type PatientDoctor = {
  id: string;
  name: string;
  specialty: string;
  rating: string;
  reviews: string;
};

export type PatientProfile = {
  name: string;
  email: string;
  phone: string;
  location: string;
};
