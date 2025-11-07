import MaxWidthContainer from "@/components/common/max-width-container";
import Navbar from "@/components/common/navbar";
import LoginForm from "@/components/form/login";
import { StripedPattern } from "@/components/magicui/striped-pattern";

export default function LoginPage() {
    return (
        <MaxWidthContainer className="h-screen border-s-2 border-e-2 border-dashed border-gray-200 flex flex-col">
            <Navbar />
            <div className="flex flex-1 flex-col justify-center relative">
                <StripedPattern className="absolute inset-0 -z-10" />
                <LoginForm />
            </div>
        </MaxWidthContainer>
    );
}
