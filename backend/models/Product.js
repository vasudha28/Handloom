const mongoose = require('mongoose');

const productVariantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  values: [{
    type: String,
    required: true
  }]
});

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['men', 'women', 'living', 'others']
  },
  // FIXED: Renamed 'collection' to 'productCollection' to avoid reserved keyword warning
  productCollection: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  costPerItem: {
    type: Number,
    required: true,
    min: 0
  },
  chargeTax: {
    type: Boolean,
    default: true
  },
  trackQuantity: {
    type: Boolean,
    default: true
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0
  },
  continueSelling: {
    type: Boolean,
    default: false
  },
  hasSKU: {
    type: Boolean,
    default: false
  },
  sku: {
    type: String,
    sparse: true
  },
  barcode: {
    type: String,
    sparse: true
  },
  isPhysicalProduct: {
    type: Boolean,
    default: true
  },
  weight: {
    type: Number,
    default: 0,
    min: 0
  },
  weightUnit: {
    type: String,
    enum: ['kg', 'g', 'lb', 'oz'],
    default: 'kg'
  },
  packageType: {
    type: String,
    default: 'store-default'
  },
  searchTitle: {
    type: String,
    trim: true
  },
  searchDescription: {
    type: String
  },
  variants: [productVariantSchema],
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        // Accept both HTTP/HTTPS URLs and base64 data URLs
        return /^(https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$|data:image\/(jpeg|jpg|png|gif|webp);base64,)/i.test(v);
      },
      message: 'Invalid image format - must be HTTP/HTTPS URL or base64 data URL'
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'archived'],
    default: 'draft'
  },
  productType: {
    type: String,
    trim: true
  },
  vendor: {
    type: String,
    trim: true
  },
  // This field is fine - it's plural 'collections'
  collections: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  salesChannels: {
    onlineStore: {
      type: Boolean,
      default: true
    },
    pos: {
      type: Boolean,
      default: false
    }
  },
  markets: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  suppressReservedKeysWarning: true // ADDED: This suppresses the warning
});

// Index for better query performance
productSchema.index({ category: 1, productCollection: 1 }); // UPDATED: Use new field name
productSchema.index({ status: 1 });
productSchema.index({ title: 'text', description: 'text', searchTitle: 'text', searchDescription: 'text' });

// Virtual for profit calculation
productSchema.virtual('profit').get(function() {
  return this.price - this.costPerItem;
});

// Virtual for margin calculation
productSchema.virtual('margin').get(function() {
  if (this.price > 0) {
    return ((this.profit / this.price) * 100).toFixed(2);
  }
  return 0;
});

// ADDED: Virtual to maintain backward compatibility with 'collection' field
productSchema.virtual('collection').get(function() {
  return this.productCollection;
});

productSchema.virtual('collection').set(function(value) {
  this.productCollection = value;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);