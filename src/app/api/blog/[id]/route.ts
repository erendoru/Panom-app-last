import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET - Get single blog post by ID or slug
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const post = await prisma.blogPost.findFirst({
            where: {
                OR: [
                    { id: params.id },
                    { slug: params.id },
                ],
            },
        });

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // If not published, only admin can see
        if (!post.published) {
            const session = await getSession();
            if (!session || session.role !== "ADMIN") {
                return NextResponse.json({ error: "Post not found" }, { status: 404 });
            }
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error("Error fetching blog post:", error);
        return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
    }
}

// PUT - Update blog post (admin only)
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
        const { title, slug, content, excerpt, imageUrl, published } = body;

        const post = await prisma.blogPost.update({
            where: { id: params.id },
            data: {
                title,
                slug,
                content,
                excerpt,
                imageUrl,
                published,
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error("Error updating blog post:", error);
        return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    }
}

// DELETE - Delete blog post (admin only)
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.blogPost.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting blog post:", error);
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
}
