import { SWRConfig } from "swr";
import LogoutHandler from "@/components/auth/logout-handler";

interface IProviderProps {
  children: React.ReactNode;
}

export default function AppProviders({ children }: IProviderProps) {
  return (
    <SWRConfig>
      <LogoutHandler />
      {children}
    </SWRConfig>
  );
}
