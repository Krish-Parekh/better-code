import { SWRConfig } from "swr";

interface IProviderProps {
    children: React.ReactNode;
}

export default function AppProviders({ children }: IProviderProps) {
    return (
        <SWRConfig>
            {children}
        </SWRConfig>
    );

}