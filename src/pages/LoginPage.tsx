
import PageLayout from "@/components/layout/PageLayout";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
  return (
    <PageLayout className="py-12">
      <h1 className="text-center mb-8">Agent Login</h1>
      <LoginForm />
    </PageLayout>
  );
};

export default LoginPage;
