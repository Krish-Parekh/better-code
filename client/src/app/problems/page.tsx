import MaxWidthContainer from "@/components/common/max-width-container";
import Navbar from "@/components/common/navbar";
import ProblemsTable from "@/components/common/problems-table";
export default function ProblemPage() {
  return (
    <MaxWidthContainer className="h-screen border-s-2 border-e-2 border-dashed border-gray-200 flex flex-col">
      <Navbar />
      <ProblemsTable />
    </MaxWidthContainer>
  );
}
