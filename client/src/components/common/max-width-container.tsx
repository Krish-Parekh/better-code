import { cn } from "@/lib/utils";

interface IMaxWidthContainerProps {
    children: React.ReactNode;
    className?: string;
}

export default function MaxWidthContainer({ children, className }: IMaxWidthContainerProps) {
    return (
        <div className={cn("mx-auto w-full max-w-6xl", className)}>
            {children}
        </div>
    )
}