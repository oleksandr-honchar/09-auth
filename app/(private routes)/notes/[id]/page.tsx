import NotePreview from "@/components/NotePreview/NotePreview";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchNoteById } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";

type Props = {
  params: { id: string };
};

async function getNoteById(id: string): Promise<Note | null> {
  try {
    return await fetchNoteById(id);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const note = await getNoteById(params.id);

  if (!note) notFound();

  return {
    title: note.title,
    description: note.content.slice(0, 160), // ✅ content instead of description
    openGraph: {
      title: note.title,
      description: note.content.slice(0, 160),
      url: `https://08-zustand-three-rho.vercel.app/notes/${params.id}`,
      images: [
        {
          url: "/og-images/note.png", // ✅ fallback since Note has no image
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
      type: "website",
      siteName: "NoteHub",
    },
    twitter: {
      card: "summary_large_image",
      title: note.title,
      description: note.content.slice(0, 160),
      images: ["/og-images/note.png"],
    },
  };
}

export default async function NotePage({ params }: Props) {
  const note = await getNoteById(params.id);

  if (!note) notFound();

  return <NotePreview noteId={note.id} />;
}
