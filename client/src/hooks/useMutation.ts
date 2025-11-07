import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";
import { postJsonFetcher } from "@/lib/fetcher";
import { toast } from "sonner";

export default function useMutation<ExtraArgs, Data>(
  key: string,
  fetcher: (_key: string, _options?: { arg: ExtraArgs }) => Promise<Data>,
  config?: SWRMutationConfiguration<Data, Error, string, ExtraArgs>,
) {
  return useSWRMutation<Data, Error, string, ExtraArgs>(key, fetcher, {
    onError(error) {
      toast.error(error.message);
    },
    throwOnError: false,
    ...config,
  });
}

export function useServerMutation<ExtraArgs, Data>(
  key: string,
  config?: SWRMutationConfiguration<Data, Error, string, ExtraArgs>,
) {
  return useMutation<ExtraArgs, Data>(
    key,
    postJsonFetcher(process.env.NEXT_PUBLIC_SERVER_URL as string),
    config,
  );
}
