import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = [
    { firstname: 'John', lastname: 'Doe', phone: '0432654876', dob: '2000-12-12' },
    { firstname: 'Jane', lastname: 'Doe', phone: '0987654321', dob: '1995-10-20' }
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
