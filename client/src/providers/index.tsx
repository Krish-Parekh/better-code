"use client";

import { SWRConfig } from "swr";
import LogoutHandler from "@/components/auth/logout-handler";
import { CookiesProvider } from 'react-cookie';
interface IProviderProps {
  children: React.ReactNode;
}

export default function AppProviders({ children }: IProviderProps) {
  return (
    <CookiesProvider>
      <SWRConfig>
        <LogoutHandler />
        {children}
      </SWRConfig>
    </CookiesProvider>

  );
}
