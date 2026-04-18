import { faker } from "@faker-js/faker";
import { writeFileSync } from "fs";

const CATEGORIES = ["Banquet Hall", "Meeting Room", "Coworking", "Rooftop", "Studio"];
const CITIES = ["New York", "Los Angeles", "Chicago", "Austin", "Seattle", "Miami", "Boston", "Denver", "San Francisco", "Nashville"];
const AMENITIES = ["Parking", "Catering", "AV Equipment", "WiFi", "Outdoor", "Bar"];
const STATUSES = ["Pending", "Confirmed", "Cancelled"];

function randomSubset(arr, min = 1, max = arr.length) {
  const count = faker.number.int({ min, max });
  return faker.helpers.arrayElements(arr, count);
}

const spaces = Array.from({ length: 520 }, (_, i) => {
  const id = i + 1;
  return {
    id,
    name: faker.company.name() + " " + faker.helpers.arrayElement(["Space", "Hall", "Studio", "Loft", "Suite", "Room"]),
    description: faker.lorem.sentences(2),
    city: faker.helpers.arrayElement(CITIES),
    category: faker.helpers.arrayElement(CATEGORIES),
    price: faker.number.int({ min: 100, max: 5000 }),
    capacity: faker.number.int({ min: 5, max: 500 }),
    rating: parseFloat(faker.number.float({ min: 2.5, max: 5, fractionDigits: 1 }).toFixed(1)),
    reviewCount: faker.number.int({ min: 3, max: 400 }),
    amenities: randomSubset(AMENITIES, 1, 4),
    imageUrl: `https://picsum.photos/seed/${id}/600/400`,
    createdAt: faker.date.between({ from: "2022-01-01", to: "2024-12-31" }).toISOString(),
  };
});

const bookings = Array.from({ length: 25 }, (_, i) => {
  const space = faker.helpers.arrayElement(spaces);
  return {
    id: i + 1,
    spaceId: space.id,
    spaceName: space.name,
    date: faker.date.between({ from: "2024-01-01", to: "2025-06-30" }).toISOString().split("T")[0],
    type: faker.helpers.arrayElement(["Full Day", "Half Day", "Hourly"]),
    status: faker.helpers.arrayElement(STATUSES),
    amount: faker.number.int({ min: 100, max: 8000 }),
  };
});

// a few saved entries pointing at real space ids
const savedIds = faker.helpers.arrayElements(spaces, 8).map((s, i) => ({
  id: i + 1,
  spaceId: s.id,
}));

const db = { spaces, bookings, saved: savedIds };

writeFileSync("db.json", JSON.stringify(db, null, 2));
console.log(`generated: ${spaces.length} spaces, ${bookings.length} bookings, ${savedIds.length} saved`);
