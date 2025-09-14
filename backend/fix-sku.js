const mongoose = require('mongoose');
require('dotenv').config();

async function fixSkuIndex() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('products');

    // Drop the SKU unique index
    try {
      await collection.dropIndex('sku_1');
      console.log('✅ SKU unique index removed successfully');
    } catch (error) {
      console.log('ℹ️  Index might already be removed or not exist');
    }

    // Also try dropping any other SKU-related indexes
    try {
      await collection.dropIndex('sku');
      console.log('✅ SKU index removed');
    } catch (error) {
      console.log('ℹ️  No additional SKU index found');
    }

    console.log('\n🎉 Database fixed! You can now add unlimited products.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

fixSkuIndex();
