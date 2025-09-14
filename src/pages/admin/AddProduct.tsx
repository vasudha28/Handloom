import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Removed Supabase import to prevent conflicts
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ImageIcon, X } from "lucide-react";

const categories = [
  "Sarees", "Dupattas", "Kurtas", "Scarves", "Home Decor", 
  "Bags", "Wall Hangings", "Table Runners", "Cushion Covers", "Other"
];

const materials = [
  "Cotton", "Silk", "Linen", "Wool", "Jute", "Bamboo", "Hemp", "Mixed"
];

export default function AddProduct() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      price: parseFloat(formData.get('price') as string),
      stock_quantity: parseInt(formData.get('stock_quantity') as string),
      weaver_story: formData.get('weaver_story') as string,
      dimensions: formData.get('dimensions') as string,
      care_instructions: formData.get('care_instructions') as string,
      materials: selectedMaterials,
      images: imageUrls.filter(url => url.trim() !== '')
    };

    try {
      const { error } = await supabase
        .from('products')
        .insert([productData]);

      if (error) throw error;

      toast({
        title: "Product added successfully!",
        description: "The product has been added to your catalog.",
      });

      navigate('/admin/products');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const handleMaterialChange = (material: string, checked: boolean) => {
    if (checked) {
      setSelectedMaterials([...selectedMaterials, material]);
    } else {
      setSelectedMaterials(selectedMaterials.filter(m => m !== material));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground">Create a new handloom product listing</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="e.g., Handwoven Cotton Saree"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="2500.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                <Input
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  min="0"
                  required
                  placeholder="10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Describe the product, its features, and uniqueness..."
              />
            </div>

            <div className="space-y-2">
              <Label>Materials</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {materials.map(material => (
                  <label key={material} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedMaterials.includes(material)}
                      onChange={(e) => handleMaterialChange(material, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{material}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Product Images</Label>
              {imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) => updateImageUrl(index, e.target.value)}
                    placeholder="Enter image URL"
                    className="flex-1"
                  />
                  {imageUrls.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeImageUrl(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addImageUrl}
                className="w-full"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Add Another Image
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  name="dimensions"
                  placeholder="e.g., 6m x 1.2m"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="care_instructions">Care Instructions</Label>
                <Input
                  id="care_instructions"
                  name="care_instructions"
                  placeholder="e.g., Hand wash, dry clean"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weaver_story">Weaver Story</Label>
              <Textarea
                id="weaver_story"
                name="weaver_story"
                rows={4}
                placeholder="Tell the story behind this product, the weaver, the technique used..."
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Adding Product..." : "Add Product"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/products')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}