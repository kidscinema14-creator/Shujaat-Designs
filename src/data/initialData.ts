import { DemoProject, ServiceItem, TestimonialItem, WebsiteSettings } from '../types';

export const initialSettings: WebsiteSettings = {
  businessName: 'Shujaat Designs',
  whatsappNumber: '+919622229622',
  email: 'contact@shujaatdesigns.com',
  phone: '+91 96222 29622',
  address: 'Commercial Hub, Srinagar, J&K / Remote Worldwide',
  heroHeadline: 'Professional Websites for Your Business',
  heroSubheadline: 'Explore our ready-made website demos and get a professional website customized for your business.',
  businessDescription: 'Shujaat Designs creates professional websites and customized digital solutions for businesses. We build fast, high-converting digital storefronts, booking portals, and management dashboards tailored to your brand.',
  footerText: '© ' + new Date().getFullYear() + ' Shujaat Designs. All rights reserved. Handcrafted with precision for growing businesses.',
  socialLinks: {
    facebook: 'https://facebook.com/shujaatdesigns',
    instagram: 'https://instagram.com/shujaatdesigns',
    linkedin: 'https://linkedin.com/company/shujaatdesigns',
    twitter: 'https://twitter.com/shujaatdesigns',
    github: 'https://github.com/shujaatdesigns',
  },
};

export const initialProjects: DemoProject[] = [
  {
    id: 'saffron-bistro',
    name: 'Saffron Bistro & Lounge',
    category: 'Restaurant',
    description: 'A fine dining restaurant website featuring an interactive digital food menu with dietary filters, chef specials, table reservation requests, and direct WhatsApp takeaway ordering.',
    demoUrl: 'https://preview.themeforest.net/item/grand-restaurant-restaurant-cafe-theme/full_screen_preview/11832120',
    featured: true,
    published: true,
    features: [
      'Interactive Digital Food & Beverage Menu',
      'Table Reservation Inquiry System',
      'Chef Signature Specials Showcase',
      'Direct WhatsApp Order & Inquiry Integration',
      'Google Map Location & Dining Hours',
      'Fast Mobile-Optimized Touch Menu'
    ],
    techStack: ['React', 'Tailwind CSS', 'Firebase Firestore', 'WhatsApp API'],
    desktopScreenshot: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    mobileScreenshot: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    screenshots: [
      {
        id: 'sb-1',
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        caption: 'Desktop Homepage & Hero Atmosphere',
        type: 'desktop',
        order: 1
      },
      {
        id: 'sb-2',
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
        caption: 'Mobile Responsive Menu Navigation',
        type: 'mobile',
        order: 2
      },
      {
        id: 'sb-3',
        url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
        caption: 'Chef Signature Dishes & Tasting Menu',
        type: 'gallery',
        order: 3
      },
      {
        id: 'sb-4',
        url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=80',
        caption: 'VIP Private Dining & Reservation Booking View',
        type: 'gallery',
        order: 4
      }
    ],
    displayOrder: 1,
    createdAt: '2026-09-01T10:00:00.000Z',
    updatedAt: '2026-09-18T12:00:00.000Z'
  },
  {
    id: 'apex-dental-clinic',
    name: 'Apex Dental & Healthcare',
    category: 'Clinic',
    description: 'A clean, trustworthy healthcare website designed for dental clinics and medical practitioners with online appointment booking, doctor credentials, and transparent treatment pricing.',
    demoUrl: 'https://preview.themeforest.net/item/medicare-medical-doctor-health-clinic/full_screen_preview/13840742',
    featured: true,
    published: true,
    features: [
      'Patient Appointment Request Form',
      'Doctor Profiles & Professional Credentials',
      'Treatment Guides & Transparent Pricing',
      'Patient Reviews & Testimonial Slider',
      'Emergency WhatsApp Hotline',
      'Clinic Hours & Interactive Google Map'
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Cloud Firestore'],
    desktopScreenshot: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
    mobileScreenshot: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
    screenshots: [
      {
        id: 'ad-1',
        url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
        caption: 'Modern Clinic Homepage & Service Grid',
        type: 'desktop',
        order: 1
      },
      {
        id: 'ad-2',
        url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
        caption: 'Mobile Appointment Booking View',
        type: 'mobile',
        order: 2
      },
      {
        id: 'ad-3',
        url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1000&q=80',
        caption: 'Doctor Consultation & Treatment Rooms',
        type: 'gallery',
        order: 3
      }
    ],
    displayOrder: 2,
    createdAt: '2026-09-02T10:00:00.000Z',
    updatedAt: '2026-09-18T12:00:00.000Z'
  },
  {
    id: 'luxe-blade-salon',
    name: 'Luxe & Blade Studio',
    category: 'Salon',
    description: 'An aesthetic beauty salon, barber & spa website with stylish service catalogs, stylist portfolios, online slot booking, and WhatsApp appointment confirmations.',
    demoUrl: 'https://preview.themeforest.net/item/barbershop-hair-salon-wordpress-theme/full_screen_preview/17696144',
    featured: true,
    published: true,
    features: [
      'Comprehensive Service Menu with Pricing',
      'Stylist & Specialist Portfolios',
      'Direct WhatsApp Slot Booking',
      'Before & After Transformation Gallery',
      'Client Loyalty Program Info',
      'Gift Card & Package Inquiries'
    ],
    techStack: ['React', 'Tailwind CSS', 'Firebase Storage', 'WhatsApp API'],
    desktopScreenshot: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
    mobileScreenshot: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=600&q=80',
    screenshots: [
      {
        id: 'lb-1',
        url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
        caption: 'Luxury Salon Studio Hero & Service Highlights',
        type: 'desktop',
        order: 1
      },
      {
        id: 'lb-2',
        url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=600&q=80',
        caption: 'Mobile Service Selection & Quick Slot Reservation',
        type: 'mobile',
        order: 2
      },
      {
        id: 'lb-3',
        url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80',
        caption: 'Barbershop Specialist Stations',
        type: 'gallery',
        order: 3
      }
    ],
    displayOrder: 3,
    createdAt: '2026-09-03T10:00:00.000Z',
    updatedAt: '2026-09-18T12:00:00.000Z'
  },
  {
    id: 'grand-azure-resort',
    name: 'The Grand Azure Resort',
    category: 'Hotel',
    description: 'A boutique luxury hotel and resort website showcasing suite tours, dining amenities, seasonal retreat packages, and direct booking inquiries without commission fees.',
    demoUrl: 'https://preview.themeforest.net/item/bellevue-hotel-bed-breakfast-booking-calendar-theme/full_screen_preview/9297070',
    featured: true,
    published: true,
    features: [
      'Room & Luxury Suite Showcase with Amenities',
      'Direct Booking Inquiry Calculator',
      'Resort Amenities (Spa, Pool, Restaurant)',
      'Local Tour & Activity Guide',
      'WhatsApp Concierge Assistance',
      'High-Resolution Image Galleries'
    ],
    techStack: ['React', 'Tailwind CSS', 'Firebase Firestore'],
    desktopScreenshot: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    mobileScreenshot: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
    screenshots: [
      {
        id: 'ga-1',
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
        caption: 'Resort Overview & Luxury Architecture',
        type: 'desktop',
        order: 1
      },
      {
        id: 'ga-2',
        url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
        caption: 'Mobile Suite Selection & Rates View',
        type: 'mobile',
        order: 2
      },
      {
        id: 'ga-3',
        url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
        caption: 'Executive Ocean View Penthouse',
        type: 'gallery',
        order: 3
      }
    ],
    displayOrder: 4,
    createdAt: '2026-09-04T10:00:00.000Z',
    updatedAt: '2026-09-18T12:00:00.000Z'
  },
  {
    id: 'zenith-apparel-store',
    name: 'Zenith Apparel & Footwear',
    category: 'E-commerce',
    description: 'A modern, high-speed e-commerce storefront with category filtering, slide-over cart drawer, instant product search, and direct WhatsApp order placement for instant sales.',
    demoUrl: 'https://preview.themeforest.net/item/flatsome-multipurpose-responsive-woocommerce-theme/full_screen_preview/5484319',
    featured: true,
    published: true,
    features: [
      'Product Grid with Filter by Size & Color',
      'Slide-over Cart Drawer with Subtotal',
      'One-Click "Order via WhatsApp" with Item Details',
      'Customer Product Reviews & Star Ratings',
      'Promo Banner & Discount Code Support',
      'Fast Image Lazy Loading'
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase Storage'],
    desktopScreenshot: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    mobileScreenshot: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80',
    screenshots: [
      {
        id: 'za-1',
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
        caption: 'E-commerce Storefront & Featured Collections',
        type: 'desktop',
        order: 1
      },
      {
        id: 'za-2',
        url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80',
        caption: 'Mobile Product Catalog with Quick-Add Cart',
        type: 'mobile',
        order: 2
      }
    ],
    displayOrder: 5,
    createdAt: '2026-09-05T10:00:00.000Z',
    updatedAt: '2026-09-18T12:00:00.000Z'
  },
  {
    id: 'nextstep-academy',
    name: 'NextStep Career Academy',
    category: 'Education',
    description: 'An educational institute and tutoring portal with course curriculums, faculty profiles, fee structures, downloadable syllabus PDF brochures, and admission lead capture.',
    demoUrl: 'https://preview.themeforest.net/item/eduma-education-wordpress-theme/full_screen_preview/14058034',
    featured: false,
    published: true,
    features: [
      'Interactive Course Directory & Syllabus View',
      'Admission Inquiry Form with Batch Selection',
      'Faculty Credentials & Student Testimonials',
      'Downloadable PDF Brochure Request',
      'WhatsApp Student Counselor Hotline'
    ],
    techStack: ['React', 'Tailwind CSS', 'Firestore'],
    desktopScreenshot: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    mobileScreenshot: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
    screenshots: [
      {
        id: 'ns-1',
        url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
        caption: 'Academy Portal Homepage & Course Offerings',
        type: 'desktop',
        order: 1
      },
      {
        id: 'ns-2',
        url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
        caption: 'Mobile Course Detail & Admission Form',
        type: 'mobile',
        order: 2
      }
    ],
    displayOrder: 6,
    createdAt: '2026-09-06T10:00:00.000Z',
    updatedAt: '2026-09-18T12:00:00.000Z'
  },
  {
    id: 'skyline-properties',
    name: 'Skyline Prime Real Estate',
    category: 'Real Estate',
    description: 'A modern real estate agency portal with property search filters (price, bedrooms, location), high-res photo galleries, floor plans, and WhatsApp site visit booking.',
    demoUrl: 'https://preview.themeforest.net/item/houzez-real-estate-wordpress-theme/full_screen_preview/15605424',
    featured: false,
    published: true,
    features: [
      'Filterable Property Listings (Rent / Sale)',
      'Floor Plan Viewer & Virtual Tour Link',
      'WhatsApp Schedule Site Visit Button',
      'Mortgage & EMI Calculation Estimator',
      'Agent Direct Contact Profile'
    ],
    techStack: ['React', 'Tailwind CSS', 'Firestore'],
    desktopScreenshot: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    mobileScreenshot: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
    screenshots: [
      {
        id: 'sp-1',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        caption: 'Luxury Property Listings & Interactive Filter',
        type: 'desktop',
        order: 1
      },
      {
        id: 'sp-2',
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
        caption: 'Mobile Property Details & Visit Booking',
        type: 'mobile',
        order: 2
      }
    ],
    displayOrder: 7,
    createdAt: '2026-09-07T10:00:00.000Z',
    updatedAt: '2026-09-18T12:00:00.000Z'
  },
  {
    id: 'novus-advisory',
    name: 'Novus Corporate Advisory',
    category: 'Business',
    description: 'A polished B2B corporate agency website built for business consultants, financial advisers, and tech firms seeking enterprise credibility and inbound inquiries.',
    demoUrl: 'https://preview.themeforest.net/item/consulting-business-finance-wordpress-theme/full_screen_preview/14740568',
    featured: false,
    published: true,
    features: [
      'Strategic Service Breakdown & Solutions',
      'Client Case Studies with Measurable Results',
      'Consultation Booking & WhatsApp Quick Contact',
      'Executive Leadership Bio Cards',
      'Whitepaper & Resource Download Center'
    ],
    techStack: ['React', 'Tailwind CSS', 'Firebase'],
    desktopScreenshot: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    mobileScreenshot: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    screenshots: [
      {
        id: 'na-1',
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        caption: 'Corporate B2B Homepage & Enterprise Layout',
        type: 'desktop',
        order: 1
      },
      {
        id: 'na-2',
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
        caption: 'Mobile Service Breakdown & Consultation Booking',
        type: 'mobile',
        order: 2
      }
    ],
    displayOrder: 8,
    createdAt: '2026-09-08T10:00:00.000Z',
    updatedAt: '2026-09-18T12:00:00.000Z'
  }
];

export const initialServices: ServiceItem[] = [
  {
    id: 'srv-business',
    name: 'Business Website',
    description: 'Modern, high-conversion websites for corporate, consulting, and service enterprises tailored to establish trust and generate qualified leads.',
    iconName: 'Building2',
    features: ['Custom Visual Identity', 'Lead Capture Forms', 'Mobile Responsive Layout', 'SEO Structure Ready', 'WhatsApp Integration'],
    startingPrice: 'Custom Quote',
    published: true,
    displayOrder: 1
  },
  {
    id: 'srv-restaurant',
    name: 'Restaurant & Cafe Website',
    description: 'Appetizing online presence with interactive digital menu, table reservation inquiry, chef specials showcase, and instant WhatsApp takeaway ordering.',
    iconName: 'Utensils',
    features: ['Interactive Food Menu', 'Dietary Tagging (Veg/Vegan/Halal)', 'Table Booking Engine', 'WhatsApp Instant Takeaway', 'Google Maps & Hours'],
    startingPrice: 'Custom Quote',
    published: true,
    displayOrder: 2
  },
  {
    id: 'srv-clinic',
    name: 'Clinic & Healthcare Website',
    description: 'Clean, HIPAA/privacy-conscious healthcare websites with patient appointment scheduling, doctor credentials, and treatment information.',
    iconName: 'Stethoscope',
    features: ['Appointment Request System', 'Doctor Bio & Specializations', 'Treatments & Pricing Breakdown', 'Patient Reviews', 'Emergency WhatsApp Hotline'],
    startingPrice: 'Custom Quote',
    published: true,
    displayOrder: 3
  },
  {
    id: 'srv-salon',
    name: 'Salon & Spa Website',
    description: 'Visually captivating salon, beauty studio, and spa portals with service pricing tables, stylist portfolios, and online slot reservation.',
    iconName: 'Scissors',
    features: ['Service Menu with Rates', 'Stylist Portfolios', 'Slot Booking & Reminders', 'Before & After Gallery', 'WhatsApp Confirmation'],
    startingPrice: 'Custom Quote',
    published: true,
    displayOrder: 4
  },
  {
    id: 'srv-booking',
    name: 'Appointment Booking Website',
    description: 'Automated booking solutions for lawyers, consultants, tutors, and studios with calendar sync and instant customer notifications.',
    iconName: 'CalendarCheck',
    features: ['Automated Slot Selection', 'Custom Intake Questionnaires', 'WhatsApp & Email Confirmations', 'Google Calendar Sync', 'Cancellation Handling'],
    startingPrice: 'Custom Quote',
    published: true,
    displayOrder: 5
  },
  {
    id: 'srv-ecommerce',
    name: 'E-Commerce & Online Store',
    description: 'Fast, secure online stores with product catalog filters, slide-over cart drawer, and hybrid WhatsApp or online payment gateway checkout.',
    iconName: 'ShoppingBag',
    features: ['Dynamic Product Catalog', 'Variants (Sizes, Colors)', 'Slide-over Cart Drawer', 'WhatsApp Checkout Assist', 'Payment Gateway Integration'],
    startingPrice: 'Custom Quote',
    published: true,
    displayOrder: 6
  },
  {
    id: 'srv-dashboard',
    name: 'Custom Management Dashboard',
    description: 'Bespoke Manager Desk and administrative control portals to easily manage products, bookings, menus, and client inquiries without code.',
    iconName: 'LayoutDashboard',
    features: ['Secure Manager Login', 'Real-time Firestore Database', 'Image Upload & Media Manager', 'Client Inquiry Inbox', 'Export & Analytics'],
    startingPrice: 'Custom Quote',
    published: true,
    displayOrder: 7
  },
  {
    id: 'srv-firebase',
    name: 'Firebase Backend Integration',
    description: 'Cloud-powered Firestore database, secure authentication, file storage, and real-time live synchronization for dynamic web applications.',
    iconName: 'Flame',
    features: ['Cloud Firestore Database', 'Firebase Storage Setup', 'Role-Based Security Rules', 'Real-time Live Data Sync', 'Scalable Cloud Hosting'],
    startingPrice: 'Custom Quote',
    published: true,
    displayOrder: 8
  }
];

export const initialTestimonials: TestimonialItem[] = [
  {
    id: 't-1',
    name: 'Zubair Ahmad',
    businessName: 'Saffron Heritage Dining',
    review: 'Shujaat Designs delivered our restaurant website in record time. Our customers constantly compliment the digital menu, and we receive table bookings and takeaway orders directly on WhatsApp daily.',
    rating: 5,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    published: true,
    createdAt: '2026-08-20T10:00:00.000Z'
  },
  {
    id: 't-2',
    name: 'Dr. Tariq Mir',
    businessName: 'Mir Dental Care',
    review: 'The clinic website has completely modernized our patient intake. Patients can easily check our doctors, view treatment procedures, and request appointments online. Highly recommended!',
    rating: 5,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    published: true,
    createdAt: '2026-08-25T10:00:00.000Z'
  },
  {
    id: 't-3',
    name: 'Amina Sheikh',
    businessName: 'Velvet Glow Beauty Lounge',
    review: 'Our salon bookings increased significantly after launching with Shujaat Designs. The manager desk makes it so simple to change prices or add new packages without needing to hire a developer every time.',
    rating: 5,
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    published: true,
    createdAt: '2026-09-02T10:00:00.000Z'
  }
];

export const DEFAULT_SETTINGS = initialSettings;
export const INITIAL_PROJECTS = initialProjects;
export const INITIAL_SERVICES = initialServices;
export const INITIAL_TESTIMONIALS = initialTestimonials;

