import { PrismaClient, PanelType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
};

async function main() {
    const password = await hashPassword("admin123");

    // Create Admin
    const admin = await prisma.user.upsert({
        where: { email: "admin@panom.com" },
        update: {},
        create: {
            email: "admin@panom.com",
            passwordHash: password,
            role: "ADMIN",
            name: "Sistem Yöneticisi",
        },
    });

    console.log({ admin });

    // Create Demo Screen Owner
    const ownerUser = await prisma.user.upsert({
        where: { email: "owner@medya.com" },
        update: {},
        create: {
            email: "owner@medya.com",
            passwordHash: password,
            role: "SCREEN_OWNER",
            name: "Ahmet Yılmaz",
            screenOwnerProfile: {
                create: {
                    companyName: "Mega Medya A.Ş.",
                    approved: true,
                }
            }
        },
        include: { screenOwnerProfile: true }
    });

    // Create Demo Screens
    if (ownerUser.screenOwnerProfile) {
        await prisma.screen.createMany({
            data: [
                {
                    ownerId: ownerUser.screenOwnerProfile.id,
                    name: "Kadıköy Boğa Meydanı LED",
                    city: "İstanbul",
                    district: "Kadıköy",
                    address: "Söğütlüçeşme Cd. No:15",
                    latitude: 40.9901,
                    longitude: 29.0291,
                    resolutionWidth: 1920,
                    resolutionHeight: 1080,
                    orientation: "LANDSCAPE",
                    basePricePerPlay: 1.50,
                    active: true,
                    previewImageUrl: "https://placehold.co/800x450/2563eb/white?text=Kadikoy+LED",
                    maxPlaysPerHour: 360
                },
                {
                    ownerId: ownerUser.screenOwnerProfile.id,
                    name: "Beşiktaş İskele Dev Ekran",
                    city: "İstanbul",
                    district: "Beşiktaş",
                    address: "Barbaros Blv. No:1",
                    latitude: 41.0422,
                    longitude: 29.0060,
                    resolutionWidth: 1080,
                    resolutionHeight: 1920,
                    orientation: "PORTRAIT",
                    basePricePerPlay: 2.00,
                    active: true,
                    previewImageUrl: "https://placehold.co/450x800/dc2626/white?text=Besiktas+LED",
                    maxPlaysPerHour: 360
                }
            ]
        });
    }

    // Create Static Panels
    await prisma.staticPanel.createMany({
        data: [
            {
                name: "E-5 Göztepe Köprüsü Yanı",
                city: "İstanbul",
                district: "Kadıköy",
                address: "E-5 Karayolu Göztepe Mevkii",
                latitude: 40.9859,
                longitude: 29.0546,
                width: 10,
                height: 4,
                priceWeekly: 15000,
                active: true,
                type: PanelType.BILLBOARD,
                imageUrl: "https://placehold.co/800x400/orange/white?text=Static+Billboard+1"
            },
            {
                name: "Bağdat Caddesi Suadiye",
                city: "İstanbul",
                district: "Kadıköy",
                address: "Bağdat Cd. No:345",
                latitude: 40.9632,
                longitude: 29.0837,
                width: 3,
                height: 2,
                priceWeekly: 8000,
                active: true,
                type: "CLP",
                imageUrl: "https://placehold.co/600x400/orange/white?text=Raket+Pano"
            },
            {
                name: "15 Temmuz Şehitler Köprüsü Çıkışı",
                city: "İstanbul",
                district: "Beşiktaş",
                address: "Köprü Çıkışı Zincirlikuyu Yönü",
                latitude: 41.0665,
                longitude: 29.0182,
                width: 12,
                height: 5,
                priceWeekly: 25000,
                active: true,
                type: "MEGABOARD",
                imageUrl: "https://placehold.co/800x400/orange/white?text=Megaboard"
            }
        ]
    });

    console.log("Seed data created successfully");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
