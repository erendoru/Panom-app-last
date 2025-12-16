import prisma from '../src/lib/prisma';

async function updateAdminRole() {
    try {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: 'erendoru@hotmail.com' }
        });

        if (!user) {
            console.log('❌ User not found with email: erendoru@hotmail.com');
            console.log('Please make sure you registered with this email.');
            return;
        }

        console.log('✅ User found:', user.email);
        console.log('Current role:', user.role);

        // Update role to ADMIN
        const updated = await prisma.user.update({
            where: { email: 'erendoru@hotmail.com' },
            data: { role: 'ADMIN' }
        });

        console.log('✅ Role updated successfully!');
        console.log('New role:', updated.role);
        console.log('\nYou can now login as ADMIN with:');
        console.log('Email: erendoru@hotmail.com');
        console.log('Password: (your registered password)');
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateAdminRole();
