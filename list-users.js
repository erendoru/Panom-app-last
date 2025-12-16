const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    console.log('Total users:', users.length);
    users.forEach(u => {
        console.log(`- ${u.email} (${u.role})`);
    });

    if (users.length === 0) {
        console.log("No users found. Database might have been reset.");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
