const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'erendoru@hotmail.com';

    // Upsert user: create if not exists, update if exists
    const user = await prisma.user.upsert({
        where: { email },
        update: { role: 'ADMIN' },
        create: {
            email,
            name: 'Eren Doru',
            role: 'ADMIN',
            passwordHash: 'managed-by-supabase-auth', // Dummy value as Supabase handles auth
        },
    });

    console.log(`User ${user.email} upserted with role ${user.role}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
