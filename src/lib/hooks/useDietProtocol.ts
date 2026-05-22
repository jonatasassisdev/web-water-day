import useSWR, { mutate } from 'swr';
import { dietProtocolApi, DietProtocol } from '@/lib/api/diet-protocol';

const KEY = '/diet-protocol';

export function useDietProtocol() {
  const { data, isLoading, error } = useSWR<DietProtocol | null>(
    KEY,
    () => dietProtocolApi.get(),
    { revalidateOnFocus: false },
  );

  return { protocol: data ?? null, isLoading, error };
}

export function refreshDietProtocol() {
  return mutate(KEY);
}
