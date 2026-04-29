import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GalleryImage {
  id: number;
  image_url: string;
  package_type: string;
  section: "top" | "bottom";
  order_index: number;
}

export default function ORMPackagesPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Create / Edit modal state (can use inline for simple UI as per user request)
  // "Row has: Image Preview, Order Input, Edit Button (replace image), Delete Button"
  
  const fetchImages = async () => {
    try {
      const res = await fetch("/api/packages-gallery?type=orm", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setImages(data.data);
      } else {
        toast.error("Failed to fetch images");
      }
    } catch (err) {
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleAddImage = async (section: "top" | "bottom") => {
    const sectionImages = images.filter(img => img.section === section);
    if (section === "top" && sectionImages.length >= 5) {
      toast.error("Top section can only have a maximum of 5 images.");
      return;
    }
    if (section === "bottom" && sectionImages.length >= 6) {
      toast.error("Bottom section can only have a maximum of 6 images.");
      return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);
      formData.append("package_type", "orm");
      formData.append("section", section);
      formData.append("order_index", String(sectionImages.length + 1));

      setSaving(true);
      try {
        const res = await fetch("/api/packages-gallery", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          toast.success("Image added successfully");
          fetchImages();
        } else {
          toast.error(data.message || "Failed to add image");
        }
      } catch (err) {
        toast.error("Error adding image");
      } finally {
        setSaving(false);
      }
    };
    input.click();
  };

  const handleUpdateImage = async (id: number, file?: File, order_index?: number) => {
    const formData = new FormData();
    if (file) formData.append("image", file);
    if (order_index !== undefined) formData.append("order_index", String(order_index));

    try {
      const res = await fetch(`/api/packages-gallery/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Image updated successfully");
        fetchImages();
      } else {
        toast.error(data.message || "Failed to update image");
      }
    } catch (err) {
      toast.error("Error updating image");
    }
  };

  const handleReplaceImageClick = (id: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      setSaving(true);
      await handleUpdateImage(id, file);
      setSaving(false);
    };
    input.click();
  };

  const handleOrderChange = (id: number, order_index: number) => {
    // Optimistic update locally
    setImages(prev => prev.map(img => img.id === id ? { ...img, order_index } : img));
    handleUpdateImage(id, undefined, order_index);
  };

  const handleDeleteImage = async (id: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(`/api/packages-gallery/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Image deleted");
        setImages(prev => prev.filter(img => img.id !== id));
      } else {
        toast.error(data.message || "Failed to delete image");
      }
    } catch (err) {
      toast.error("Error deleting image");
    }
  };

  const renderSection = (title: string, section: "top" | "bottom", maxCount: number, desc: string) => {
    const sectionImages = images.filter(img => img.section === section).sort((a, b) => a.order_index - b.order_index);

    return (
      <div className="rounded-xl border border-border bg-card shadow-sm mb-8 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border p-6 bg-muted/20">
          <div>
            <h2 className="text-lg font-semibold">{title} ({maxCount})</h2>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
          <Button 
            variant="outline" 
            className="text-primary hover:text-primary hover:bg-primary/5"
            onClick={() => handleAddImage(section)}
            disabled={sectionImages.length >= maxCount || saving}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Image
          </Button>
        </div>
        
        <div className="p-0">
          <div className="w-full">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-muted/40 text-sm font-medium text-muted-foreground">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Preview</div>
              <div className="col-span-4">Order</div>
              <div className="col-span-2">Actions</div>
            </div>
            
            {sectionImages.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                <p>No images added yet.</p>
              </div>
            ) : (
              sectionImages.map((img, idx) => (
                <div key={img.id} className="grid grid-cols-12 gap-4 p-4 items-center border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                  <div className="col-span-1 text-sm font-medium">{idx + 1}</div>
                  <div className="col-span-5">
                    <div className="h-16 w-32 md:h-20 md:w-48 rounded-md overflow-hidden bg-muted border border-border flex items-center justify-center">
                      <img src={img.image_url} alt="" className="h-full w-full object-cover" />
                    </div>
                  </div>
                  <div className="col-span-4 flex items-center gap-2">
                    <Input 
                      type="number" 
                      value={img.order_index} 
                      onChange={(e) => handleOrderChange(img.id, parseInt(e.target.value) || 0)}
                      className="w-20"
                    />
                    <div className="flex flex-col">
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => handleOrderChange(img.id, img.order_index + 1)}>
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => handleOrderChange(img.id, Math.max(0, img.order_index - 1))}>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="col-span-2 flex gap-2">
                    <Button variant="outline" size="icon" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50" onClick={() => handleReplaceImageClick(img.id)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteImage(img.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">ORM Package - Image Gallery</h1>
        <p className="text-muted-foreground">Manage images for ORM package sections</p>
      </div>

      {renderSection("Top Section Images", "top", 5, "These 5 images appear in the top section of ORM package page.")}
      {renderSection("Bottom Section Images", "bottom", 6, "These 6 images appear in the bottom section of ORM package page.")}
    </div>
  );
}
