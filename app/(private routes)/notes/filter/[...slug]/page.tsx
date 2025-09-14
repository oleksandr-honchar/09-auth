// notes/[slug]/page.tsx
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Notes from "./Notes.client";
import { getNotes } from "@/lib/api/serverApi";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: { slug: string[] } };

const allowedTags = [
  "Todo", "Work", "Personal", "Meeting", "Shopping",
  "Ideas", "Travel", "Finance", "Health", "Important", "All"
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const rawTag = params.slug?.[0] ?? "All";
  const tagName = rawTag.toLowerCase() === "all" ? "All Notes" : rawTag;
  return {
    title: `NoteHub - ${tagName}`,
    description: `Browse ${tagName} in NoteHub, your efficient personal note manager.`,
  };
}

export default async function FilteredNotesPage({ params }: Props) {
  const rawTag = params.slug?.[0] ?? "All";

  if (!allowedTags.map((t) => t.toLowerCase()).includes(rawTag.toLowerCase())) notFound();

  const tag = rawTag.toLowerCase() === "all" ? "" : rawTag;
  const perPage = 12;
  const initialPage = 1;

  const queryClient = new QueryClient();

  // Prefetch notes on the server using serverApi
  await queryClient.prefetchQuery({
    queryKey: ["notes", initialPage, "", tag],
    queryFn: () =>
      getNotes({
        page: initialPage,
        perPage,
        search: undefined,
        tag: tag || undefined,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Notes tag={tag} />
    </HydrationBoundary>
  );
}
