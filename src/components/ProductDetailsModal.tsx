import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, X, Package, Tag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { ProductFormData } from "@/services/productService";

interface ProductDetailsModalProps {
  product: ProductFormData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailsModal = ({ product, isOpen, onClose }: ProductDetailsModalProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart({
      id: product._id || product.title,
      name: product.title,
      price: product.price,
      originalPrice: product.costPerItem,
      image: product.images?.[0] || '/placeholder.svg',
      origin: product.category
    });
    
    toast.success(`${product.title} added to cart!`);
  };

  const handleWishlistToggle = () => {
    const wishlistItem = {
      id: product._id || product.title,
      name: product.title,
      price: product.price,
      originalPrice: product.costPerItem,
      image: product.images?.[0] || '/placeholder.svg',
      origin: product.category,
      category: product.category
    };

    if (isInWishlist(product._id || product.title)) {
      removeFromWishlist(product._id || product.title);
      toast.success(`${product.title} removed from wishlist!`);
    } else {
      addToWishlist(wishlistItem);
      toast.success(`${product.title} added to wishlist!`);
    }
  };

  const discountPercentage = product.costPerItem > product.price 
    ? Math.round(((product.costPerItem - product.price) / product.costPerItem) * 100)
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Product Details</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={product.images?.[selectedImageIndex] || '/placeholder.svg'}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
            
            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Title and Status */}
            <div>
              <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
              <div className="flex items-center gap-2 mb-3">
                <Badge className={product.status === 'active' ? 'bg-green-500' : 'bg-red-500'}>
                  {product.status === 'active' ? 'Available' : 'Out of Stock'}
                </Badge>
                <Badge variant="outline">
                  <Package className="h-3 w-3 mr-1" />
                  Stock: {product.quantity || 0}
                </Badge>
              </div>
            </div>

            {/* Price Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  ₹{product.price.toLocaleString()}
                </span>
                {discountPercentage > 0 && (
                  <Badge className="bg-orange-500 text-white">
                    {discountPercentage}% OFF
                  </Badge>
                )}
              </div>
              {product.costPerItem > product.price && (
                <div className="space-y-1">
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{product.costPerItem.toLocaleString()}
                  </span>
                  <p className="text-sm text-green-600 font-medium">
                    You save ₹{(product.costPerItem - product.price).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Category</h4>
                <p className="font-medium">{product.category}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Collection</h4>
                <p className="font-medium">{product.productCollection || 'N/A'}</p>
              </div>
              {product.hasSKU && product.sku && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">SKU</h4>
                  <p className="font-medium">{product.sku}</p>
                </div>
              )}
              {product.barcode && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Barcode</h4>
                  <p className="font-medium">{product.barcode}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                className="flex-1" 
                onClick={handleAddToCart}
                disabled={!product.quantity || product.quantity <= 0}
                size="lg"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {product.quantity && product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleWishlistToggle}
                className={isInWishlist(product._id || product.title) ? 'text-red-500' : ''}
              >
                <Heart 
                  className={`w-4 h-4 ${
                    isInWishlist(product._id || product.title) ? 'fill-current' : ''
                  }`} 
                />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
