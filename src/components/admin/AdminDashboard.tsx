import AdminLayout from './AdminLayout';
import AdminHome from './AdminHome';

export default function AdminDashboard() {
  return (
    <AdminLayout 
      title="Dashboard" 
      subtitle="Welcome to your admin dashboard"
    >
      <AdminHome />
    </AdminLayout>
  );
}
