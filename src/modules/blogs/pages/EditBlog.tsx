import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useBlogStore } from "../blogStore";
import { calculateWordCount, calculateReadingTime } from "../blogUtils";
import { RichTextEditor } from "../components/RichTextEditor";
import { ArrowLeft, Save, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Blog } from "@/services/blogService";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBlogById, updateBlog } = useBlogStore();
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const loadBlog = async () => {
      setLoading(true);
      try {
        const existingBlog = getBlogById(id || "");
        if (existingBlog) {
          setBlog(existingBlog);
          setCoverPreview(existingBlog.coverImage || existingBlog.featured_image || "");
        } else {
          // If not in store, fetch from API
          const fetchedBlog = await blogService.getById(id || "");
          if (fetchedBlog) {
            setBlog({
              ...fetchedBlog,
              name: fetchedBlog.title,
              description: fetchedBlog.content,
              coverImage: fetchedBlog.featured_image
            });
            setCoverPreview(fetchedBlog.featured_image || "");
          } else {
            toast.error("Blog post not found");
            navigate("/blogs");
          }
        }
      } catch (error) {
        toast.error("Error loading blog post");
        navigate("/blogs");
      } finally {
        setLoading(false);
      }
    };
    
    loadBlog();
  }, [id, getBlogById, navigate]);

  const [coverPreview, setCoverPreview] = useState<string>("");
  const [coverFile, setCoverFile] = useState<File | null>(null);

  if (!blog) return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;

  const wordCount = calculateWordCount(blog.description);
  const readingTime = calculateReadingTime(blog.description);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.includes("webp") && !file.type.includes("image/")) {
      toast.error("Please upload an image file (preferably WebP)");
      return;
    }
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
    setCoverFile(file);
    setBlog({ ...blog, coverImage: url });
  };

  const handleSave = async () => {
    if (!blog.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setLoading(true);
    try {
      await updateBlog(id!, {
        ...blog,
        wordCount,
        coverFile,
      });
      toast.success("Blog post updated successfully");
      navigate("/blogs");
    } catch (error) {
      toast.error("Failed to update blog post");
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
          title="Edit Blog Post"
          description="Update your blog content and settings."
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
                  value={blog.title}
                  onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  placeholder="blog-post-slug"
                  value={blog.slug}
                  onChange={(e) => setBlog({ ...blog, slug: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief summary for list view"
                  value={blog.excerpt}
                  onChange={(e) => setBlog({ ...blog, excerpt: e.target.value })}
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
                  content={blog.description} 
                  onChange={(content) => setBlog({ ...blog, description: content })}
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
                  value={blog.metaTitle}
                  onChange={(e) => setBlog({ ...blog, metaTitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  placeholder="SEO Description"
                  value={blog.metaDescription}
                  onChange={(e) => setBlog({ ...blog, metaDescription: e.target.value })}
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
                          setBlog({ ...blog, coverImage: "" });
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
                  value={blog.category}
                  onChange={(e) => setBlog({ ...blog, category: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={blog.status}
                  onChange={(e) => setBlog({ ...blog, status: e.target.value as "draft" | "published" | "archived" })}
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
                  Update Post
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
