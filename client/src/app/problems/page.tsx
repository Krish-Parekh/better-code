import MaxWidthContainer from "@/components/common/max-width-container";
import Navbar from "@/components/common/navbar";
export default function ProblemPage() {
  return (
    <MaxWidthContainer className="h-screen border-s-2 border-e-2 border-dashed border-gray-200 flex flex-col">
      <Navbar />
      <main>
        <div className="w-full border-b-2 border-dashed border-gray-200 flex justify-between bg-gray-50/50">
          <div className="p-4 w-fit">
            <h3 className="text-lg font-semibold">Problem</h3>
          </div>
          <div className="flex">
            <div className="border-l-2 border-dashed w-36 h-full border-gray-200/70 flex items-center justify-center">
              <h3 className="text-lg font-semibold">Status</h3>
            </div>
            <div className="border-l-2 border-dashed w-36 h-full border-gray-200/70 flex items-center justify-center">
              <h3 className="text-lg font-semibold">Companies</h3>
            </div>
            <div className="border-l-2 border-dashed w-36 h-full border-gray-200/70 flex items-center justify-center">
              <h3 className="text-lg font-semibold">Action</h3>
            </div>
          </div>
        </div>
      </main>
    </MaxWidthContainer>
  );
}
