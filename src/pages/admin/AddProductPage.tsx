import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Upload, 
  Image, 
  Plus, 
  X, 
  Info, 
  Package, 
  Edit,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Code
} from 'lucide-react';

interface ProductFormData {
  title: string;
  description: string;
  category: string;
  price: number;
  comparePrice: number;
  costPerItem: number;
  chargeTax: boolean;
  trackQuantity: boolean;
  quantity: number;
  continueSelling: boolean;
  hasSKU: boolean;
  sku: string;
  barcode: string;
  isPhysicalProduct: boolean;
  weight: number;
  weightUnit: string;
  packageType: string;
  searchTitle: string;
  searchDescription: string;
  variants: ProductVariant[];
  images: string[];
}

interface ProductVariant {
  id: string;
  name: string;
  values: string[];
}

export default function AddProductPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    category: '',
    price: 0,
    comparePrice: 0,
    costPerItem: 0,
    chargeTax: true,
    trackQuantity: true,
    quantity: 0,
    continueSelling: false,
    hasSKU: false,
    sku: '',
    barcode: '',
    isPhysicalProduct: true,
    weight: 0,
    weightUnit: 'kg',
    packageType: 'store-default',
    searchTitle: '',
    searchDescription: '',
    variants: [],
    images: []
  });

  const [showVariants, setShowVariants] = useState(false);
  const [showSEO, setShowSEO] = useState(false);

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // TODO: Implement Firebase save logic
    console.log('Saving product:', formData);
  };

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: Date.now().toString(),
      name: '',
      values: ['']
    };
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, newVariant]
    }));
  };

  const removeVariant = (id: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter(v => v.id !== id)
    }));
  };

  const profit = formData.price - formData.costPerItem;
  const margin = formData.price > 0 ? ((profit / formData.price) * 100).toFixed(2) : '0';

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/products')}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Add product</h1>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">Save as draft</Button>
            <Button onClick={handleSave}>Save product</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Description */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Short sleeve t-shirt"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <div className="mt-1 border rounded-lg">
                    {/* Rich Text Editor Toolbar */}
                    <div className="flex items-center space-x-1 p-2 border-b bg-gray-50">
                      <Button variant="ghost" size="sm" className="p-1">
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-1">
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-1">
                        <Underline className="w-4 h-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <Button variant="ghost" size="sm" className="p-1">
                        <AlignLeft className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-1">
                        <AlignCenter className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-1">
                        <AlignRight className="w-4 h-4" />
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <Button variant="ghost" size="sm" className="p-1">
                        <Link className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-1">
                        <Code className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Write your product description here..."
                      className="min-h-32 border-0 resize-none rounded-t-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Media</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="space-y-4">
                    <Image className="w-12 h-12 text-gray-400 mx-auto" />
                    <div className="space-y-2">
                      <div className="flex justify-center space-x-3">
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload new
                        </Button>
                        <Button variant="outline" size="sm">
                          Select existing
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Accepts images, videos, or 3D models
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardContent className="p-6">
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose a product category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarees">Sarees</SelectItem>
                      <SelectItem value="kurtas">Kurtas</SelectItem>
                      <SelectItem value="dupattas">Dupattas</SelectItem>
                      <SelectItem value="bedsheets">Bedsheets</SelectItem>
                      <SelectItem value="curtains">Curtains</SelectItem>
                      <SelectItem value="tablecloths">Tablecloths</SelectItem>
                      <SelectItem value="bags">Bags</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    Determines tax rates and adds metafields to improve search, filters, and cross-channel sales
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Price</Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                        className="pl-8"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium flex items-center">
                      Compare-at price
                      <Info className="w-4 h-4 ml-1 text-gray-400" />
                    </Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <Input
                        type="number"
                        value={formData.comparePrice}
                        onChange={(e) => handleInputChange('comparePrice', parseFloat(e.target.value) || 0)}
                        className="pl-8"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="charge-tax"
                    checked={formData.chargeTax}
                    onCheckedChange={(checked) => handleInputChange('chargeTax', checked)}
                  />
                  <Label htmlFor="charge-tax" className="text-sm">Charge tax on this product</Label>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium flex items-center">
                      Cost per item
                      <Info className="w-4 h-4 ml-1 text-gray-400" />
                    </Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <Input
                        type="number"
                        value={formData.costPerItem}
                        onChange={(e) => handleInputChange('costPerItem', parseFloat(e.target.value) || 0)}
                        className="pl-8"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Profit</Label>
                    <Input
                      value={profit > 0 ? `₹${profit.toFixed(2)}` : '--'}
                      readOnly
                      className="mt-1 bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Margin</Label>
                    <Input
                      value={profit > 0 ? `${margin}%` : '--'}
                      readOnly
                      className="mt-1 bg-gray-50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="track-quantity"
                    checked={formData.trackQuantity}
                    onCheckedChange={(checked) => handleInputChange('trackQuantity', checked)}
                  />
                  <Label htmlFor="track-quantity" className="text-sm">Track quantity</Label>
                </div>

                {formData.trackQuantity && (
                  <div>
                    <Label className="text-sm font-medium">Quantity</Label>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex-1">
                        <Label className="text-xs text-gray-500">Shop location</Label>
                        <Input
                          type="number"
                          value={formData.quantity}
                          onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                          className="mt-1"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="continue-selling"
                      checked={formData.continueSelling}
                      onCheckedChange={(checked) => handleInputChange('continueSelling', checked)}
                    />
                    <Label htmlFor="continue-selling" className="text-sm">Continue selling when out of stock</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="has-sku"
                      checked={formData.hasSKU}
                      onCheckedChange={(checked) => handleInputChange('hasSKU', checked)}
                    />
                    <Label htmlFor="has-sku" className="text-sm">This product has a SKU or barcode</Label>
                  </div>
                </div>

                {formData.hasSKU && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">SKU (Stock Keeping Unit)</Label>
                      <Input
                        value={formData.sku}
                        onChange={(e) => handleInputChange('sku', e.target.value)}
                        className="mt-1"
                        placeholder="SKU-001"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Barcode (ISBN, UPC, GTIN, etc.)</Label>
                      <Input
                        value={formData.barcode}
                        onChange={(e) => handleInputChange('barcode', e.target.value)}
                        className="mt-1"
                        placeholder="123456789012"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Shipping</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="physical-product"
                    checked={formData.isPhysicalProduct}
                    onCheckedChange={(checked) => handleInputChange('isPhysicalProduct', checked)}
                  />
                  <Label htmlFor="physical-product" className="text-sm">This is a physical product</Label>
                </div>

                {formData.isPhysicalProduct && (
                  <>
                    <div>
                      <Label className="text-sm font-medium flex items-center">
                        Package
                        <Info className="w-4 h-4 ml-1 text-gray-400" />
                      </Label>
                      <Select value={formData.packageType} onValueChange={(value) => handleInputChange('packageType', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue>
                            <div className="flex items-center">
                              <Package className="w-4 h-4 mr-2" />
                              Store default - Sample box - 22 × 13.7 × 4.2 cm, 0 kg
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="store-default">Store default - Sample box</SelectItem>
                          <SelectItem value="small-box">Small box - 15 × 10 × 8 cm</SelectItem>
                          <SelectItem value="medium-box">Medium box - 25 × 20 × 15 cm</SelectItem>
                          <SelectItem value="large-box">Large box - 40 × 30 × 20 cm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Product weight</Label>
                      <div className="flex space-x-2 mt-1">
                        <Input
                          type="number"
                          value={formData.weight}
                          onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                          placeholder="0.0"
                          className="flex-1"
                        />
                        <Select value={formData.weightUnit} onValueChange={(value) => handleInputChange('weightUnit', value)}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="g">g</SelectItem>
                            <SelectItem value="lb">lb</SelectItem>
                            <SelectItem value="oz">oz</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button variant="ghost" className="text-sm p-0 h-auto">
                      <Plus className="w-4 h-4 mr-2" />
                      Add customs information
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Variants */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Variants</CardTitle>
              </CardHeader>
              <CardContent>
                {!showVariants ? (
                  <Button
                    variant="ghost"
                    onClick={() => setShowVariants(true)}
                    className="text-sm p-0 h-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add options like size or color
                  </Button>
                ) : (
                  <div className="space-y-4">
                    {formData.variants.map((variant) => (
                      <div key={variant.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <Label className="text-sm font-medium">Option name</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVariant(variant.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <Input placeholder="Size, Color, Material..." className="mb-3" />
                        <Label className="text-sm font-medium">Option values</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="outline" className="px-3 py-1">
                            Small
                            <X className="w-3 h-3 ml-1" />
                          </Badge>
                          <Badge variant="outline" className="px-3 py-1">
                            Medium
                            <X className="w-3 h-3 ml-1" />
                          </Badge>
                          <Button variant="ghost" size="sm" className="h-auto p-1">
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addVariant} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add another option
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Search Engine Listing */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Search engine listing</CardTitle>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {!showSEO ? (
                  <p className="text-sm text-gray-500">
                    Add a title and description to see how this product might appear in a search engine listing
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Page title</Label>
                      <Input
                        value={formData.searchTitle}
                        onChange={(e) => handleInputChange('searchTitle', e.target.value)}
                        className="mt-1"
                        placeholder="Short sleeve t-shirt"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Meta description</Label>
                      <Textarea
                        value={formData.searchDescription}
                        onChange={(e) => handleInputChange('searchDescription', e.target.value)}
                        className="mt-1"
                        placeholder="Write a description..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Product status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select defaultValue="draft">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Publishing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Sales channels</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="online-store" defaultChecked />
                      <Label htmlFor="online-store" className="text-sm">Online Store</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pos" />
                      <Label htmlFor="pos" className="text-sm">Point of Sale</Label>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Markets</Label>
                  <p className="text-sm text-gray-500 mt-1">0 of 1 selected</p>
                </div>
              </CardContent>
            </Card>

            {/* Product Organization */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Product organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Product type</Label>
                  <Input className="mt-1" placeholder="T-shirt" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Vendor</Label>
                  <Input className="mt-1" placeholder="Company name" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Collections</Label>
                  <Input className="mt-1" placeholder="Search collections" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Tags</Label>
                  <Input className="mt-1" placeholder="Vintage, cotton, summer..." />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
