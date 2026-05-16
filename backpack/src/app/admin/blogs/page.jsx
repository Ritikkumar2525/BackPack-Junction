"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Image as ImageIcon, CheckCircle, Clock, ChevronLeft, Bold, Italic, List, ListOrdered, Heading2, Heading3, Quote } from "lucide-react";
import toast from "react-hot-toast";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-white/5 border-b border-cream/10 rounded-t-xl sticky top-0 z-10 backdrop-blur-md">
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run() }}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-cream/70'}`}
        title="Bold"
      >
        <Bold size={18} />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run() }}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-cream/70'}`}
        title="Italic"
      >
        <Italic size={18} />
      </button>
      <div className="w-px h-6 bg-cream/10 my-auto mx-1"></div>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run() }}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-cream/70'}`}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run() }}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-cream/70'}`}
        title="Heading 3"
      >
        <Heading3 size={18} />
      </button>
      <div className="w-px h-6 bg-cream/10 my-auto mx-1"></div>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run() }}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-cream/70'}`}
        title="Bullet List"
      >
        <List size={18} />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run() }}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-cream/70'}`}
        title="Ordered List"
      >
        <ListOrdered size={18} />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run() }}
        className={`p-2 rounded-lg transition-colors ${editor.isActive('blockquote') ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-cream/70'}`}
        title="Quote"
      >
        <Quote size={18} />
      </button>
    </div>
  );
};

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 'list' or 'editor'
  const [view, setView] = useState('list');
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    _id: null,
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    category: "Trek Guide",
    tags: "",
    author: "Backpack Junction Team",
    status: "published",
    isFeatured: false,
    readTime: 5,
    seoTitle: "",
    seoDescription: ""
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: false }),
      ImageExtension,
    ],
    content: formData.content,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, content: editor.getHTML() }));
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] p-5 lg:p-8',
      },
    },
  });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blogs");
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formDataObj = new FormData();
    formDataObj.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataObj,
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, coverImage: data.url }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch (error) {
      toast.error("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isEdit = !!formData._id;
      const url = isEdit ? `/api/admin/blogs/${formData._id}` : "/api/admin/blogs";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(isEdit ? "Blog updated successfully!" : "Blog created successfully!");
        setView('list');
        fetchBlogs();
      } else {
        toast.error(data.error || "Failed to save blog");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An error occurred while saving");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Blog deleted");
        fetchBlogs();
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const openEditor = (blog = null) => {
    const initialData = blog ? {
      _id: blog._id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage,
      category: blog.category,
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags,
      author: blog.author || "Backpack Junction Team",
      status: blog.status,
      isFeatured: blog.isFeatured || false,
      readTime: blog.readTime || 5,
      seoTitle: blog.seoTitle || "",
      seoDescription: blog.seoDescription || ""
    } : {
      _id: null,
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      category: "Trek Guide",
      tags: "",
      author: "Backpack Junction Team",
      status: "published",
      isFeatured: false,
      readTime: 5,
      seoTitle: "",
      seoDescription: ""
    };
    
    setFormData(initialData);
    if (editor) {
      editor.commands.setContent(initialData.content);
    }
    setView('editor');
  };

  if (view === 'editor') {
    return (
      <div className="space-y-5 max-w-7xl mx-auto pb-20">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between bg-[#0a1017] px-5 py-3.5 rounded-2xl border border-cream/10 sticky top-0 z-40 backdrop-blur-md gap-4">
          {/* Left: Back */}
          <button
            onClick={() => setView('list')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-cream/10 text-cream/60 hover:text-white transition-all duration-200 text-sm font-medium shrink-0"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Back to Blogs</span>
            <span className="sm:hidden">Back</span>
          </button>

          {/* Center: Title Preview */}
          <p className="text-cream/30 text-sm font-medium truncate hidden md:block flex-1 text-center px-4">
            {formData.title || "Untitled Story"}
          </p>

          {/* Right: Status pill + Save */}
          <div className="flex items-center gap-3 shrink-0">
            <span className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${formData.status === 'published' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-amber-400 bg-amber-400/10 border-amber-400/20'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${formData.status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              {formData.status === 'published' ? 'Published' : 'Draft'}
            </span>
            <button
              onClick={handleSubmit}
              disabled={isUploading}
              className="flex items-center gap-2 bg-burnt-orange hover:bg-burnt-orange/90 text-white text-sm px-5 py-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 shadow-md shadow-burnt-orange/20"
            >
              {formData._id ? "Save Changes" : "Publish"}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Column */}
          <div className="flex-1 space-y-6">
            <div className="bg-[#0a1017] p-6 sm:p-8 rounded-2xl border border-cream/10">
              <input 
                required 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                className="w-full bg-transparent border-b border-cream/10 focus:border-burnt-orange text-3xl sm:text-4xl font-bold font-[family-name:var(--font-heading)] text-white placeholder:text-cream/20 py-4 focus:outline-none transition-colors mb-8" 
                placeholder="Story Title..." 
              />
              
              <div className="mb-8">
                <label className="block text-sm font-semibold text-cream/90 mb-3">Short Excerpt (Summary)</label>
                <textarea 
                  required 
                  rows={2} 
                  value={formData.excerpt} 
                  onChange={e => setFormData({...formData, excerpt: e.target.value})} 
                  className="w-full bg-black/40 border border-cream/10 rounded-xl px-5 py-4 text-cream focus:outline-none focus:border-burnt-orange placeholder:text-cream/30 resize-none" 
                  placeholder="A brief compelling summary of the article..."
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-cream/90 mb-3">Blog Content</label>
                <div className="bg-[#0c131d] rounded-xl overflow-hidden border border-cream/10 shadow-inner">
                  <MenuBar editor={editor} />
                  <div className="cursor-text">
                    <EditorContent editor={editor} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="w-full lg:w-[350px] space-y-6">
            {/* Featured Image */}
            <div className="bg-[#0a1017] p-6 rounded-2xl border border-cream/10">
              <h3 className="font-bold text-cream mb-4">Featured Image</h3>
              <div className="flex flex-col gap-4">
                {formData.coverImage ? (
                  <div className="relative rounded-xl overflow-hidden aspect-video border border-cream/10 group">
                    <img src={formData.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <label className="cursor-pointer text-white text-sm font-medium bg-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition-colors">
                        Change Image
                        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="hidden" />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-cream/10 bg-black/20 hover:bg-black/40 hover:border-burnt-orange/50 transition-colors cursor-pointer text-cream/50 hover:text-cream/80">
                    <ImageIcon size={32} className="mb-2" />
                    <span className="text-sm font-medium">Click to upload image</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* Meta Details */}
            <div className="bg-[#0a1017] p-6 rounded-2xl border border-cream/10 space-y-5">
              <h3 className="font-bold text-cream mb-2">Publishing Details</h3>
              
              <div>
                <label className="block text-xs text-cream/50 mb-1.5 uppercase tracking-wider font-semibold">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-black/40 border border-cream/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-burnt-orange text-sm">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs text-cream/50 mb-1.5 uppercase tracking-wider font-semibold">Category *</label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black/40 border border-cream/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-burnt-orange text-sm">
                  <option value="Trek Guide">Trek Guide</option>
                  <option value="Hidden Destinations">Hidden Destinations</option>
                  <option value="Travel Tips">Travel Tips</option>
                  <option value="Spiritual Journeys">Spiritual Journeys</option>
                  <option value="Packing Lists">Packing Lists</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-cream/50 mb-1.5 uppercase tracking-wider font-semibold">Author</label>
                <input type="text" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="w-full bg-black/40 border border-cream/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-burnt-orange text-sm" />
              </div>

              <div>
                <label className="block text-xs text-cream/50 mb-1.5 uppercase tracking-wider font-semibold">Read Time (mins)</label>
                <input type="number" min="1" value={formData.readTime} onChange={e => setFormData({...formData, readTime: e.target.value})} className="w-full bg-black/40 border border-cream/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-burnt-orange text-sm" />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-cream/10">
                <input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="w-4 h-4 accent-burnt-orange rounded" />
                <label htmlFor="isFeatured" className="text-sm text-cream cursor-pointer">Feature on main page</label>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="bg-[#0a1017] p-6 rounded-2xl border border-cream/10 space-y-5">
              <h3 className="font-bold text-cream mb-2">Advanced / SEO</h3>
              
              <div>
                <label className="block text-xs text-cream/50 mb-1.5 uppercase tracking-wider font-semibold">URL Slug</label>
                <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-black/40 border border-cream/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-burnt-orange text-sm font-mono placeholder:text-cream/20" placeholder="auto-generates-if-empty" />
              </div>

              <div>
                <label className="block text-xs text-cream/50 mb-1.5 uppercase tracking-wider font-semibold">Tags (comma separated)</label>
                <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full bg-black/40 border border-cream/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-burnt-orange text-sm placeholder:text-cream/20" placeholder="himalayas, winter, snow" />
              </div>

              <div>
                <label className="block text-xs text-cream/50 mb-1.5 uppercase tracking-wider font-semibold">SEO Title</label>
                <input type="text" value={formData.seoTitle} onChange={e => setFormData({...formData, seoTitle: e.target.value})} className="w-full bg-black/40 border border-cream/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-burnt-orange text-sm" />
              </div>

              <div>
                <label className="block text-xs text-cream/50 mb-1.5 uppercase tracking-wider font-semibold">SEO Description</label>
                <textarea rows={3} value={formData.seoDescription} onChange={e => setFormData({...formData, seoDescription: e.target.value})} className="w-full bg-black/40 border border-cream/10 rounded-lg px-4 py-2.5 text-cream focus:outline-none focus:border-burnt-orange text-sm resize-none" />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // --- List View ---
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-[#0a1017] p-6 sm:p-8 rounded-2xl border border-cream/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-heading)]">Blog Management</h1>
          <p className="text-cream/50 text-sm mt-2">Manage articles, guides, and cinematic travel stories.</p>
        </div>
        <button
          onClick={() => openEditor()}
          className="flex items-center gap-2 bg-burnt-orange hover:bg-burnt-orange/90 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-colors shadow-lg shadow-burnt-orange/20"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Write Story</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-32 text-cream/50">
          <div className="w-10 h-10 border-4 border-burnt-orange border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <div key={blog._id} className="bg-[#0a1017] border border-cream/10 rounded-2xl overflow-hidden group hover:border-cream/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="aspect-video relative overflow-hidden bg-gray-900 border-b border-cream/10">
                {blog.coverImage ? (
                  <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon size={40} className="text-cream/20" /></div>
                )}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold text-cream border border-white/10">
                    {blog.category}
                  </span>
                  {blog.isFeatured && (
                    <span className="bg-burnt-orange/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold text-white shadow-lg">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-3 text-[11px] font-semibold tracking-wider uppercase text-cream/50 mb-4">
                  {blog.status === "published" ? (
                    <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md"><CheckCircle size={12}/> Published</span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-amber-400 bg-amber-400/10 px-2 py-1 rounded-md"><Clock size={12}/> Draft</span>
                  )}
                  <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                
                <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] line-clamp-2 mb-3 leading-snug group-hover:text-burnt-orange transition-colors">{blog.title}</h3>
                <p className="text-sm text-cream/60 line-clamp-2 mb-8 leading-relaxed">{blog.excerpt}</p>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-cream/5">
                  <button onClick={() => openEditor(blog)} className="flex items-center gap-2 px-4 py-2 hover:bg-cream/10 rounded-lg text-sm font-medium text-cream/80 hover:text-white transition-colors">
                    <Edit2 size={16} /> Edit
                  </button>
                  <button onClick={() => handleDelete(blog._id)} className="flex items-center gap-2 px-4 py-2 hover:bg-red-500/20 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {blogs.length === 0 && (
            <div className="col-span-full text-center py-32 text-cream/40 bg-[#0a1017] rounded-2xl border border-cream/5 border-dashed">
              <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">No blogs found.</p>
              <p className="text-sm mt-1">Click "Write Story" to publish your first cinematic journey.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
