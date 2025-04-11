
import PageLayout from "@/components/layout/PageLayout";
import OtpVerification from "@/components/auth/OtpVerification";

const VerifyOtpPage = () => {
  return (
    <PageLayout className="py-12">
      <h1 className="text-center mb-8">Verify Your Identity</h1>
      <OtpVerification />
    </PageLayout>
  );
};

export default VerifyOtpPage;
