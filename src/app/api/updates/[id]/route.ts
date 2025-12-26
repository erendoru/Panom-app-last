import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET - Get single update by ID
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const update = await prisma.update.findUnique({
            where: { id: params.id },
        });

        if (!update) {
            return NextResponse.json({ error: "Update not found" }, { status: 404 });
        }

        if (!update.published) {
            const session = await getSession();
            if (!session || session.role !== "ADMIN") {
                return NextResponse.json({ error: "Update not found" }, { status: 404 });
            }
        }

        return NextResponse.json(update);
    } catch (error) {
        console.error("Error fetching update:", error);
        return NextResponse.json({ error: "Failed to fetch update" }, { status: 500 });
    }
}

// PUT - Update (admin only)
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { title, content, category, imageUrl, published } = body;

        const update = await prisma.update.update({
            where: { id: params.id },
            data: {
                title,
                content,
                category,
                imageUrl,
                published,
            },
        });

        return NextResponse.json(update);
    } catch (error) {
        console.error("Error updating:", error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

// DELETE - Delete update (admin only)
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.update.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting update:", error);
        return NextResponse.json({ error: "Failed to delete update" }, { status: 500 });
    }
}
