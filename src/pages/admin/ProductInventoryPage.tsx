import AdminLayout from '@/components/admin/AdminLayout';

export default function ProductInventoryPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <div className="flex space-x-3">
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Export
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Adjust inventory
            </button>
          </div>
        </div>

        {/* Inventory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Products</h3>
            <p className="text-2xl font-bold text-gray-900">248</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Low Stock</h3>
            <p className="text-2xl font-bold text-orange-600">12</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Out of Stock</h3>
            <p className="text-2xl font-bold text-red-600">3</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Value</h3>
            <p className="text-2xl font-bold text-green-600">₹2,45,780</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Inventory tracking</h2>
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="border border-gray-300 rounded-lg px-4 py-2 w-64"
                />
                <select className="border border-gray-300 rounded-lg px-4 py-2">
                  <option>All products</option>
                  <option>Low stock</option>
                  <option>Out of stock</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Committed
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    On hand
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
                      <div>
                        <p className="font-medium text-gray-900">Handwoven Cotton Saree</p>
                        <p className="text-sm text-gray-500">Traditional Blue</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">HCS-001</td>
                  <td className="py-4 px-6 text-sm text-gray-900">25</td>
                  <td className="py-4 px-6 text-sm text-gray-900">3</td>
                  <td className="py-4 px-6 text-sm text-gray-900">28</td>
                </tr>
                <tr>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
                      <div>
                        <p className="font-medium text-gray-900">Silk Dupatta</p>
                        <p className="text-sm text-gray-500">Maroon Embroidered</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">SD-002</td>
                  <td className="py-4 px-6 text-sm text-red-600">2</td>
                  <td className="py-4 px-6 text-sm text-gray-900">1</td>
                  <td className="py-4 px-6 text-sm text-gray-900">3</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
