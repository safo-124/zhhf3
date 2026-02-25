import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post || !post.published) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Increment views
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    // Get related posts (same category, exclude current)
    const related = await prisma.blogPost.findMany({
      where: {
        published: true,
        category: post.category,
        id: { not: post.id },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    return NextResponse.json({ post: { ...post, views: post.views + 1 }, related });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}
