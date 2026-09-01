import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import { SAMPLE_PROPERTIES, SAMPLE_USERS, SAMPLE_INQUIRIES } from "../lib/sample-data";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting LandParcel Realtors database seed...\n");

  const passwordHash = await bcrypt.hash("Password123!", 10);

  // 1. Seed Users
  console.log("👤 Seeding Users...");
  for (const user of SAMPLE_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        companyName: user.companyName,
        licenseNumber: user.licenseNumber,
        bio: user.bio,
        isVerified: user.isVerified ?? true,
        isBlocked: user.isBlocked ?? false,
      },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        passwordHash,
        role: user.role,
        avatar: user.avatar,
        companyName: user.companyName,
        licenseNumber: user.licenseNumber,
        bio: user.bio,
        isVerified: user.isVerified ?? true,
        isBlocked: user.isBlocked ?? false,
      },
    });
    console.log(`  ✓ User: ${user.name} (${user.email}) [${user.role}]`);
  }

  // 2. Seed Properties
  console.log("\n🏡 Seeding Properties...");
  for (const prop of SAMPLE_PROPERTIES) {
    const { owner, isWishlisted, ...propertyData } = prop as any;

    await prisma.property.upsert({
      where: { id: prop.id },
      update: {
        title: propertyData.title,
        description: propertyData.description,
        price: propertyData.price,
        propertyType: propertyData.propertyType,
        listingType: propertyData.listingType,
        city: propertyData.city,
        locality: propertyData.locality,
        address: propertyData.address,
        lat: propertyData.lat,
        lng: propertyData.lng,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        areaSqFt: propertyData.areaSqFt,
        carpetArea: propertyData.carpetArea,
        facing: propertyData.facing,
        parking: propertyData.parking,
        propertyAge: propertyData.propertyAge,
        maintenanceFee: propertyData.maintenanceFee,
        floor: propertyData.floor,
        totalFloors: propertyData.totalFloors,
        furnishingStatus: propertyData.furnishingStatus,
        status: propertyData.status,
        featured: propertyData.featured,
        verified: propertyData.verified,
        images: propertyData.images,
        amenities: propertyData.amenities,
        ownerId: propertyData.ownerId,
      },
      create: {
        id: propertyData.id,
        title: propertyData.title,
        description: propertyData.description,
        price: propertyData.price,
        propertyType: propertyData.propertyType,
        listingType: propertyData.listingType,
        city: propertyData.city,
        locality: propertyData.locality,
        address: propertyData.address,
        lat: propertyData.lat,
        lng: propertyData.lng,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        areaSqFt: propertyData.areaSqFt,
        carpetArea: propertyData.carpetArea,
        facing: propertyData.facing,
        parking: propertyData.parking,
        propertyAge: propertyData.propertyAge,
        maintenanceFee: propertyData.maintenanceFee,
        floor: propertyData.floor,
        totalFloors: propertyData.totalFloors,
        furnishingStatus: propertyData.furnishingStatus,
        status: propertyData.status,
        featured: propertyData.featured,
        verified: propertyData.verified,
        images: propertyData.images,
        amenities: propertyData.amenities,
        ownerId: propertyData.ownerId,
        createdAt: new Date(propertyData.createdAt),
      },
    });
    console.log(`  ✓ Property: ${prop.title} (${prop.city}) - ₹${(prop.price / 10000000).toFixed(2)} Cr`);
  }

  // 3. Seed Inquiries & Tour Bookings
  console.log("\n📅 Seeding Inquiries & Tour Bookings...");
  for (const inq of SAMPLE_INQUIRIES) {
    const { property, user, ...inquiryData } = inq as any;

    await prisma.inquiry.upsert({
      where: { id: inq.id },
      update: {
        propertyId: inquiryData.propertyId,
        userId: inquiryData.userId,
        name: inquiryData.name,
        email: inquiryData.email,
        phone: inquiryData.phone,
        message: inquiryData.message,
        visitDate: inquiryData.visitDate,
        visitTime: inquiryData.visitTime,
        visitType: inquiryData.visitType,
        status: inquiryData.status,
      },
      create: {
        id: inquiryData.id,
        propertyId: inquiryData.propertyId,
        userId: inquiryData.userId,
        name: inquiryData.name,
        email: inquiryData.email,
        phone: inquiryData.phone,
        message: inquiryData.message,
        visitDate: inquiryData.visitDate,
        visitTime: inquiryData.visitTime,
        visitType: inquiryData.visitType,
        status: inquiryData.status,
        createdAt: new Date(inquiryData.createdAt),
      },
    });
    console.log(`  ✓ Inquiry: ${inq.id} for Property ${inq.propertyId} by ${inq.name} [${inq.status}]`);
  }

  // 4. Seed Sample Wishlists
  console.log("\n❤️ Seeding Sample Wishlist items...");
  const sampleWishlists = [
    { userId: "user-buyer-1", propertyId: "prop-1" },
    { userId: "user-buyer-1", propertyId: "prop-2" },
  ];

  for (const item of sampleWishlists) {
    await prisma.wishlist.upsert({
      where: {
        userId_propertyId: {
          userId: item.userId,
          propertyId: item.propertyId,
        },
      },
      update: {},
      create: {
        userId: item.userId,
        propertyId: item.propertyId,
      },
    });
    console.log(`  ✓ Wishlist: User ${item.userId} -> Property ${item.propertyId}`);
  }

  console.log("\n✨ Database seeding completed successfully!\n");
  console.log("==================================================");
  console.log("Default Accounts (Password: Password123!)");
  console.log("  • Buyer:  buyer@landparcel.com");
  console.log("  • Agent:  agent@landparcel.com");
  console.log("  • Admin:  admin@landparcel.com");
  console.log("==================================================\n");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
