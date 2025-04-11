"use server";

import { headers } from "next/headers";

export async function getUserLocation() {
  const headersList = await headers();
  const latitude = headersList.get("x-vercel-ip-latitude");
  const longitude = headersList.get("x-vercel-ip-longitude");

  try {
    return {
      lat: parseFloat(latitude),
      lon: parseFloat(longitude),
    };
  } catch (error) {
    console.error("Error getting location:", error);
    // Fallback to default location (Santiago, Chile)
    return {
      lat: -33.45694,
      lon: -70.64827,
    };
  }
}
