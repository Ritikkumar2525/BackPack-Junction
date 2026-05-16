import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, ChevronLeft, Share2, Tag } from "lucide-react";
import connectMongo from "@/lib/mongodb";
import { Blog } from "@/lib/blogs";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import ShareButton from "./ShareButton";

export async function generateMetadata(props) {
  const params = await props.params;
  const { slug } = params;
  await connectMongo();
  const blog = await Blog.findOne({ slug, status: "published" });

  if (!blog) {
    return { title: "Blog Not Found | Backpack Junction" };
  }

  return {
    title: `${blog.seoTitle || blog.title} | Backpack Junction`,
    description: blog.seoDescription || blog.excerpt,
    openGraph: {
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription || blog.excerpt,
      images: [blog.coverImage],
    },
  };
}

export default async function BlogDetailPage(props) {
  const params = await props.params;
  const { slug } = params;
  await connectMongo();
  
  // Find blog and increment views (note: in a highly cached production environment, 
  // you might want to do view increments via a separate client-side API call instead 
  // of during SSR, but this works for standard dynamic rendering)
  const blog = await Blog.findOneAndUpdate(
    { slug, status: "published" },
    { $inc: { views: 1 } },
    { returnDocument: "after" }
  );

  if (!blog) {
    notFound();
  }

  // Fetch 3 related blogs
  const relatedBlogs = await Blog.find({ 
    category: blog.category, 
    _id: { $ne: blog._id },
    status: "published"
  }).limit(3);

  return (
    <main className="min-h-screen bg-transparent text-cream">
      <Navbar />

      <article className="pt-20 lg:pt-24 pb-16">
        {/* Back Button */}
        <div className="max-w-6xl mx-auto px-6 mb-6">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-cream/70 hover:text-white backdrop-blur-md transition-all duration-300 text-sm font-medium group w-fit"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Stories</span>
          </Link>
        </div>

        {/* Header Section */}
        <header className="max-w-4xl mx-auto px-6 text-center mb-8">
          
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="bg-white/5 border border-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[2px] text-teal-400">
              {blog.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-heading)] leading-tight mb-6">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-cream/60 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-burnt-orange to-[#8a5020] flex items-center justify-center text-white font-bold shadow-lg">
                {blog.author?.charAt(0) || "B"}
              </div>
              <span className="font-medium text-cream">{blog.author}</span>
            </div>
            <span className="hidden sm:block">•</span>
            <span className="flex items-center gap-2"><Calendar size={16} /> {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span className="hidden sm:block">•</span>
            <span className="flex items-center gap-2"><Clock size={16} /> {blog.readTime} min read</span>
          </div>
        </header>

        {/* Hero Image */}
        <div className="max-w-6xl mx-auto px-6 mb-10">
          <div className="relative w-full aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
            <Image
              src={blog.coverImage || "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b"}
              alt={blog.title}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-3xl mx-auto px-6">
          <div className="blog-content">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>

          {/* Tags & Share */}
          <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap gap-2">
              {blog.tags?.map((tag, i) => (
                <span key={i} className="flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs text-cream/70">
                  <Tag size={12} /> {tag}
                </span>
              ))}
            </div>
            
            <ShareButton title={blog.title} />
          </div>
        </div>
      </article>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <section className="bg-[#0a1017] py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-12 text-center">More from {blog.category}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedBlogs.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post._id} className="block h-full">
                  <article className="group h-full flex flex-col bg-[#0C1420] border border-white/5 rounded-[24px] overflow-hidden hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] transition-all duration-500 transform-gpu hover:-translate-y-2">
                    <div className="relative h-56 w-full overflow-hidden bg-gray-900">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-8 flex flex-col flex-1">
                      <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-white mb-3 group-hover:text-burnt-orange transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-cream/50 text-sm line-clamp-2 flex-1 mb-6">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto flex items-center justify-between text-cream/40 text-xs font-medium border-t border-white/5 pt-4">
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime} min</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
