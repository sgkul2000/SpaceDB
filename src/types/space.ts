export type Amenity = "Parking" | "Catering" | "AV Equipment" | "WiFi" | "Outdoor" | "Bar";
export type Category = "Banquet Hall" | "Meeting Room" | "Coworking" | "Rooftop" | "Studio";

export interface Space {
  id: number;
  name: string;
  description: string;
  city: string;
  category: Category;
  price: number;
  capacity: number;
  rating: number;
  reviewCount: number;
  amenities: Amenity[];
  imageUrl: string;
  createdAt: string;
}
