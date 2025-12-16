const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'erendoru@hotmail.com';
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (user) {
        console.log(`User found: ${user.email}, Role: ${user.role}`);
    } else {
        console.log(`User with email ${email} not found.`);
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
