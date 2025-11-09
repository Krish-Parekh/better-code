"use client";

import { getFetcher } from "@/lib/fetcher";
import useSWR, { type SWRConfiguration } from "swr";

function useQuery<Data>(
  key: string,
  fetcher: (
    _key: string,
    _options?: { arg: Record<string, string> },
  ) => Promise<Data>,
  config?: SWRConfiguration<Data, Error>,
) {
  return useSWR<Data, Error>(key, fetcher, {
    ...config,
  });
}

export function useServerQuery<Data>(
  key: string,
  config?: SWRConfiguration<Data, Error>,
) {
  return useQuery<Data>(
    key,
    getFetcher(process.env.NEXT_PUBLIC_SERVER_URL!),
    config,
  );
}
