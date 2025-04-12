
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";

const LoginPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (!isLoading && user) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

  return (
    <PageLayout className="py-12">
      <h1 className="text-center mb-8">Agent Login</h1>
      <LoginForm />
    </PageLayout>
  );
};

export default LoginPage;
