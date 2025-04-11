"use server";

import { headers } from "next/headers";

export async function getUserLocation() {
  const headersList = await headers();

  try {
    const latitude = headersList.get("x-vercel-ip-latitude");
    const longitude = headersList.get("x-vercel-ip-longitude");
    const city = headersList.get("x-vercel-ip-city");
    console.log(latitude);
    console.log(longitude);
    if (latitude && longitude) {
      return {
        lat: parseFloat(latitude),
        lon: parseFloat(longitude),
        city: city || "Your Place",
      };
    } else {
      throw new Error("Latitude or longitude is null");
    }
  } catch (error) {
    console.error("Error getting location:", error);
    // Fallback to default location (Santiago, Chile)
    return {
      lat: -33.45694,
      lon: -70.64827,
      city: "Your Place",
    };
  }
}
