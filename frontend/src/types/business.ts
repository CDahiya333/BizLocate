export interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

export interface OperatingHours {
  monday?: { open: string; close: string };
  tuesday?: { open: string; close: string };
  wednesday?: { open: string; close: string };
  thursday?: { open: string; close: string };
  friday?: { open: string; close: string };
  saturday?: { open: string; close: string };
  sunday?: { open: string; close: string };
}

export interface Business {
  _id: string;
  profileImage: string;
  businessName: string;
  description: string;
  verified: boolean;
  contactNumber: string;
  email: string;
  location: Location;
  category: string;
  website?: string;
  socialMedia?: SocialMedia;
  operatingHours?: OperatingHours;
  createdAt: string;
  updatedAt: string;
} 