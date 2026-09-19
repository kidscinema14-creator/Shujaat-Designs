/**
 * Helper to clean and format WhatsApp links with pre-filled encoded messages
 */

export function cleanPhoneNumber(phone: string): string {
  // Remove non-digit characters except leading plus
  return phone.replace(/[^0-9]/g, '');
}

export function createWhatsAppLink(phoneNumber: string, message: string): string {
  const cleanNumber = cleanPhoneNumber(phoneNumber || '+919622229622');
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

export function getGeneralWhatsAppMessage(businessName: string = 'Shujaat Designs'): string {
  return `Hello ${businessName}, I want to discuss a website for my business.`;
}

export function getCategoryWhatsAppMessage(category: string, businessName: string = 'Shujaat Designs'): string {
  return `Hello ${businessName}, I am interested in a ${category} website. I would like to discuss the available options.`;
}

export function getDemoInquiryWhatsAppMessage(
  projectName: string, 
  businessName: string = 'Shujaat Designs'
): string {
  return `Hello ${businessName},

I am interested in the ${projectName} demo website.

I would like to discuss getting a similar website for my business.

My business name is: 
My requirements are: `;
}

export function getFormSubmissionWhatsAppMessage(formData: {
  name: string;
  businessName: string;
  mobile: string;
  email?: string;
  category: string;
  interestedProject?: string;
  requirements: string;
}, businessName: string = 'Shujaat Designs'): string {
  return `Hello ${businessName},

I would like to discuss a new website project:

* Client Name: ${formData.name}
* Business Name: ${formData.businessName || 'N/A'}
* Contact Number: ${formData.mobile}
${formData.email ? `* Email: ${formData.email}` : ''}
* Category: ${formData.category}
${formData.interestedProject ? `* Interested Demo: ${formData.interestedProject}` : ''}
* Requirements: 
${formData.requirements}

Looking forward to connecting!`;
}
