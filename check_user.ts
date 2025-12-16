
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'ecedoru@hotmail.com';
    const user = await prisma.user.findUnique({
        where: { email },
    });
    console.log('User found:', user);

    if (!user) {
        console.log('User does not exist in DB.');
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
