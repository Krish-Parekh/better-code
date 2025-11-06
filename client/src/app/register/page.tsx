import MaxWidthContainer from "@/components/common/max-width-container";
import Navbar from "@/components/common/navbar";
import RegisterForm from "@/components/form/register";

export default function RegisterPage() {
    return (
        <MaxWidthContainer className="h-screen border-s-2 border-e-2 border-dashed border-gray-200 flex flex-col">
            <Navbar />
            <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
                <RegisterForm />
            </div>
        </MaxWidthContainer>
    )
}