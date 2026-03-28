import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { blogs as initialBlogs, Blog } from "@/lib/mock-data";
import { Plus, Pencil, Trash2, FileText, Search, Upload, X } from "lucide-react";
import { toast } from "sonner";

const emptyBlog: Omit<Blog, "id" | "views" | "publishedAt" | "author"> = {
  title: "",
  excerpt: "",
  description: "",
  status: "draft",
  category: "",
  coverImage: "",
  metaTitle: "",
  metaDescription: "",
  wordCount: 0,
};

export default function BlogsPage() {
  const [blogList, setBlogList] = useState<Blog[]>(initialBlogs);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyBlog);
  const [search, setSearch] = useState("");
  const [coverPreview, setCoverPreview] = useState<string>("");

  const filtered = blogList.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  const wordCount = form.description.split(/\s+/).filter(Boolean).length;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.includes("webp")) {
      toast.error("Only WebP images are allowed");
      return;
    }
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
    setForm({ ...form, coverImage: url });
  };

  const handleEdit = (blog: Blog) => {
    setEditing(blog);
    setCreating(false);
    setForm({
      title: blog.title,
      excerpt: blog.excerpt,
      description: blog.description,
      status: blog.status,
      category: blog.category,
      coverImage: blog.coverImage || "",
      metaTitle: blog.metaTitle,
      metaDescription: blog.metaDescription,
      wordCount: blog.wordCount,
    });
    setCoverPreview(blog.coverImage || "");
  };

  const handleCreate = () => {
    setCreating(true);
    setEditing(null);
    setForm(emptyBlog);
    setCoverPreview("");
  };

  const handleCancel = () => {
    setCreating(false);
    setEditing(null);
    setForm(emptyBlog);
    setCoverPreview("");
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (wordCount < 1000) {
      toast.error(`Minimum 1000 words required. Current: ${wordCount}`);
      return;
    }

    if (editing) {
      setBlogList((prev) =>
        prev.map((b) =>
          b.id === editing.id
            ? { ...b, ...form, wordCount }
            : b
        )
      );
      toast.success("Blog post updated");
    } else {
      const newBlog: Blog = {
        id: String(Date.now()),
        ...form,
        wordCount,
        views: 0,
        author: "Admin",
        publishedAt: new Date().toISOString().split("T")[0],
      };
      setBlogList((prev) => [...prev, newBlog]);
      toast.success("Blog post created");
    }
    handleCancel();
  };

  const handleDelete = (id: string) => {
    setBlogList((prev) => prev.filter((b) => b.id !== id));
    toast.success("Blog post deleted");
  };

  const showForm = creating || editing;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Blogs"
        description="Viralstan Admin · Saturday, 28 March 2026"
      />

      {/* Search + New Post */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          className="gradient-primary text-primary-foreground border-0"
          onClick={handleCreate}
        >
          <Plus className="h-4 w-4 mr-1.5" /> New Post
        </Button>
      </div>

      {/* Edit/Create Form */}
      {showForm && (
        <div className="mb-6 rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-lg font-semibold">
            {editing ? "Edit Blog Post" : "New Blog Post"}
          </h3>

          {/* Cover Image */}
          <div>
            <label className="text-sm font-medium text-primary mb-1.5 block">
              Cover Image (WebP)
            </label>
            <div
              className="relative border-2 border-dashed border-primary/30 rounded-xl bg-primary/5 flex items-center justify-center min-h-[140px] cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() =>
                document.getElementById("cover-upload")?.click()
              }
            >
              {coverPreview ? (
                <div className="relative w-full">
                  <img
                    src={coverPreview}
                    alt="Cover"
                    className="w-full h-36 object-cover rounded-lg"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCoverPreview("");
                      setForm({ ...form, coverImage: "" });
                    }}
                    className="absolute top-2 right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
                  <Upload className="h-6 w-6" />
                  <span className="text-sm">Click to upload image</span>
                </div>
              )}
              <input
                id="cover-upload"
                type="file"
                accept="image/webp"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-primary mb-1.5 block">Title</label>
            <Input
              placeholder="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-primary mb-1.5 block">Category</label>
            <Input
              placeholder="SEO"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-primary">Description</label>
              <span className={`text-xs ${wordCount < 1000 ? "text-destructive" : "text-muted-foreground"}`}>
                {wordCount} / 1000 words
              </span>
            </div>
            <Textarea
              placeholder="Write your blog content here... (minimum 1000 words)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="min-h-[160px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-primary mb-1.5 block">Meta Title</label>
            <Input
              placeholder="meta Title"
              value={form.metaTitle}
              onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-primary mb-1.5 block">Meta Description</label>
            <Input
              placeholder="meta Description"
              value={form.metaDescription}
              onChange={(e) =>
                setForm({ ...form, metaDescription: e.target.value })
              }
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              className="gradient-primary text-primary-foreground border-0"
              onClick={handleSave}
            >
              {editing ? "Update" : "Create"}
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Cover
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Words
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((blog) => (
              <tr
                key={blog.id}
                className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
              >
                <td className="px-4 py-3">
                  {blog.coverImage ? (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium">{blog.title}</span>
                </td>
                <td className="px-4 py-3">
                  {blog.category ? (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {blog.category}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-muted-foreground">
                    {Math.ceil(blog.wordCount / 1000)}w
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No blog posts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
