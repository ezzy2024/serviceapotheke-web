'use server';

export async function searchPharmacyRegistry(query: string) {
  if (!query || query.length < 2) return [];

  try {
    // The backend is .NET API running locally or remotely.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5241";
    const res = await fetch(`${apiUrl}/api/registry/search?query=${encodeURIComponent(query)}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Registry search failed:", res.statusText);
      return [];
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching pharmacy registry:", error);
    return [];
  }
}
