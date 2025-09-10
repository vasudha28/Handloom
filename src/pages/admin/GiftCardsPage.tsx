import AdminLayout from '@/components/admin/AdminLayout';

export default function GiftCardsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Gift cards</h1>
          <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            Issue gift card
          </button>
        </div>

        {/* Gift Card Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Active Gift Cards</h3>
            <p className="text-2xl font-bold text-green-600">42</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Value</h3>
            <p className="text-2xl font-bold text-gray-900">₹85,400</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Redeemed</h3>
            <p className="text-2xl font-bold text-blue-600">₹32,150</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Expired</h3>
            <p className="text-2xl font-bold text-red-600">8</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Gift cards</h2>
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Search gift cards..."
                  className="border border-gray-300 rounded-lg px-4 py-2 w-64"
                />
                <select className="border border-gray-300 rounded-lg px-4 py-2">
                  <option>All gift cards</option>
                  <option>Active</option>
                  <option>Used</option>
                  <option>Expired</option>
                  <option>Disabled</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gift Card
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Initial Value
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expires
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm font-medium text-gray-900">GIFT-2024-001</p>
                      <p className="text-xs text-gray-500">xxxx-xxxx-xxxx-1234</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">Priya Sharma</td>
                  <td className="py-4 px-6 text-sm text-gray-900">₹5,000</td>
                  <td className="py-4 px-6 text-sm font-medium text-green-600">₹3,250</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">Dec 31, 2024</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm font-medium text-gray-900">GIFT-2024-002</p>
                      <p className="text-xs text-gray-500">xxxx-xxxx-xxxx-5678</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">Rajesh Kumar</td>
                  <td className="py-4 px-6 text-sm text-gray-900">₹2,500</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">₹0</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      Used
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">Dec 31, 2024</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm font-medium text-gray-900">GIFT-2023-125</p>
                      <p className="text-xs text-gray-500">xxxx-xxxx-xxxx-9012</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">Anita Patel</td>
                  <td className="py-4 px-6 text-sm text-gray-900">₹1,000</td>
                  <td className="py-4 px-6 text-sm font-medium text-red-600">₹1,000</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      Expired
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">Dec 31, 2023</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
