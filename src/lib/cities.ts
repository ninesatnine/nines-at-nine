/* The cities a room can open in. Each entry is a canonical name plus the other
   names people actually type for it, so "Bangalore" finds "Bengaluru". */

export type City = { name: string; aliases: string[] };

export const CITIES: City[] = [
  { name: "Agartala", aliases: [] },
  { name: "Agra", aliases: [] },
  { name: "Ahmedabad", aliases: [] },
  { name: "Aizawl", aliases: [] },
  { name: "Ajmer", aliases: [] },
  { name: "Akola", aliases: [] },
  { name: "Alappuzha", aliases: ["Alleppey"] },
  { name: "Aligarh", aliases: [] },
  { name: "Amravati", aliases: [] },
  { name: "Amritsar", aliases: [] },
  { name: "Anand", aliases: [] },
  { name: "Asansol", aliases: [] },
  { name: "Aurangabad (Chhatrapati Sambhajinagar)", aliases: ["Aurangabad", "Chhatrapati Sambhajinagar"] },
  { name: "Bareilly", aliases: [] },
  { name: "Belagavi", aliases: ["Belgaum"] },
  { name: "Bengaluru", aliases: ["Bangalore"] },
  { name: "Bhavnagar", aliases: [] },
  { name: "Bhilai", aliases: [] },
  { name: "Bhiwandi", aliases: [] },
  { name: "Bhopal", aliases: [] },
  { name: "Bhubaneswar", aliases: [] },
  { name: "Bikaner", aliases: [] },
  { name: "Bilaspur", aliases: [] },
  { name: "Bokaro", aliases: [] },
  { name: "Chandigarh", aliases: [] },
  { name: "Chennai", aliases: ["Madras"] },
  { name: "Coimbatore", aliases: [] },
  { name: "Cuttack", aliases: [] },
  { name: "Darjeeling", aliases: [] },
  { name: "Davanagere", aliases: [] },
  { name: "Dehradun", aliases: [] },
  { name: "Delhi", aliases: ["New Delhi"] },
  { name: "Dhanbad", aliases: [] },
  { name: "Dharamshala", aliases: [] },
  { name: "Dibrugarh", aliases: [] },
  { name: "Durg", aliases: [] },
  { name: "Durgapur", aliases: [] },
  { name: "Erode", aliases: [] },
  { name: "Faridabad", aliases: [] },
  { name: "Gandhinagar", aliases: [] },
  { name: "Gangtok", aliases: [] },
  { name: "Ghaziabad", aliases: [] },
  { name: "Goa (Panaji)", aliases: ["Panaji", "Panjim"] },
  { name: "Gorakhpur", aliases: [] },
  { name: "Greater Noida", aliases: [] },
  { name: "Gulbarga (Kalaburagi)", aliases: ["Kalaburagi", "Gulbarga"] },
  { name: "Guntur", aliases: [] },
  { name: "Gurugram", aliases: ["Gurgaon"] },
  { name: "Guwahati", aliases: [] },
  { name: "Gwalior", aliases: [] },
  { name: "Haridwar", aliases: [] },
  { name: "Howrah", aliases: [] },
  { name: "Hubballi-Dharwad", aliases: ["Hubli", "Dharwad"] },
  { name: "Hyderabad", aliases: [] },
  { name: "Imphal", aliases: [] },
  { name: "Indore", aliases: [] },
  { name: "Itanagar", aliases: [] },
  { name: "Jabalpur", aliases: [] },
  { name: "Jaipur", aliases: [] },
  { name: "Jalandhar", aliases: [] },
  { name: "Jalgaon", aliases: [] },
  { name: "Jammu", aliases: [] },
  { name: "Jamnagar", aliases: [] },
  { name: "Jamshedpur", aliases: [] },
  { name: "Jhansi", aliases: [] },
  { name: "Jodhpur", aliases: [] },
  { name: "Kakinada", aliases: [] },
  { name: "Kannur", aliases: [] },
  { name: "Kanpur", aliases: [] },
  { name: "Kharagpur", aliases: [] },
  { name: "Kochi", aliases: ["Cochin", "Ernakulam"] },
  { name: "Kohima", aliases: [] },
  { name: "Kolhapur", aliases: [] },
  { name: "Kolkata", aliases: ["Calcutta"] },
  { name: "Kollam", aliases: [] },
  { name: "Kota", aliases: [] },
  { name: "Kottayam", aliases: [] },
  { name: "Kozhikode", aliases: ["Calicut"] },
  { name: "Kurnool", aliases: [] },
  { name: "Leh", aliases: [] },
  { name: "Lucknow", aliases: [] },
  { name: "Ludhiana", aliases: [] },
  { name: "Madurai", aliases: [] },
  { name: "Manali", aliases: [] },
  { name: "Mangaluru", aliases: ["Mangalore"] },
  { name: "Margao", aliases: [] },
  { name: "Meerut", aliases: [] },
  { name: "Mohali", aliases: [] },
  { name: "Moradabad", aliases: [] },
  { name: "Mumbai", aliases: ["Bombay"] },
  { name: "Mussoorie", aliases: [] },
  { name: "Mysuru", aliases: ["Mysore"] },
  { name: "Nagpur", aliases: [] },
  { name: "Nainital", aliases: [] },
  { name: "Nashik", aliases: [] },
  { name: "Navi Mumbai", aliases: [] },
  { name: "Nellore", aliases: [] },
  { name: "Noida", aliases: [] },
  { name: "Ooty (Udhagamandalam)", aliases: ["Ooty", "Udhagamandalam"] },
  { name: "Palakkad", aliases: [] },
  { name: "Panipat", aliases: [] },
  { name: "Patiala", aliases: [] },
  { name: "Patna", aliases: [] },
  { name: "Puducherry", aliases: ["Pondicherry"] },
  { name: "Pune", aliases: [] },
  { name: "Raipur", aliases: [] },
  { name: "Rajahmundry", aliases: [] },
  { name: "Rajkot", aliases: [] },
  { name: "Ranchi", aliases: [] },
  { name: "Rishikesh", aliases: [] },
  { name: "Rourkela", aliases: [] },
  { name: "Salem", aliases: [] },
  { name: "Secunderabad", aliases: [] },
  { name: "Shillong", aliases: [] },
  { name: "Shimla", aliases: [] },
  { name: "Siliguri", aliases: [] },
  { name: "Solapur", aliases: [] },
  { name: "Sonipat", aliases: [] },
  { name: "Srinagar", aliases: [] },
  { name: "Surat", aliases: [] },
  { name: "Thane", aliases: [] },
  { name: "Thiruvananthapuram", aliases: ["Trivandrum"] },
  { name: "Thrissur", aliases: ["Trichur"] },
  { name: "Tiruchirappalli", aliases: ["Trichy"] },
  { name: "Tirunelveli", aliases: [] },
  { name: "Tirupati", aliases: [] },
  { name: "Tiruppur", aliases: [] },
  { name: "Udaipur", aliases: [] },
  { name: "Ujjain", aliases: [] },
  { name: "Vadodara", aliases: ["Baroda"] },
  { name: "Varanasi", aliases: ["Banaras", "Benares"] },
  { name: "Vellore", aliases: [] },
  { name: "Vijayawada", aliases: [] },
  { name: "Visakhapatnam", aliases: ["Vizag"] },
  { name: "Warangal", aliases: [] },
  { name: "Zirakpur", aliases: [] },
];

/** Letters only, lowercased — so "Goa (Panaji)" and "goa panaji" compare equal. */
export function normalizeCity(text: string): string {
  return text.toLowerCase().replace(/[^a-z]/g, "");
}

export type CityMatch = { name: string; alias: string };

/**
 * Cities whose name or an alias contains the query. Matches that *start* with
 * the query come first, so typing "ban" leads with Bangalore, not Asansol.
 */
export function matchCities(query: string): CityMatch[] {
  const q = normalizeCity(query);
  if (!q) return CITIES.map((c) => ({ name: c.name, alias: "" }));

  const startsWith: CityMatch[] = [];
  const contains: CityMatch[] = [];

  for (const city of CITIES) {
    let hit: string | null = null;
    let rank = 9;
    for (const candidate of [city.name, ...city.aliases]) {
      const at = normalizeCity(candidate).indexOf(q);
      if (at === 0 && rank > 0) {
        hit = candidate;
        rank = 0;
      } else if (at > 0 && rank > 1) {
        hit = candidate;
        rank = 1;
      }
    }
    if (hit !== null) {
      const match = { name: city.name, alias: hit === city.name ? "" : hit };
      (rank === 0 ? startsWith : contains).push(match);
    }
  }
  return startsWith.concat(contains);
}

/** The canonical name if the text is exactly a city or one of its aliases, else "". */
export function exactCity(text: string): string {
  const q = normalizeCity(text);
  if (!q) return "";
  const hit = CITIES.find((c) =>
    [c.name, ...c.aliases].some((candidate) => normalizeCity(candidate) === q),
  );
  return hit ? hit.name : "";
}
