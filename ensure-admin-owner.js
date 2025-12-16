const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'erendoru@hotmail.com';

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.log("Admin user not found, please run create-admin.js first");
        return;
    }

    // Upsert ScreenOwner profile
    const owner = await prisma.screenOwner.upsert({
        where: { userId: user.id },
        update: {},
        create: {
            userId: user.id,
            companyName: 'Panom Admin',
            approved: true,
            address: 'Admin Center',
        },
    });

    console.log(`ScreenOwner profile ensured for ${user.email}:`, owner);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
