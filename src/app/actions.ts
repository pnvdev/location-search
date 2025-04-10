'use server';

import { headers } from 'next/headers';

export async function getUserLocation() {
  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for');
  const realIp = headersList.get('x-real-ip');
  
  // Get the client IP from headers
  const clientIp = forwardedFor?.split(',')[0] || realIp || '127.0.0.1';
  
  // For development, return a default location
  if (process.env.NODE_ENV === 'development') {
    return {
      lat: -33.45694,
      lon: -70.64827
    };
  }

  // In production, you would use the IP to get location
  // For now, we'll return a default location
  return {
    lat: -33.45694,
    lon: -70.64827
  };
} 