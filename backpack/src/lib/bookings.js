/**
 * Bookings data store for BackPack Junction.
 */

const bookings = new Map();
let nextBookingId = 1;

// Seed demo bookings
const seedBookings = [
  {
    id: "BKG-2026-001",
    userId: "user-demo-001",
    tripId: "kedarnath-spiritual-trek",
    tripTitle: "Kedarnath Spiritual Trek",
    destination: "Kedarnath",
    status: "confirmed",
    bookingDate: "2026-04-20T10:30:00Z",
    departureDate: "2026-06-15",
    returnDate: "2026-06-20",
    travelers: 1,
    totalAmount: 12999,
    paidAmount: 12999,
    paymentStatus: "paid",
    paymentMethod: "UPI",
    transactionId: "TXN-DEMO-001",
    specialRequests: "Vegetarian meals only",
    emergencyContact: { name: "Sunita Sharma", phone: "+91 98765 99999", relation: "Mother" },
  },
  {
    id: "BKG-2026-002",
    userId: "user-demo-001",
    tripId: "kashmir-paradise-tour",
    tripTitle: "Kashmir Paradise Tour",
    destination: "Kashmir",
    status: "pending",
    bookingDate: "2026-05-01T14:00:00Z",
    departureDate: "2026-06-20",
    returnDate: "2026-06-26",
    travelers: 2,
    totalAmount: 29998,
    paidAmount: 5000,
    paymentStatus: "partial",
    paymentMethod: "Card",
    transactionId: "TXN-DEMO-002",
    specialRequests: "",
    emergencyContact: { name: "Raj Kumar", phone: "+91 98765 88888", relation: "Father" },
  },
];

seedBookings.forEach((b) => bookings.set(b.id, b));

export function getBooking(id) {
  return bookings.get(id) || null;
}

export function getBookingsByUser(userId) {
  return Array.from(bookings.values()).filter((b) => b.userId === userId);
}

export function getAllBookings() {
  return Array.from(bookings.values());
}

export function createBooking({ userId, tripId, tripTitle, destination, travelers, totalAmount, paymentMethod, specialRequests, emergencyContact, departureDate, returnDate }) {
  const id = `BKG-2026-${String(nextBookingId++).padStart(3, "0")}`;
  const booking = {
    id,
    userId,
    tripId,
    tripTitle,
    destination,
    status: "confirmed",
    bookingDate: new Date().toISOString(),
    departureDate,
    returnDate,
    travelers: travelers || 1,
    totalAmount,
    paidAmount: totalAmount,
    paymentStatus: "paid",
    paymentMethod: paymentMethod || "Online",
    transactionId: `TXN-${Date.now()}`,
    specialRequests: specialRequests || "",
    emergencyContact: emergencyContact || {},
  };
  bookings.set(id, booking);
  return booking;
}

export function updateBookingStatus(id, status) {
  const booking = bookings.get(id);
  if (!booking) return null;
  booking.status = status;
  bookings.set(id, booking);
  return booking;
}

export function getBookingStats() {
  const all = getAllBookings();
  return {
    total: all.length,
    confirmed: all.filter((b) => b.status === "confirmed").length,
    pending: all.filter((b) => b.status === "pending").length,
    cancelled: all.filter((b) => b.status === "cancelled").length,
    totalRevenue: all.filter((b) => b.paymentStatus === "paid").reduce((sum, b) => sum + b.paidAmount, 0),
  };
}
