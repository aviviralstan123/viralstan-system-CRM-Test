import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useBlogStore } from "../blogStore";
import { generateSlug, calculateWordCount, calculateReadingTime } from "../blogUtils";
import { RichTextEditor } from "../components/RichTextEditor";
import { ArrowLeft, Save, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CreateBlog() {
  const navigate = useNavigate();
  const { addBlog } = useBlogStore();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    description: "",
    status: "draft" as "draft" | "published" | "archived",
    category: "",
    coverImage: "",
    metaTitle: "",
    metaDescription: "",
    author: "Admin",
  });

  const [coverPreview, setCoverPreview] = useState<string>("");

  useEffect(() => {
    if (form.title) {
      setForm((prev) => ({ ...prev, slug: generateSlug(form.title) }));
    }
  }, [form.title]);

  const wordCount = calculateWordCount(form.description);
  const readingTime = calculateReadingTime(form.description);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.includes("webp") && !file.type.includes("image/")) {
      toast.error("Please upload an image file (preferably WebP)");
      return;
    }
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
    setForm({ ...form, coverImage: url });
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setLoading(true);
    try {
      await addBlog({
        ...form,
        wordCount,
      });
      toast.success("Blog post created successfully");
      navigate("/blogs");
    } catch (error) {
      toast.error("Failed to create blog post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/blogs")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title="Create New Post"
          description="Fill in the details below to create a new blog post."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter blog title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (auto-generated)</Label>
                <Input
                  id="slug"
                  placeholder="blog-post-slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief summary for list view"
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="h-20"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Content</Label>
                  <span className="text-xs text-muted-foreground">
                    {wordCount} words • {readingTime} min read
                  </span>
                </div>
                <RichTextEditor 
                  content={form.description} 
                  onChange={(content) => setForm({ ...form, description: content })}
                  placeholder="Start writing your masterpiece..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-semibold">SEO Settings</h3>
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  placeholder="SEO Title"
                  value={form.metaTitle}
                  onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  placeholder="SEO Description"
                  value={form.metaDescription}
                  onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <div
                  className="relative border-2 border-dashed border-primary/30 rounded-xl bg-primary/5 flex items-center justify-center min-h-[160px] cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => document.getElementById("cover-upload")?.click()}
                >
                  {coverPreview ? (
                    <div className="relative w-full">
                      <img
                        src={coverPreview}
                        alt="Cover"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCoverPreview("");
                          setForm({ ...form, coverImage: "" });
                        }}
                        className="absolute top-2 right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-lg"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
                      <Upload className="h-6 w-6" />
                      <span className="text-sm">Click to upload image</span>
                      <span className="text-xs">WebP recommended</span>
                    </div>
                  )}
                  <input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g. SEO, Marketing"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" | "archived" })}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="pt-4 flex flex-col gap-2">
                <Button 
                  className="w-full gradient-primary" 
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Post
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate("/blogs")}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
