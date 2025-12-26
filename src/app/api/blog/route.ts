import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET - List all blog posts (public: only published, admin: all)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const includeUnpublished = searchParams.get("all") === "true";

        let whereClause = {};

        if (includeUnpublished) {
            // Check if user is admin
            const session = await getSession();
            if (!session || session.role !== "ADMIN") {
                whereClause = { published: true };
            }
        } else {
            whereClause = { published: true };
        }

        const posts = await prisma.blogPost.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}

// POST - Create new blog post (admin only)
export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { title, slug, content, excerpt, imageUrl, published } = body;

        if (!title || !slug || !content) {
            return NextResponse.json({ error: "Title, slug and content are required" }, { status: 400 });
        }

        const post = await prisma.blogPost.create({
            data: {
                title,
                slug,
                content,
                excerpt,
                imageUrl,
                published: published || false,
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error("Error creating blog post:", error);
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}
