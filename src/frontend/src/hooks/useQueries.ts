import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export interface RatingsData {
  luck: number;
  happiness: number;
  love: number;
  good: number;
  overall: number;
}

export function useGetQuotation(signIndex: number) {
  const { actor, isFetching } = useActor();
  return useQuery<string | null>({
    queryKey: ["quotation", signIndex],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getQuotation(BigInt(signIndex));
      return result ?? null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetQuotation(signIndex: number) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (text: string) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.setQuotation(BigInt(signIndex), text);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotation", signIndex] });
    },
  });
}

export function useGetRatings(signIndex: number) {
  const { actor, isFetching } = useActor();
  return useQuery<RatingsData | null>({
    queryKey: ["ratings", signIndex],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getRatings(BigInt(signIndex));
      if (!result) return null;
      return {
        luck: Number(result.luck),
        happiness: Number(result.happiness),
        love: Number(result.love),
        good: Number(result.good),
        overall: Number(result.overall),
      };
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetRatings(signIndex: number) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ratings: RatingsData) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.setRatings(
        BigInt(signIndex),
        BigInt(ratings.luck),
        BigInt(ratings.happiness),
        BigInt(ratings.love),
        BigInt(ratings.good),
        BigInt(ratings.overall),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ratings", signIndex] });
    },
  });
}
