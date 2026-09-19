export type ProjectCategory = 
  | 'Restaurant'
  | 'Clinic'
  | 'Salon'
  | 'Hotel'
  | 'Education'
  | 'Portfolio'
  | 'E-commerce'
  | 'Business'
  | 'Real Estate'
  | 'Appointment Booking'
  | 'Other';

export interface ProjectScreenshot {
  id: string;
  url: string;
  caption?: string;
  type: 'desktop' | 'mobile' | 'gallery';
  order: number;
}

export interface DemoProject {
  id: string;
  name: string;
  category: ProjectCategory | string;
  description: string;
  demoUrl: string;
  featured: boolean;
  published: boolean;
  features: string[];
  techStack?: string[];
  desktopScreenshot?: string;
  mobileScreenshot?: string;
  screenshots: ProjectScreenshot[];
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  iconName: string;
  features: string[];
  startingPrice?: string;
  published: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  businessName: string;
  review: string;
  rating: number;
  photoUrl?: string;
  published: boolean;
  createdAt?: string;
}

export type InquiryStatus = 'New' | 'Contacted' | 'In Discussion' | 'Converted' | 'Closed' | 'new' | 'contacted' | 'in_discussion' | 'converted' | 'closed';

export interface InquiryItem {
  id: string;
  name: string;
  businessName: string;
  mobile: string;
  email: string;
  category: string;
  interestedProject: string;
  requirements: string;
  date: string;
  createdAt?: string;
  status: InquiryStatus;
  notes?: string;
}

export type Inquiry = InquiryItem;

export interface WebsiteSettings {
  businessName: string;
  whatsappNumber: string;
  email: string;
  phone: string;
  address: string;
  heroHeadline: string;
  heroSubheadline: string;
  businessDescription: string;
  footerText: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  maintenanceMode?: boolean;
  developerNotes?: string;
  updatedAt?: string;
}

export interface AuthSession {
  user?: any;
  email: string;
  role: 'manager' | 'developer' | 'superadmin' | null;
  isAuthenticated: boolean;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  module: string;
  message: string;
  details?: any;
}
