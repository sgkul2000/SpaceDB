import rawDb from "../../db.json";
import type { Space } from "@/types/space";
import type { Booking } from "@/types/booking";
import type { SavedSpace } from "@/types/saved";

const db = rawDb as unknown as { spaces: Space[]; bookings: Booking[]; saved: SavedSpace[] };

export const getData = {
  spaces: (): Space[] => db.spaces,
  bookings: (): Booking[] => db.bookings,
  saved: (): SavedSpace[] => db.saved,
};
