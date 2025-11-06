import MaxWidthContainer from "@/components/common/max-width-container";
import Navbar from "@/components/common/navbar";

export default function LoginPage() {
    return (
        <MaxWidthContainer className="h-screen border-s-2 border-e-2 border-dashed border-gray-200 flex flex-col">
            <Navbar />
        </MaxWidthContainer>
    );
}
