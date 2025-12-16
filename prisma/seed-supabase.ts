import { PrismaClient, PanelType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    // 1. Create Static Panels
    const panels = [
        {
            name: "Mecidiyeköy Meydan Dev Ekran",
            type: PanelType.MEGABOARD,
            city: "İstanbul",
            district: "Şişli",
            address: "Büyükdere Cd. No:123",
            latitude: 41.0655,
            longitude: 29.0000,
            width: 12.5,
            height: 6.0,
            priceWeekly: 15000,
            imageUrl: "https://images.unsplash.com/photo-1562619425-c307bb83bc42?q=80&w=2070&auto=format&fit=crop",
            active: true,
        },
        {
            name: "Kadıköy Boğa Heykeli Yanı",
            type: PanelType.CLP,
            city: "İstanbul",
            district: "Kadıköy",
            address: "Söğütlüçeşme Cd.",
            latitude: 40.9900,
            longitude: 29.0250,
            width: 1.2,
            height: 1.8,
            priceWeekly: 3500,
            imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
            active: true,
        },
        {
            name: "Beşiktaş İskele Totem",
            type: PanelType.YOL_PANOSU,
            city: "İstanbul",
            district: "Beşiktaş",
            address: "Barbaros Blv.",
            latitude: 41.0420,
            longitude: 29.0060,
            width: 4.0,
            height: 8.0,
            priceWeekly: 8000,
            imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
            active: true,
        },
        {
            name: "Levent Metro Çıkışı",
            type: PanelType.BILLBOARD,
            city: "İstanbul",
            district: "Beşiktaş",
            address: "Büyükdere Cd.",
            latitude: 41.0750,
            longitude: 29.0150,
            width: 3.5,
            height: 2.0,
            priceWeekly: 5000,
            imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop",
            active: true,
        },
        {
            name: "Bağdat Caddesi Raket",
            type: PanelType.CLP,
            city: "İstanbul",
            district: "Kadıköy",
            address: "Bağdat Cd. Suadiye",
            latitude: 40.9600,
            longitude: 29.0800,
            width: 1.2,
            height: 1.8,
            priceWeekly: 4000,
            imageUrl: "https://images.unsplash.com/photo-1520116468816-95b69f847357?q=80&w=1974&auto=format&fit=crop",
            active: true,
        }
    ];

    for (const panel of panels) {
        await prisma.staticPanel.create({
            data: panel,
        });
    }

    console.log("Seeding completed.");
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
