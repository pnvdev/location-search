'use server';

import { headers } from 'next/headers';

export async function getUserLocation() {
  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for');
  const realIp = headersList.get('x-real-ip');
  
  // Get the client IP from headers
  const clientIp = forwardedFor?.split(',')[0] || realIp || '127.0.0.1';
  
  try {
    // Use IP Geolocation API to get location
    const response = await fetch(`https://ipapi.co/${clientIp}/json/`);
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.reason || 'Failed to get location');
    }

    return {
      lat: parseFloat(data.latitude),
      lon: parseFloat(data.longitude)
    };
  } catch (error) {
    console.error('Error getting location:', error);
    // Fallback to default location (Santiago, Chile)
    return {
      lat: -33.45694,
      lon: -70.64827
    };
  }
} 