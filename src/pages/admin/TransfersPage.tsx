import AdminLayout from '@/components/admin/AdminLayout';

export default function TransfersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Transfers</h1>
          <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            Create transfer
          </button>
        </div>

        {/* Transfer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Transfers</h3>
            <p className="text-2xl font-bold text-orange-600">5</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">In Transit</h3>
            <p className="text-2xl font-bold text-blue-600">3</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Completed Today</h3>
            <p className="text-2xl font-bold text-green-600">12</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Recent transfers</h2>
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Search transfers..."
                  className="border border-gray-300 rounded-lg px-4 py-2 w-64"
                />
                <select className="border border-gray-300 rounded-lg px-4 py-2">
                  <option>All transfers</option>
                  <option>Pending</option>
                  <option>In transit</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transfer #
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm font-medium text-blue-600">#TRF-1045</td>
                  <td className="py-4 px-6 text-sm text-gray-900">Main Warehouse</td>
                  <td className="py-4 px-6 text-sm text-gray-900">Retail Store - Delhi</td>
                  <td className="py-4 px-6 text-sm text-gray-900">25 items</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      In transit
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">Jan 12, 2024</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm font-medium text-blue-600">#TRF-1044</td>
                  <td className="py-4 px-6 text-sm text-gray-900">Warehouse B</td>
                  <td className="py-4 px-6 text-sm text-gray-900">Main Warehouse</td>
                  <td className="py-4 px-6 text-sm text-gray-900">18 items</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">Jan 11, 2024</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm font-medium text-blue-600">#TRF-1043</td>
                  <td className="py-4 px-6 text-sm text-gray-900">Main Warehouse</td>
                  <td className="py-4 px-6 text-sm text-gray-900">Retail Store - Mumbai</td>
                  <td className="py-4 px-6 text-sm text-gray-900">32 items</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                      Pending
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">Jan 10, 2024</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
