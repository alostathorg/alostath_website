import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { getPost, getPosts } from "@/lib/queries";
import { formatArabicDate } from "@/lib/format";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return { title: post?.title ?? "المدونة", description: post?.excerpt ?? undefined };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <PageShell active="blog">
      <PageHero
        crumbs={[{ label: "المدونة", href: "/blog" }, { label: post.title }]}
        eyebrow={post.category}
        title={post.title}
        image={post.cover_url}
        imageOpacity={0.34}
        lede={post.excerpt || undefined}
        meta={<div className="ph-date">{formatArabicDate(post.published_at)}</div>}
      />
      <article style={{ maxWidth: 760, margin: "0 auto", padding: "64px 32px 96px" }}>
        <div className="post-body">
          {post.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <Link href="/blog" className="arrow-link" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 44, textDecoration: "none", color: "var(--olive-600)", fontSize: 15, fontWeight: 600 }}>→ العودة إلى المدونة</Link>
      </article>
    </PageShell>
  );
}
