import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.job.deleteMany();
  await prisma.reporter.deleteMany();
  await prisma.editor.deleteMany();

  await prisma.reporter.createMany({
    data: [
      { name: 'Budi Santoso', city: 'Jakarta', ratePerMinute: 2000 },
      { name: 'Siti Rahayu', city: 'Surabaya', ratePerMinute: 2000 },
      { name: 'Ahmad Fauzi', city: 'Bandung', ratePerMinute: 2000 },
      { name: 'Dewi Lestari', city: 'Jakarta', ratePerMinute: 2500 },
    ],
  });

  await prisma.editor.createMany({
    data: [
      { name: 'Rina Marlina', flatFee: 50000 },
      { name: 'Hendra Wijaya', flatFee: 75000 },
    ],
  });

  console.log('Seeded 4 reporters and 2 editors');
}

main()
  .then(() => {
    console.log('Seed complete');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
