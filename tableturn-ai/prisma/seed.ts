import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding TableTurn AI database...')

  // ── Organization ──────────────────────────────────────────────────────────
  const org = await prisma.organization.upsert({
    where: { slug: 'rosewood-group' },
    update: {},
    create: {
      name: 'The Rosewood Group',
      slug: 'rosewood-group',
      plan: 'PRO',
      website: 'https://rosewoodnyc.com',
      phone: '(212) 555-9000',
      address: '123 Park Ave, New York, NY 10017',
      timezone: 'America/New_York',
    },
  })
  console.log('✓ Organization created:', org.name)

  // ── Locations ─────────────────────────────────────────────────────────────
  const locations = await Promise.all([
    prisma.location.upsert({
      where: { id: 'loc-kitchen' },
      update: {},
      create: {
        id: 'loc-kitchen',
        organizationId: org.id,
        name: 'Rosewood Kitchen',
        concept: 'Chef-driven American',
        cuisine: 'American',
        address: '123 Park Ave, New York, NY 10017',
        phone: '(212) 555-9001',
        website: 'https://rosewoodnyc.com/kitchen',
        reservationLink: 'https://resy.com/rosewood-kitchen',
        privateEventsLink: 'https://rosewoodnyc.com/private-dining',
        instagramHandle: '@rosewoodkitchen',
        voiceTone: 'polished',
        archetype: 'upscale',
        isActive: true,
      },
    }),
    prisma.location.upsert({
      where: { id: 'loc-bar' },
      update: {},
      create: {
        id: 'loc-bar',
        organizationId: org.id,
        name: 'Rosewood Bar & Lounge',
        concept: 'Craft Cocktail Bar',
        cuisine: 'Bar',
        address: '125 Park Ave, New York, NY 10017',
        phone: '(212) 555-9002',
        instagramHandle: '@rosewoodbar',
        voiceTone: 'playful',
        archetype: 'bar',
        isActive: true,
      },
    }),
    prisma.location.upsert({
      where: { id: 'loc-private' },
      update: {},
      create: {
        id: 'loc-private',
        organizationId: org.id,
        name: 'Rosewood Private Dining',
        concept: 'Private Events Venue',
        cuisine: 'American',
        address: '127 Park Ave, New York, NY 10017',
        phone: '(212) 555-9003',
        privateEventsLink: 'https://rosewoodnyc.com/events',
        voiceTone: 'elegant',
        archetype: 'upscale',
        isActive: true,
      },
    }),
  ])
  console.log(`✓ ${locations.length} locations created`)

  // ── Users ─────────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash('admin123', 12)
  const marketingHash = await bcrypt.hash('test123', 12)

  const [admin, marketingUser] = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@rosewood.com' },
      update: {},
      create: {
        organizationId: org.id,
        name: 'Jane Doe',
        email: 'admin@rosewood.com',
        passwordHash: adminHash,
        role: 'ADMIN',
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'marketing@rosewood.com' },
      update: {},
      create: {
        organizationId: org.id,
        name: 'Marcus Lee',
        email: 'marketing@rosewood.com',
        passwordHash: marketingHash,
        role: 'MARKETING_MANAGER',
        isActive: true,
      },
    }),
  ])
  console.log('✓ Users created: admin@rosewood.com, marketing@rosewood.com')

  // ── Tags ──────────────────────────────────────────────────────────────────
  const tagData = [
    { name: 'VIP', color: '#7c3aed' },
    { name: 'Birthday Club', color: '#db2777' },
    { name: 'Private Events', color: '#2563eb' },
    { name: 'Lapsed', color: '#d97706' },
    { name: 'Newsletter', color: '#6b7280' },
  ]

  const tags = await Promise.all(
    tagData.map(t =>
      prisma.tag.upsert({
        where: { organizationId_name: { organizationId: org.id, name: t.name } },
        update: {},
        create: { organizationId: org.id, ...t },
      })
    )
  )
  console.log(`✓ ${tags.length} tags created`)

  const tagMap = Object.fromEntries(tags.map(t => [t.name, t.id]))

  // ── Contacts ──────────────────────────────────────────────────────────────
  const contactsData = [
    { firstName: 'Sarah', lastName: 'Mitchell', email: 'sarah@example.com', phone: '(212) 555-0101', lastVisitDate: new Date('2025-03-15'), visitFrequency: 12, source: 'CSV Import', tags: ['VIP', 'Birthday Club'] },
    { firstName: 'Marcus', lastName: 'Johnson', email: 'marcus@example.com', phone: '(212) 555-0102', lastVisitDate: new Date('2025-02-28'), visitFrequency: 3, source: 'Web Form', tags: ['Private Events'] },
    { firstName: 'Jennifer', lastName: 'Park', email: 'jen.park@example.com', phone: '(917) 555-0103', lastVisitDate: new Date('2025-01-10'), visitFrequency: 24, source: 'CSV Import', tags: ['VIP', 'Newsletter'] },
    { firstName: 'Robert', lastName: 'Chen', email: 'rchen@example.com', phone: '(646) 555-0104', lastVisitDate: new Date('2024-10-05'), visitFrequency: 2, source: 'CSV Import', tags: ['Lapsed'] },
    { firstName: 'Amanda', lastName: 'Torres', email: 'amanda.t@example.com', phone: '(718) 555-0105', lastVisitDate: new Date('2025-03-20'), visitFrequency: 8, source: 'Walk-in', tags: ['Birthday Club', 'Newsletter'] },
    { firstName: 'David', lastName: 'Kim', email: 'dkim@example.com', phone: '(212) 555-0106', lastVisitDate: new Date('2025-03-22'), visitFrequency: 31, source: 'CSV Import', tags: ['VIP'] },
    { firstName: 'Lisa', lastName: 'Thompson', email: 'lisa.t@example.com', phone: '(347) 555-0107', lastVisitDate: new Date('2025-02-14'), visitFrequency: 5, source: 'Social', tags: ['Newsletter'] },
    { firstName: 'James', lastName: 'Wilson', email: 'jwilson@example.com', phone: '(212) 555-0108', lastVisitDate: new Date('2024-09-12'), visitFrequency: 1, source: 'CSV Import', tags: ['Lapsed'] },
    { firstName: 'Emily', lastName: 'Rivera', email: 'erivera@example.com', phone: '(646) 555-0109', lastVisitDate: new Date('2025-03-01'), visitFrequency: 7, source: 'OpenTable', tags: ['VIP'] },
    { firstName: 'Michael', lastName: 'Chang', email: 'mchang@example.com', phone: '(212) 555-0110', lastVisitDate: new Date('2025-01-20'), visitFrequency: 15, source: 'CSV Import', tags: ['VIP', 'Birthday Club'] },
  ]

  for (const contactData of contactsData) {
    const { tags: contactTags, ...rest } = contactData
    const existing = await prisma.contact.findFirst({ where: { organizationId: org.id, email: rest.email } })
    const contact = existing ?? await prisma.contact.create({
      data: { organizationId: org.id, locationId: locations[0].id, isSubscribed: true, ...rest },
    })
    for (const tagName of contactTags) {
      await prisma.contactTag.upsert({
        where: { contactId_tagId: { contactId: contact.id, tagId: tagMap[tagName] } },
        update: {},
        create: { contactId: contact.id, tagId: tagMap[tagName] },
      })
    }
  }
  console.log(`✓ ${contactsData.length} contacts created`)

  // ── Segments ──────────────────────────────────────────────────────────────
  await Promise.all([
    prisma.segment.create({
      data: {
        organizationId: org.id,
        name: 'VIP Guests',
        description: 'High-frequency guests tagged as VIP',
        filters: [{ field: 'tags', op: 'includes', value: 'VIP' }],
        contactCount: 847,
      },
    }),
    prisma.segment.create({
      data: {
        organizationId: org.id,
        name: 'Lapsed Guests',
        description: 'Guests who have not visited in over 180 days',
        filters: [{ field: 'lastVisitDate', op: 'older_than', value: '180 days' }],
        contactCount: 1240,
      },
    }),
    prisma.segment.create({
      data: {
        organizationId: org.id,
        name: 'Birthday This Month',
        description: 'Contacts with birthdays in the next 30 days',
        filters: [{ field: 'birthday', op: 'within_next', value: '30 days' }],
        contactCount: 34,
      },
    }),
  ])
  console.log('✓ Segments created')

  // ── Templates ─────────────────────────────────────────────────────────────
  await prisma.template.createMany({
    data: [
      {
        organizationId: org.id,
        name: 'VIP Guest Welcome Back',
        category: 'reactivation',
        tonePreset: 'polished',
        subject: 'We\'ve missed you at Rosewood — a gift inside',
        bodyHtml: '<p>Hi [First Name],</p><p>It\'s been a while, and we miss having you with us. As one of our most valued guests, we\'d love to welcome you back with something special...</p>',
      },
      {
        organizationId: org.id,
        name: 'Birthday Celebration Offer',
        category: 'birthday',
        tonePreset: 'warm',
        subject: 'Happy Birthday! A gift from us, [First Name] 🎂',
        bodyHtml: '<p>Hi [First Name],</p><p>Your birthday deserves to be celebrated properly. We\'d love to treat you to a special evening at Rosewood...</p>',
      },
      {
        organizationId: org.id,
        name: 'Private Event Follow-up',
        category: 'events',
        tonePreset: 'polished',
        subject: 'Thank you for your inquiry about private dining at Rosewood',
        bodyHtml: '<p>Hi [First Name],</p><p>Thank you for considering Rosewood Kitchen for your special event. Our private dining team would love to create an unforgettable evening for you and your guests...</p>',
      },
    ],
  })
  console.log('✓ Templates created')

  // ── Campaigns ─────────────────────────────────────────────────────────────
  await prisma.campaign.createMany({
    data: [
      {
        organizationId: org.id,
        locationId: locations[0].id,
        createdById: admin.id,
        name: 'Thursday Happy Hour — Week 2',
        subject: 'Tonight only: Half-price cocktails at Rosewood 🍸',
        status: 'SENT',
        type: 'EMAIL',
        objective: 'Drive weekday dinner traffic',
        fromName: 'Rosewood Kitchen',
        fromEmail: 'marketing@rosewood.com',
        sentAt: new Date('2025-03-06T14:00:00'),
        totalSent: 1240,
        totalOpened: 471,
        totalClicked: 77,
        totalBounced: 8,
        totalUnsubscribed: 3,
      },
      {
        organizationId: org.id,
        locationId: locations[0].id,
        createdById: marketingUser.id,
        name: 'Lapsed Guest Win-Back',
        subject: 'It\'s been a while — come back for something special',
        status: 'SENT',
        type: 'EMAIL',
        objective: 'Reactivate lapsed guests',
        fromName: 'Rosewood Kitchen',
        fromEmail: 'marketing@rosewood.com',
        sentAt: new Date('2025-03-01T10:00:00'),
        totalSent: 890,
        totalOpened: 258,
        totalClicked: 37,
        totalBounced: 12,
        totalUnsubscribed: 5,
      },
      {
        organizationId: org.id,
        locationId: locations[0].id,
        createdById: marketingUser.id,
        name: 'Sunday Brunch Push',
        subject: 'Reserve your Sunday table — new brunch menu launches this weekend',
        status: 'SCHEDULED',
        type: 'EMAIL',
        scheduledAt: new Date(Date.now() + 86400000),
        fromName: 'Rosewood Kitchen',
        fromEmail: 'marketing@rosewood.com',
      },
      {
        organizationId: org.id,
        locationId: locations[0].id,
        createdById: marketingUser.id,
        name: 'Birthday Club — April',
        subject: 'Happy Birthday! A gift from us 🎂',
        status: 'DRAFT',
        type: 'EMAIL',
        fromName: 'Rosewood Kitchen',
        fromEmail: 'marketing@rosewood.com',
      },
    ],
  })
  console.log('✓ Campaigns created')

  // ── Leads ─────────────────────────────────────────────────────────────────
  await prisma.lead.createMany({
    data: [
      {
        organizationId: org.id,
        locationId: locations[2].id,
        firstName: 'Sarah',
        lastName: 'Mitchell',
        email: 'sarah.m@example.com',
        phone: '(212) 555-0201',
        type: 'PRIVATE_DINING',
        status: 'NEW',
        source: 'Website',
        sourcePlatform: 'Meta Ads',
        notes: 'Anniversary dinner for 40, wants private room',
        partySize: 40,
        estimatedValue: 4200,
      },
      {
        organizationId: org.id,
        locationId: locations[2].id,
        firstName: 'Marcus',
        lastName: 'Johnson',
        email: 'marcus@corp.com',
        phone: '(646) 555-0202',
        type: 'CORPORATE_DINNER',
        status: 'CONTACTED',
        source: 'Website',
        sourcePlatform: 'Google',
        notes: 'Q2 team dinner, needs AV setup',
        partySize: 25,
        estimatedValue: 3800,
      },
      {
        organizationId: org.id,
        firstName: 'Jennifer',
        lastName: 'Park',
        email: 'jen@example.com',
        type: 'BIRTHDAY_DINNER',
        status: 'ENGAGED',
        source: 'Instagram',
        partySize: 8,
        estimatedValue: 600,
      },
      {
        organizationId: org.id,
        firstName: 'Westside Events',
        lastName: 'Co.',
        email: 'events@westside.com',
        type: 'CATERING',
        status: 'NEW',
        source: 'Website',
        notes: 'Off-site catering for product launch',
        partySize: 200,
        estimatedValue: 12000,
      },
      {
        organizationId: org.id,
        firstName: 'David',
        lastName: 'Chen',
        email: 'dchen@example.com',
        type: 'LARGE_PARTY',
        status: 'BOOKED',
        source: 'Referral',
        partySize: 15,
        estimatedValue: 2100,
      },
    ],
  })
  console.log('✓ Leads created')

  // ── Private Events ────────────────────────────────────────────────────────
  await prisma.privateEventInquiry.createMany({
    data: [
      {
        organizationId: org.id,
        locationId: locations[2].id,
        contactName: 'The Harrington Family',
        occasion: 'Wedding Rehearsal Dinner',
        requestedDate: new Date('2025-04-15'),
        partySize: 60,
        budgetMin: 7000,
        budgetMax: 10000,
        estimatedValue: 8500,
        stage: 'NEW_INQUIRY',
        source: 'Website',
      },
      {
        organizationId: org.id,
        locationId: locations[2].id,
        contactName: 'Goldman & Partners',
        company: 'Goldman & Partners Law',
        email: 'events@goldman-partners.com',
        occasion: 'Corporate Milestone Dinner',
        requestedDate: new Date('2025-05-02'),
        partySize: 45,
        estimatedValue: 12000,
        stage: 'CONTACTED',
        source: 'Website',
        sourcePlatform: 'Google',
      },
      {
        organizationId: org.id,
        locationId: locations[2].id,
        contactName: 'Apex Tech Launch',
        company: 'Apex Technologies',
        email: 'events@apextech.com',
        occasion: 'Product Launch Dinner',
        requestedDate: new Date('2025-04-22'),
        partySize: 80,
        budgetMin: 15000,
        budgetMax: 20000,
        estimatedValue: 18000,
        stage: 'PROPOSAL_SENT',
        source: 'Website',
        sourcePlatform: 'Google Ads',
      },
      {
        organizationId: org.id,
        locationId: locations[2].id,
        contactName: 'Meridian Bank Q2',
        company: 'Meridian Bank',
        email: 'events@meridian.com',
        occasion: 'Executive Dinner',
        requestedDate: new Date('2025-04-30'),
        partySize: 20,
        estimatedValue: 4500,
        stage: 'BOOKED',
        bookedAt: new Date('2025-03-15'),
        source: 'Referral',
      },
      {
        organizationId: org.id,
        contactName: 'Park Engagement',
        occasion: 'Engagement Party',
        requestedDate: new Date('2025-03-28'),
        partySize: 30,
        estimatedValue: 3200,
        stage: 'LOST',
        lostReason: 'Chose competitor on price',
        source: 'Website',
      },
    ],
  })
  console.log('✓ Private event inquiries created')

  // ── Sample Ad Metrics ─────────────────────────────────────────────────────
  await prisma.socialAdMetric.createMany({
    data: [
      {
        organizationId: org.id,
        platform: 'meta',
        accountName: 'Rosewood Group',
        campaignName: 'Private Dining Spring Push',
        adSetName: 'NYC Women 28-45',
        dateStart: new Date('2025-03-01'),
        dateEnd: new Date('2025-03-31'),
        spend: 1200,
        impressions: 124000,
        reach: 98000,
        clicks: 3840,
        ctr: 0.031,
        cpc: 0.31,
        cpm: 9.68,
        reservationClicks: 312,
        privateEventClicks: 89,
        leadFormCompletions: 23,
        costPerLead: 52.17,
        costPerReservation: 3.85,
      },
      {
        organizationId: org.id,
        platform: 'instagram',
        accountName: '@rosewoodkitchen',
        campaignName: 'Happy Hour Thursday',
        dateStart: new Date('2025-03-01'),
        dateEnd: new Date('2025-03-31'),
        spend: 800,
        impressions: 88000,
        clicks: 2640,
        ctr: 0.030,
        cpc: 0.30,
        reservationClicks: 224,
        privateEventClicks: 12,
      },
    ],
  })
  console.log('✓ Social ad metrics created')

  // ── Sample Post Metrics ───────────────────────────────────────────────────
  await prisma.socialPostMetric.createMany({
    data: [
      {
        organizationId: org.id,
        platform: 'instagram',
        accountHandle: '@rosewoodkitchen',
        postDate: new Date('2025-03-10'),
        postType: 'reel',
        contentTheme: 'private_events',
        caption: 'Our stunning private dining room is available for your next corporate dinner, wedding rehearsal, or milestone celebration.',
        impressions: 42000,
        reach: 38000,
        likes: 1240,
        comments: 89,
        saves: 891,
        shares: 234,
        profileVisits: 312,
        reservationClicks: 89,
        engagementRate: 0.051,
      },
      {
        organizationId: org.id,
        platform: 'instagram',
        accountHandle: '@rosewoodkitchen',
        postDate: new Date('2025-03-14'),
        postType: 'image',
        contentTheme: 'food',
        caption: 'Our dry-aged duck breast. Tuesday nights just got a reason to go out.',
        impressions: 28000,
        reach: 24000,
        likes: 1892,
        comments: 124,
        saves: 642,
        shares: 89,
        profileVisits: 204,
        engagementRate: 0.096,
      },
    ],
  })
  console.log('✓ Social post metrics created')

  // ── Activity Log ──────────────────────────────────────────────────────────
  await prisma.activityLog.createMany({
    data: [
      { organizationId: org.id, userId: admin.id, action: 'campaign.sent', entity: 'Campaign', details: { name: 'Thursday Happy Hour — Week 2', recipients: 1240 } },
      { organizationId: org.id, userId: admin.id, action: 'contact.imported', entity: 'ImportJob', details: { filename: 'loyalty-export.csv', imported: 231 } },
      { organizationId: org.id, userId: marketingUser.id, action: 'campaign.created', entity: 'Campaign', details: { name: 'Birthday Club — April' } },
    ],
  })
  console.log('✓ Activity log entries created')

  // ── Integration ───────────────────────────────────────────────────────────
  await prisma.integrationConnection.upsert({
    where: { organizationId_provider_accountId: { organizationId: org.id, provider: 'google', accountId: 'marketing@rosewood.com' } },
    update: {},
    create: {
      organizationId: org.id,
      provider: 'google',
      accountId: 'marketing@rosewood.com',
      accountName: 'Rosewood Group',
      accountEmail: 'marketing@rosewood.com',
      status: 'connected',
      scopes: ['gmail.send', 'gmail.readonly'],
      lastSyncAt: new Date(),
    },
  })
  console.log('✓ Integrations created')

  console.log('\n✅ Seed complete! Login with:')
  console.log('   Admin:     admin@rosewood.com / admin123')
  console.log('   Marketing: marketing@rosewood.com / test123\n')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async err => {
    console.error('❌ Seed error:', err)
    await prisma.$disconnect()
    process.exit(1)
  })
