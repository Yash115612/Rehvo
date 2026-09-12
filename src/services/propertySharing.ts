import { Share, Platform } from 'react-native';
import { Property } from '../types';

export interface PropertySharePayload {
  property: Property;
  referralCode?: string;
}

export const generatePropertyDeepLink = (propertyId: string, referralCode?: string): string => {
  const base = `https://rehvo.com/property/${propertyId}`;
  return referralCode ? `${base}?ref=${referralCode}` : base;
};

export const generateWhatsAppShareText = (property: Property, referralCode?: string): string => {
  const link = generatePropertyDeepLink(property.id, referralCode);
  const formattedRent = property.rent ? `₹${property.rent.toLocaleString()}/month` : 'Contact for Rent';
  
  return (
    `🏡 *${property.title}*\n` +
    `📍 Location: ${property.locality}, ${property.city}\n` +
    `💰 Rent: ${formattedRent} (VERIFIED LISTING)\n` +
    `✨ Amenities: ${property.amenities?.slice(0, 4).join(', ') || 'Fully Verified'}\n\n` +
    `Check verified photos, floor plans & schedule a visit on REHVO:\n${link}`
  );
};

export const generatePropertyQrCodeUrl = (propertyId: string, referralCode?: string): string => {
  const link = encodeURIComponent(generatePropertyDeepLink(propertyId, referralCode));
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${link}&margin=10`;
};

export const generateBrochureDownloadUrl = (propertyId: string): string => {
  return `https://api.rehvo.com/v72/brochure/${propertyId}.pdf`;
};

export const sharePropertyNative = async (
  property: Property,
  referralCode?: string
): Promise<boolean> => {
  const message = generateWhatsAppShareText(property, referralCode);
  const url = generatePropertyDeepLink(property.id, referralCode);

  try {
    const result = await Share.share({
      title: property.title,
      message: Platform.OS === 'android' ? `${message}` : property.title,
      url: Platform.OS === 'ios' ? url : undefined,
    });
    return result.action === Share.sharedAction;
  } catch {
    return false;
  }
};
