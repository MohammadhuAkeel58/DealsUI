export interface DealsInterface {
  id: number;
  name: string;
  slug: string;
  title: string;
  image?: string;
  imageFile?: File;
  hotels: HotelInterface[];
}
export interface HotelInterface {
  hotelId?: number;
  name: string;
  location: string;
  description: string;
  dealId?: number;
}
