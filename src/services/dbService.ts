import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, auth } from '../lib/firebase';
import { 
  DemoProject, 
  ServiceItem, 
  TestimonialItem, 
  WebsiteSettings, 
  InquiryItem, 
  SystemLog 
} from '../types';
import { 
  initialProjects, 
  initialServices, 
  initialTestimonials, 
  initialSettings 
} from '../data/initialData';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const SETTINGS_DOC_ID = 'general_settings';

// Seed Database if empty
export async function ensureDatabaseInitialized(force: boolean = false): Promise<boolean> {
  try {
    const projectsCol = collection(db, 'projects');
    const snapshot = await getDocs(projectsCol);
    
    if (snapshot.empty || force) {
      console.log('Seeding initial data into Firestore...');
      // Seed Settings
      await setDoc(doc(db, 'settings', SETTINGS_DOC_ID), {
        ...initialSettings,
        updatedAt: new Date().toISOString(),
      });

      // Seed Projects
      for (const project of initialProjects) {
        await setDoc(doc(db, 'projects', project.id), project);
      }

      // Seed Services
      for (const service of initialServices) {
        await setDoc(doc(db, 'services', service.id), service);
      }

      // Seed Testimonials
      for (const testimonial of initialTestimonials) {
        await setDoc(doc(db, 'testimonials', testimonial.id), testimonial);
      }

      await logSystemEvent('info', 'Database', 'Initial dataset seeded successfully into Firestore.');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error during database initialization:', error);
    return false;
  }
}

export const seedInitialDataIfEmpty = ensureDatabaseInitialized;

// Reset / Force Re-seed (available in Developer Desk)
export async function forceReseedDatabase(): Promise<void> {
  await ensureDatabaseInitialized(true);
  await logSystemEvent('warn', 'Database', 'Database was manually re-seeded by Developer.');
}

// ==================== PROJECTS ====================

export function subscribeProjects(
  callback: (projects: DemoProject[]) => void,
  onlyPublished: boolean = true
) {
  const projectsCol = collection(db, 'projects');
  const q = query(projectsCol, orderBy('displayOrder', 'asc'));

  return onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      // If collection is still completely empty in Firestore, provide initialProjects as instant fallback
      callback(onlyPublished ? initialProjects.filter(p => p.published) : initialProjects);
      return;
    }

    const projects: DemoProject[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as DemoProject;
      const project: DemoProject = {
        ...data,
        id: docSnap.id,
      };
      if (!onlyPublished || project.published) {
        projects.push(project);
      }
    });

    // Sort by display order
    projects.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    callback(projects);
  }, (error) => {
    console.error('Error in projects listener:', error);
    callback(onlyPublished ? initialProjects.filter(p => p.published) : initialProjects);
  });
}

export async function saveProject(project: DemoProject): Promise<void> {
  const docRef = doc(db, 'projects', project.id);
  const now = new Date().toISOString();
  const payload = {
    ...project,
    updatedAt: now,
    createdAt: project.createdAt || now,
  };
  await setDoc(docRef, payload, { merge: true });
  await logSystemEvent('info', 'Projects', `Project "${project.name}" saved.`);
}

export async function deleteProject(projectId: string): Promise<void> {
  const docRef = doc(db, 'projects', projectId);
  await deleteDoc(docRef);
  await logSystemEvent('warn', 'Projects', `Project ID "${projectId}" permanently deleted.`);
}

export async function toggleProjectPublish(projectId: string, currentStatus: boolean): Promise<void> {
  const docRef = doc(db, 'projects', projectId);
  await updateDoc(docRef, {
    published: !currentStatus,
    updatedAt: new Date().toISOString(),
  });
}

export async function toggleProjectFeatured(projectId: string, currentStatus: boolean): Promise<void> {
  const docRef = doc(db, 'projects', projectId);
  await updateDoc(docRef, {
    featured: !currentStatus,
    updatedAt: new Date().toISOString(),
  });
}

export async function updateProjectStatus(
  projectId: string, 
  arg2: { published?: boolean; featured?: boolean } | boolean,
  arg3?: boolean
): Promise<void> {
  const docRef = doc(db, 'projects', projectId);
  let payload: Record<string, any> = {
    updatedAt: new Date().toISOString(),
  };

  if (typeof arg2 === 'boolean') {
    payload.published = arg2;
    if (typeof arg3 === 'boolean') {
      payload.featured = arg3;
    }
  } else if (typeof arg2 === 'object' && arg2 !== null) {
    payload = {
      ...payload,
      ...arg2,
    };
  }

  await updateDoc(docRef, payload);
}

// ==================== SERVICES ====================

export function subscribeServices(
  callback: (services: ServiceItem[]) => void,
  onlyPublished: boolean = true
) {
  const servicesCol = collection(db, 'services');
  const q = query(servicesCol, orderBy('displayOrder', 'asc'));

  return onSnapshot(q, (snapshot) => {
    if (snapshot.empty && onlyPublished) {
      callback(initialServices);
      return;
    }

    const services: ServiceItem[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as ServiceItem;
      const item: ServiceItem = {
        ...data,
        id: docSnap.id,
      };
      if (!onlyPublished || item.published) {
        services.push(item);
      }
    });

    services.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    callback(services);
  }, (error) => {
    console.error('Error in services listener:', error);
    callback(onlyPublished ? initialServices.filter(s => s.published) : initialServices);
  });
}

export async function saveService(service: ServiceItem): Promise<void> {
  const docRef = doc(db, 'services', service.id);
  await setDoc(docRef, {
    ...service,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

export async function deleteService(serviceId: string): Promise<void> {
  const docRef = doc(db, 'services', serviceId);
  await deleteDoc(docRef);
}

// ==================== TESTIMONIALS ====================

export function subscribeTestimonials(
  callback: (testimonials: TestimonialItem[]) => void,
  onlyPublished: boolean = true
) {
  const testimonialsCol = collection(db, 'testimonials');

  return onSnapshot(testimonialsCol, (snapshot) => {
    if (snapshot.empty && onlyPublished) {
      callback(initialTestimonials);
      return;
    }

    const testimonials: TestimonialItem[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as TestimonialItem;
      const item: TestimonialItem = {
        ...data,
        id: docSnap.id,
      };
      if (!onlyPublished || item.published) {
        testimonials.push(item);
      }
    });

    callback(testimonials);
  }, (error) => {
    console.error('Error in testimonials listener:', error);
    callback(onlyPublished ? initialTestimonials.filter(t => t.published) : initialTestimonials);
  });
}

export async function saveTestimonial(testimonial: TestimonialItem): Promise<void> {
  const docRef = doc(db, 'testimonials', testimonial.id);
  await setDoc(docRef, testimonial, { merge: true });
}

export async function deleteTestimonial(testimonialId: string): Promise<void> {
  const docRef = doc(db, 'testimonials', testimonialId);
  await deleteDoc(docRef);
}

// ==================== INQUIRIES ====================

export function subscribeInquiries(callback: (inquiries: InquiryItem[]) => void) {
  const inquiriesCol = collection(db, 'inquiries');

  return onSnapshot(inquiriesCol, (snapshot) => {
    const list: InquiryItem[] = [];
    snapshot.forEach((docSnap) => {
      list.push({
        id: docSnap.id,
        ...docSnap.data(),
      } as InquiryItem);
    });

    // sort newest first
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    callback(list);
  }, (error) => {
    console.error('Error subscribing to inquiries:', error);
    callback([]);
  });
}

export async function submitInquiry(inquiry: Omit<InquiryItem, 'id' | 'date' | 'status'>): Promise<string> {
  const id = 'inq_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const docRef = doc(db, 'inquiries', id);
  const newInquiry: InquiryItem = {
    ...inquiry,
    id,
    date: new Date().toISOString(),
    status: 'New',
  };

  await setDoc(docRef, newInquiry);
  await logSystemEvent('info', 'Inquiries', `New inquiry from ${inquiry.name} (${inquiry.businessName || 'Individual'})`);
  return id;
}

export async function updateInquiryStatus(inquiryId: string, status: InquiryItem['status']): Promise<void> {
  const docRef = doc(db, 'inquiries', inquiryId);
  await updateDoc(docRef, { status });
}

export async function deleteInquiry(inquiryId: string): Promise<void> {
  const docRef = doc(db, 'inquiries', inquiryId);
  await deleteDoc(docRef);
}

// ==================== WEBSITE SETTINGS ====================

export function subscribeSettings(callback: (settings: WebsiteSettings) => void) {
  const docRef = doc(db, 'settings', SETTINGS_DOC_ID);

  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as WebsiteSettings);
    } else {
      callback(initialSettings);
    }
  }, (error) => {
    console.error('Error in settings listener:', error);
    callback(initialSettings);
  });
}

export async function saveSettings(settings: WebsiteSettings): Promise<void> {
  const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
  await setDoc(docRef, {
    ...settings,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
  await logSystemEvent('info', 'Settings', 'Website settings updated.');
}

// ==================== FIREBASE STORAGE ====================

export async function uploadImageFile(file: File, folder: string = 'projects'): Promise<string> {
  try {
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const storagePath = `${folder}/${timestamp}_${cleanFileName}`;
    const storageRef = ref(storage, storagePath);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.warn('Firebase Storage upload failed, falling back to embedded local data URL:', error);
    // If Firebase Storage is blocked or offline, convert to base64 data URL so manager is never blocked!
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }
}

export async function deleteStorageFile(fileUrl: string): Promise<void> {
  try {
    if (fileUrl.includes('firebasestorage.googleapis.com')) {
      const storageRef = ref(storage, fileUrl);
      await deleteObject(storageRef);
    }
  } catch (err) {
    console.warn('Could not delete storage file or already removed:', err);
  }
}

// ==================== SYSTEM LOGS ====================

const memoryLogs: SystemLog[] = [];

export async function logSystemEvent(
  level: SystemLog['level'], 
  module: string, 
  message: string, 
  details?: any
) {
  const logItem: SystemLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
    level,
    module,
    message,
    details: details ? JSON.stringify(details) : undefined,
  };

  memoryLogs.unshift(logItem);
  if (memoryLogs.length > 50) memoryLogs.pop();

  try {
    // Also record in firestore if online
    const logDoc = doc(db, 'system_logs', logItem.id);
    await setDoc(logDoc, logItem);
  } catch {
    // Silently continue with memory log
  }
}

export function getRecentLogs(): SystemLog[] {
  return [...memoryLogs];
}

// Database stats for Developer Desk
export async function getDatabaseMetrics() {
  const results = {
    projectsCount: 0,
    publishedCount: 0,
    featuredCount: 0,
    servicesCount: 0,
    testimonialsCount: 0,
    inquiriesCount: 0,
    newInquiriesCount: 0,
    lastUpdate: new Date().toISOString(),
  };

  try {
    const projSnap = await getDocs(collection(db, 'projects'));
    results.projectsCount = projSnap.size;
    projSnap.forEach(d => {
      const data = d.data();
      if (data.published) results.publishedCount++;
      if (data.featured) results.featuredCount++;
    });

    const servSnap = await getDocs(collection(db, 'services'));
    results.servicesCount = servSnap.size;

    const testSnap = await getDocs(collection(db, 'testimonials'));
    results.testimonialsCount = testSnap.size;

    const inqSnap = await getDocs(collection(db, 'inquiries'));
    results.inquiriesCount = inqSnap.size;
    inqSnap.forEach(d => {
      const data = d.data();
      if (data.status === 'New') results.newInquiriesCount++;
    });
  } catch (err) {
    console.error('Error fetching metrics:', err);
  }

  return results;
}
