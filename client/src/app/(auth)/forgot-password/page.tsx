import MaxWidthContainer from "@/components/common/max-width-container";
import Navbar from "@/components/common/navbar";
import ForgotPasswordForm from "@/components/form/forgot-password";
import { StripedPattern } from "@/components/ui/striped-pattern";

export default function ForgotPasswordPage() {
  return (
    <MaxWidthContainer className="h-screen border-s-2 border-e-2 border-dashed border-gray-200 flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6 relative">
        <StripedPattern className="absolute inset-0 -z-10" />
        <ForgotPasswordForm />
      </div>
    </MaxWidthContainer>
  );
}
