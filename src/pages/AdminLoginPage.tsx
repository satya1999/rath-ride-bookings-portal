
import PageLayout from "@/components/layout/PageLayout";
import AdminLoginForm from "@/components/auth/AdminLoginForm";

const AdminLoginPage = () => {
  return (
    <PageLayout className="py-12">
      <h1 className="text-center mb-8">Admin Login</h1>
      <AdminLoginForm />
    </PageLayout>
  );
};

export default AdminLoginPage;
