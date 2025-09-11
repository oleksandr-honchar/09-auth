import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import Notes from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string[] };
};

const allowedTags = ["Todo", "Work", "Personal", "Meeting", "Shopping", "All"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const tag = slug?.[0]?.toLowerCase() === "all" ? "All Notes" : slug?.[0] ?? "Notes";

  const title = `NoteHub - ${tag}`;
  const description = `Browse ${tag} in NoteHub, your efficient personal note manager.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://08-zustand-three-rho.vercel.app/notes/filter/${slug?.join("/")}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `NoteHub - ${tag}`,
        },
      ],
      type: "website",
      siteName: "NoteHub",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

export default async function FilteredNotesPage({ params }: Props) {
  const { slug } = params;
  const rawTag = slug?.[0] ?? "All";

  const isValid = allowedTags.map((t) => t.toLowerCase()).includes(rawTag.toLowerCase());
  if (!isValid) notFound();

  const tag = rawTag.toLowerCase() === "all" ? "" : rawTag;

  const perPage = 12;
  const initialPage = 1;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", initialPage, "", tag],
    queryFn: () =>
      fetchNotes({
        page: initialPage,
        perPage,
        search: "",
        tag,
      }),
  });

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Notes tag={tag} />
      </HydrationBoundary>
    </div>
  );
}
