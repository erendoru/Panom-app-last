import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET - List all updates (public: only published, admin: all)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const includeUnpublished = searchParams.get("all") === "true";
        const category = searchParams.get("category");

        let whereClause: any = {};

        if (includeUnpublished) {
            const session = await getSession();
            if (!session || session.role !== "ADMIN") {
                whereClause.published = true;
            }
        } else {
            whereClause.published = true;
        }

        if (category && category !== "Hepsi") {
            whereClause.category = category;
        }

        const updates = await prisma.update.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(updates);
    } catch (error) {
        console.error("Error fetching updates:", error);
        return NextResponse.json({ error: "Failed to fetch updates" }, { status: 500 });
    }
}

// POST - Create new update (admin only)
export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { title, content, category, imageUrl, published } = body;

        if (!title || !content || !category) {
            return NextResponse.json({ error: "Title, content and category are required" }, { status: 400 });
        }

        const update = await prisma.update.create({
            data: {
                title,
                content,
                category,
                imageUrl,
                published: published || false,
            },
        });

        return NextResponse.json(update);
    } catch (error) {
        console.error("Error creating update:", error);
        return NextResponse.json({ error: "Failed to create update" }, { status: 500 });
    }
}
