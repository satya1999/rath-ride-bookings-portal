
import PageLayout from "@/components/layout/PageLayout";
import RegisterForm from "@/components/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <PageLayout className="py-12">
      <h1 className="text-center mb-8">Agent Registration</h1>
      <RegisterForm />
    </PageLayout>
  );
};

export default RegisterPage;
