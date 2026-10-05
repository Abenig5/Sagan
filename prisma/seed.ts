import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { DEFAULT_HOURS, DEFAULT_SLOT_MINUTES, DEFAULT_LAST_BEFORE_CLOSE_MINUTES, DEFAULT_BOOKING_WINDOW_WEEKS, DEFAULT_HERO_LOGO } from "../lib/data/defaults";
import { addDays, todayIso } from "../lib/dates";

const prisma = new PrismaClient();

async function main() {
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      hours: DEFAULT_HOURS as unknown as object,
      slotMinutes: DEFAULT_SLOT_MINUTES,
      lastBeforeCloseMinutes: DEFAULT_LAST_BEFORE_CLOSE_MINUTES,
      bookingWindowWeeks: DEFAULT_BOOKING_WINDOW_WEEKS,
      heroLogo: DEFAULT_HERO_LOGO,
    },
  });

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@saganbeauty.ch";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "sagan-admin";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.staffUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash, name: "Salon Admin" },
  });

  const today = todayIso();
  const demo = [
    { i: 1041, cat: "women", serviceId: "w1", length: 2, dayOffset: 0, time: "09:00", name: "Laura Meier", status: "confirmed", notes: "" },
    { i: 1042, cat: "men", serviceId: "m1", length: null, dayOffset: 0, time: "10:30", name: "Jonas Keller", status: "pending", notes: "" },
    { i: 1043, cat: "kids", serviceId: "k2", length: null, dayOffset: 0, time: "11:00", name: "Sofia Brunner", status: "pending", notes: "Für Tochter Mia, 5 Jahre." },
    { i: 1044, cat: "women", serviceId: "w9", length: null, dayOffset: 1, time: "13:00", name: "Anna Fischer", status: "pending", notes: "Natürliches, weiches Balayage gewünscht." },
    { i: 1045, cat: "makeup", serviceId: "u2", length: null, dayOffset: 1, time: "16:00", name: "Elena Rossi", status: "confirmed", notes: "Hochzeitsgast, Abendanlass." },
    { i: 1046, cat: "brows", serviceId: "b4", length: null, dayOffset: 2, time: "09:30", name: "Nina Weber", status: "pending", notes: "" },
    { i: 1048, cat: "men", serviceId: "m5", length: null, dayOffset: 3, time: "17:00", name: "Marco Graf", status: "pending", notes: "" },
    { i: 1049, cat: "women", serviceId: "w11", length: null, dayOffset: 4, time: "10:00", name: "Ruth Steiner", status: "confirmed", notes: "Allergie auf einige Haarfarben." },
  ] as const;

  for (const b of demo) {
    const date = addDays(today, b.dayOffset);
    const ref = `SB-${b.i}`;
    await prisma.booking.upsert({
      where: { ref },
      update: {},
      create: {
        ref,
        categoryId: b.cat,
        serviceId: b.serviceId,
        hairLength: b.length,
        date,
        time: b.time,
        name: b.name,
        phone: `+41 79 2${b.i % 100} 1${b.i % 10} 4${b.i % 10}`,
        email: `${b.name.split(" ")[0].toLowerCase()}@example.ch`,
        notes: b.notes || null,
        lang: "de",
        status: b.status,
      },
    });
  }

  console.log(`Seeded settings, admin user (${adminEmail} / ${adminPassword}), and ${demo.length} demo bookings.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
