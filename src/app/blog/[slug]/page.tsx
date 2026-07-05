import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
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
      <article style={{ maxWidth: 760, margin: "0 auto", padding: "64px 32px 96px" }}>
        <Link href="/blog" className="footer-link" style={{ textDecoration: "none", color: "var(--olive-600)", fontSize: 14, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 28 }}>→ العودة إلى المدونة</Link>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--olive-600)", marginBottom: 14 }}>{post.category}</div>
        <h1 style={{ fontSize: "clamp(30px,4.4vw,48px)", fontWeight: 700, lineHeight: 1.3, margin: "0 0 16px", color: "var(--ink)" }}>{post.title}</h1>
        <div style={{ fontSize: 14, color: "var(--ink-subtle)", marginBottom: 32 }}>{formatArabicDate(post.published_at)}</div>
        {post.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover_url} alt={post.title} style={{ width: "100%", height: "clamp(220px,38vw,420px)", objectFit: "cover", borderRadius: 18, display: "block", marginBottom: 36 }} />
        )}
        <div className="post-body">
          {post.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </article>
    </PageShell>
  );
}
