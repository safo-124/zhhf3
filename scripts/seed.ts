import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...\n");

  // --- Users ---
  const admin = await prisma.user.upsert({
    where: { email: "admin@zhhf.org" },
    update: {},
    create: {
      email: "admin@zhhf.org",
      name: "Admin User",
      role: "admin",
      phone: "+233 20 000 0001",
    },
  });

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "grace@example.com" },
      update: {},
      create: { email: "grace@example.com", name: "Grace Addo", role: "volunteer", phone: "+233 24 555 6789" },
    }),
    prisma.user.upsert({
      where: { email: "james@example.com" },
      update: {},
      create: { email: "james@example.com", name: "James Asante", role: "member", phone: "+233 27 111 2233" },
    }),
    prisma.user.upsert({
      where: { email: "ama@example.com" },
      update: {},
      create: { email: "ama@example.com", name: "Ama Serwah", role: "member", phone: "+233 20 444 5566" },
    }),
    prisma.user.upsert({
      where: { email: "kofi@example.com" },
      update: {},
      create: { email: "kofi@example.com", name: "Kofi Mensah", role: "volunteer", phone: "+233 55 777 8899" },
    }),
    prisma.user.upsert({
      where: { email: "esther@example.com" },
      update: {},
      create: { email: "esther@example.com", name: "Esther Appiah", role: "donor", phone: "+233 24 333 4455" },
    }),
    prisma.user.upsert({
      where: { email: "yaw@example.com" },
      update: {},
      create: { email: "yaw@example.com", name: "Yaw Boateng", role: "member", phone: "+233 20 666 7788" },
    }),
    prisma.user.upsert({
      where: { email: "akosua@example.com" },
      update: {},
      create: { email: "akosua@example.com", name: "Akosua Nyarko", role: "volunteer", phone: "+233 55 222 3344" },
    }),
    prisma.user.upsert({
      where: { email: "samuel@example.com" },
      update: {},
      create: { email: "samuel@example.com", name: "Samuel Osei", role: "admin", phone: "+233 27 111 2233" },
    }),
  ]);

  console.log(`✅ Created ${users.length + 1} users (including admin)`);

  // --- Campaigns ---
  const campaigns = await Promise.all([
    prisma.campaign.create({
      data: {
        title: "Education for All",
        description: "Providing scholarships and school supplies to underprivileged children in rural communities.",
        goal: 60000,
        raised: 45000,
        active: true,
      },
    }),
    prisma.campaign.create({
      data: {
        title: "Clean Water Initiative",
        description: "Installing wells and water purification systems in communities without clean water access.",
        goal: 50000,
        raised: 32000,
        active: true,
      },
    }),
    prisma.campaign.create({
      data: {
        title: "Community Healthcare",
        description: "Free medical camps and health education for remote and underserved communities.",
        goal: 35000,
        raised: 28000,
        active: true,
      },
    }),
  ]);

  console.log(`✅ Created ${campaigns.length} campaigns`);

  // --- Donations ---
  const donations = await Promise.all([
    prisma.donation.create({ data: { amount: 500, user: { connect: { id: users[0].id } }, campaign: { connect: { id: campaigns[0].id } }, status: "completed", paymentMethod: "card" } }),
    prisma.donation.create({ data: { amount: 250, user: { connect: { id: users[1].id } }, campaign: { connect: { id: campaigns[0].id } }, status: "completed", paymentMethod: "mobile_money" } }),
    prisma.donation.create({ data: { amount: 1000, anonymous: true, campaign: { connect: { id: campaigns[1].id } }, status: "completed", paymentMethod: "bank_transfer" } }),
    prisma.donation.create({ data: { amount: 100, user: { connect: { id: users[2].id } }, campaign: { connect: { id: campaigns[2].id } }, status: "completed", paymentMethod: "card" } }),
    prisma.donation.create({ data: { amount: 50, user: { connect: { id: users[3].id } }, campaign: { connect: { id: campaigns[0].id } }, status: "completed", paymentMethod: "card", isMonthly: true } }),
    prisma.donation.create({ data: { amount: 750, user: { connect: { id: users[4].id } }, campaign: { connect: { id: campaigns[1].id } }, status: "completed", paymentMethod: "card" } }),
    prisma.donation.create({ data: { amount: 200, user: { connect: { id: users[5].id } }, campaign: { connect: { id: campaigns[2].id } }, status: "completed", paymentMethod: "mobile_money" } }),
    prisma.donation.create({ data: { amount: 300, user: { connect: { id: users[6].id } }, campaign: { connect: { id: campaigns[0].id } }, status: "completed", paymentMethod: "card" } }),
    prisma.donation.create({ data: { amount: 150, user: { connect: { id: users[0].id } }, campaign: { connect: { id: campaigns[1].id } }, status: "completed", paymentMethod: "card" } }),
    prisma.donation.create({ data: { amount: 500, user: { connect: { id: users[4].id } }, campaign: { connect: { id: campaigns[2].id } }, status: "completed", paymentMethod: "bank_transfer" } }),
  ]);

  console.log(`✅ Created ${donations.length} donations`);

  // --- Events ---
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: "Annual Charity Gala",
        description: "Join us for an evening of inspiration, entertainment, and fundraising for our education program.",
        date: new Date("2026-03-15T18:00:00"),
        time: "6:00 PM",
        location: "Grand Ballroom, City Center",
        category: "Fundraiser",
        capacity: 200,
        featured: true,
      },
    }),
    prisma.event.create({
      data: {
        title: "Community Health Fair",
        description: "Free health screenings, wellness workshops, and family activities for the whole community.",
        date: new Date("2026-04-05T09:00:00"),
        time: "9:00 AM",
        location: "Community Park, Downtown",
        category: "Outreach",
        capacity: 500,
        featured: true,
      },
    }),
    prisma.event.create({
      data: {
        title: "Volunteer Orientation",
        description: "Learn about volunteer opportunities and how you can contribute your skills to our mission.",
        date: new Date("2026-04-20T10:00:00"),
        time: "10:00 AM",
        location: "ZHHF Headquarters",
        category: "Community",
        capacity: 50,
        featured: false,
      },
    }),
    prisma.event.create({
      data: {
        title: "Clean Water Walkathon",
        description: "Walk 5K to raise awareness and funds for our clean water initiative in rural communities.",
        date: new Date("2026-05-10T07:00:00"),
        time: "7:00 AM",
        location: "Riverside Park",
        category: "Fundraiser",
        capacity: 300,
        featured: false,
      },
    }),
    prisma.event.create({
      data: {
        title: "Back-to-School Drive",
        description: "Help us collect and distribute school supplies to children in underserved communities.",
        date: new Date("2026-08-15T08:00:00"),
        time: "8:00 AM",
        location: "ZHHF Community Center",
        category: "Outreach",
        capacity: 150,
        featured: false,
      },
    }),
  ]);

  console.log(`✅ Created ${events.length} events`);

  // --- Event Registrations ---
  await Promise.all([
    prisma.eventRegistration.create({ data: { user: { connect: { id: users[0].id } }, event: { connect: { id: events[0].id } } } }),
    prisma.eventRegistration.create({ data: { user: { connect: { id: users[1].id } }, event: { connect: { id: events[0].id } } } }),
    prisma.eventRegistration.create({ data: { user: { connect: { id: users[2].id } }, event: { connect: { id: events[1].id } } } }),
    prisma.eventRegistration.create({ data: { user: { connect: { id: users[3].id } }, event: { connect: { id: events[1].id } } } }),
    prisma.eventRegistration.create({ data: { user: { connect: { id: users[4].id } }, event: { connect: { id: events[2].id } } } }),
  ]);

  console.log("✅ Created 5 event registrations");

  // --- Testimonials ---
  const testimonials = await Promise.all([
    prisma.testimonial.create({
      data: {
        name: "Sarah Johnson",
        role: "Beneficiary Parent",
        content: "Thanks to ZHHF's education program, my two children now have access to quality schooling and learning materials. This foundation didn't just help my family — they changed our entire future.",
        avatar: "SJ",
        rating: 5,
        featured: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Dr. Michael Okafor",
        role: "Community Health Partner",
        content: "Working alongside ZHHF on their healthcare initiative has been incredibly rewarding. Their commitment to reaching the most remote communities with quality medical care is unparalleled.",
        avatar: "MO",
        rating: 5,
        featured: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Amara Diallo",
        role: "Volunteer Coordinator",
        content: "As a volunteer for three years, I've witnessed firsthand the transformative power of this organization. Every project, every outreach — it all comes from a place of genuine love and care.",
        avatar: "AD",
        rating: 5,
        featured: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "James & Linda Chen",
        role: "Monthly Donors",
        content: "We've been donating monthly for over two years. The transparency reports we receive make us confident that every dollar is making a real difference in people's lives.",
        avatar: "JC",
        rating: 5,
        featured: true,
      },
    }),
  ]);

  console.log(`✅ Created ${testimonials.length} testimonials`);

  // --- Blog Posts ---
  const posts = await Promise.all([
    prisma.blogPost.upsert({
      where: { slug: "how-your-donations-transformed-a-village" },
      update: {},
      create: {
        title: "How Your Donations Transformed a Village",
        slug: "how-your-donations-transformed-a-village",
        content: "In the heart of northern Ghana, a small village has experienced remarkable change thanks to the generosity of our donors. New wells, a rebuilt school, and a community health center now serve over 2,000 residents...",
        excerpt: "See how donor contributions built wells, schools, and health centers serving 2,000+ residents.",
        category: "Stories",
        author: "Admin",
        published: true,
        views: 1240,
      },
    }),
    prisma.blogPost.upsert({
      where: { slug: "2025-annual-report" },
      update: {},
      create: {
        title: "2025 Annual Report: A Year of Record Impact",
        slug: "2025-annual-report",
        content: "This year marks our most impactful year yet. We reached over 15,000 families, expanded to 5 new communities, and achieved 92% program efficiency...",
        excerpt: "Our most impactful year yet — 15,000 families reached and 5 new communities served.",
        category: "Updates",
        author: "Admin",
        published: true,
        views: 890,
      },
    }),
    prisma.blogPost.upsert({
      where: { slug: "education-program-milestones" },
      update: {},
      create: {
        title: "Education Program Milestones",
        slug: "education-program-milestones",
        content: "Our education initiative has now provided scholarships to over 500 students. This month, we celebrated the graduation of our first cohort of university scholars...",
        excerpt: "500+ scholarships awarded and our first university cohort graduates.",
        category: "Education",
        author: "Grace Addo",
        published: true,
        views: 650,
      },
    }),
    prisma.blogPost.upsert({
      where: { slug: "community-health-fair-success" },
      update: {},
      create: {
        title: "Community Health Fair Success",
        slug: "community-health-fair-success",
        content: "Last month's health fair provided free screenings to over 800 community members. Early detection of conditions like hypertension and diabetes helped connect dozens to care...",
        excerpt: "800+ community members received free health screenings at our latest fair.",
        category: "Health",
        author: "Dr. Michael Okafor",
        published: true,
        views: 430,
      },
    }),
    prisma.blogPost.upsert({
      where: { slug: "volunteer-spotlight-power-giving-time" },
      update: {},
      create: {
        title: "Volunteer Spotlight: The Power of Giving Time",
        slug: "volunteer-spotlight-power-giving-time",
        content: "Meet three of our incredible volunteers who have dedicated thousands of hours to making a difference in their communities...",
        excerpt: "Meet three volunteers who've dedicated thousands of hours to community impact.",
        category: "Community",
        author: "Admin",
        published: true,
        views: 320,
      },
    }),
  ]);

  console.log(`✅ Created ${posts.length} blog posts`);

  // --- Newsletter subscribers ---
  await Promise.all([
    prisma.newsletter.upsert({ where: { email: "subscriber1@example.com" }, update: {}, create: { email: "subscriber1@example.com" } }),
    prisma.newsletter.upsert({ where: { email: "subscriber2@example.com" }, update: {}, create: { email: "subscriber2@example.com" } }),
    prisma.newsletter.upsert({ where: { email: "subscriber3@example.com" }, update: {}, create: { email: "subscriber3@example.com" } }),
  ]);

  console.log("✅ Created 3 newsletter subscribers");

  // --- Volunteer Applications ---
  await Promise.all([
    prisma.volunteerApplication.create({
      data: { name: "Kwame Asare", email: "kwame@example.com", phone: "+233 20 999 8877", role: "Education", availability: "Weekends", status: "approved" },
    }),
    prisma.volunteerApplication.create({
      data: { name: "Abena Mensah", email: "abena.v@example.com", phone: "+233 24 111 2233", role: "Healthcare", availability: "Full-time", status: "pending" },
    }),
    prisma.volunteerApplication.create({
      data: { name: "Yaw Osei", email: "yaw.v@example.com", phone: "+233 55 444 5566", role: "Fundraising", availability: "Evenings", status: "approved" },
    }),
  ]);

  console.log("✅ Created 3 volunteer applications");

  // ── Homepage Settings & Hero Images ──
  const homepageSettings = [
    { key: "hero_badge", value: "Transforming Lives Since 2010" },
    { key: "hero_title_line1", value: "Extending" },
    { key: "hero_title_highlight", value: "Hope" },
    { key: "hero_title_line2", value: "to Every Hand" },
    { key: "hero_subtitle", value: "Zion Helping Hand Foundation empowers communities through compassion, education, and sustainable development. Together, we build a brighter future for those in need." },
    { key: "hero_cta1_text", value: "Donate Now" },
    { key: "hero_cta1_link", value: "/donate" },
    { key: "hero_cta2_text", value: "Watch Our Story" },
    { key: "hero_cta2_link", value: "/about" },
    { key: "hero_trust1", value: "501(c)(3) Certified" },
    { key: "hero_trust2", value: "4.9/5 Rating" },
    { key: "hero_trust3", value: "10K+ Donors" },
  ];

  for (const s of homepageSettings) {
    await prisma.homepageSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log("✅ Created homepage settings");

  const heroImages = [
    { url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=400&fit=crop", alt: "Children learning", sortOrder: 0 },
    { url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&h=400&fit=crop", alt: "Community support", sortOrder: 1 },
    { url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=400&fit=crop", alt: "Volunteers helping", sortOrder: 2 },
    { url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=400&fit=crop", alt: "Team building", sortOrder: 3 },
    { url: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=400&h=400&fit=crop", alt: "Education program", sortOrder: 4 },
  ];

  for (const img of heroImages) {
    await prisma.heroImage.create({ data: img });
  }
  console.log("✅ Created 5 hero images");

  // ── Gallery Images ──
  const galleryImages = [
    { url: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&h=600&fit=crop", caption: "Community outreach program", category: "Community" },
    { url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&h=600&fit=crop", caption: "Education workshop", category: "Education" },
    { url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&h=600&fit=crop", caption: "Healthcare initiative", category: "Healthcare" },
    { url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=600&fit=crop", caption: "Children learning together", category: "Education" },
    { url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=600&fit=crop", caption: "Volunteer team in action", category: "Volunteers" },
    { url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&h=600&fit=crop", caption: "Team building event", category: "Events" },
    { url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&h=600&fit=crop", caption: "Donation drive success", category: "Impact" },
    { url: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=600&h=600&fit=crop", caption: "Skills training program", category: "Education" },
    { url: "https://images.unsplash.com/photo-1526958097901-5e6d742d3371?w=600&h=600&fit=crop", caption: "Community celebration", category: "Community" },
    { url: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&h=600&fit=crop", caption: "Volunteers distributing supplies", category: "Volunteers" },
    { url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=600&fit=crop", caption: "Youth mentorship session", category: "Education" },
    { url: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=600&h=600&fit=crop", caption: "Annual charity gala", category: "Events" },
    { url: "https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?w=600&h=600&fit=crop", caption: "Medical camp outreach", category: "Healthcare" },
    { url: "https://images.unsplash.com/photo-1560252829-804f1aedf1be?w=600&h=600&fit=crop", caption: "Building homes together", category: "Impact" },
    { url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=600&fit=crop", caption: "Family support program", category: "Community" },
  ];

  for (const img of galleryImages) {
    await prisma.galleryImage.create({ data: img });
  }
  console.log("✅ Created 15 gallery images");

  console.log("\n🎉 Database seeded successfully!");
  console.log(`   Admin login: admin@zhhf.org`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
