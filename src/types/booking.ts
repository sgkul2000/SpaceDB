export type BookingStatus = "Pending" | "Confirmed" | "Cancelled";
export type BookingType = "Full Day" | "Half Day" | "Hourly";

export interface Booking {
  id: number;
  spaceId: number;
  spaceName: string;
  date: string;
  type: BookingType;
  status: BookingStatus;
  amount: number;
}
