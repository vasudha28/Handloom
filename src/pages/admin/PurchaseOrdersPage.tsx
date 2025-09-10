import AdminLayout from '@/components/admin/AdminLayout';

export default function PurchaseOrdersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Purchase orders</h1>
          <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            Create purchase order
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Open Orders</h3>
            <p className="text-2xl font-bold text-blue-600">8</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Received This Month</h3>
            <p className="text-2xl font-bold text-green-600">15</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Value</h3>
            <p className="text-2xl font-bold text-gray-900">₹1,25,400</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Purchase orders</h2>
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="border border-gray-300 rounded-lg px-4 py-2 w-64"
                />
                <select className="border border-gray-300 rounded-lg px-4 py-2">
                  <option>All orders</option>
                  <option>Open</option>
                  <option>Received</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Number
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expected
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm font-medium text-blue-600">#PO-1001</td>
                  <td className="py-4 px-6 text-sm text-gray-900">Silk Weavers Co.</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      Open
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">Jan 15, 2024</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">₹25,400</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm font-medium text-blue-600">#PO-1000</td>
                  <td className="py-4 px-6 text-sm text-gray-900">Cotton Crafts Ltd.</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Received
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">Jan 10, 2024</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">₹45,200</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm font-medium text-blue-600">#PO-999</td>
                  <td className="py-4 px-6 text-sm text-gray-900">Traditional Textiles</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Partial
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">Jan 8, 2024</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">₹18,600</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
