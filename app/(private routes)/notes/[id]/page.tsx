// app/(private routes)/notes/[id]/page.tsx
import NotePreview from "@/components/NotePreview/NotePreview";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNoteById } from "@/lib/api/serverApi"; // ✅ серверний API
import type { Note } from "@/types/note";

type Props = {
  params: { id: string };
};

async function fetchNote(id: string): Promise<Note | null> {
  try {
    return await getNoteById(id); // ✅ серверний виклик
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const note = await fetchNote(params.id);

  if (!note) notFound();

  return {
    title: note.title,
    description: note.content.slice(0, 160),
    openGraph: {
      title: note.title,
      description: note.content.slice(0, 160),
      url: `https://08-zustand-three-rho.vercel.app/notes/${params.id}`,
      images: [
        {
          url: "/og-images/note.png",
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
  const note = await fetchNote(params.id);

  if (!note) notFound();

  return <NotePreview noteId={note.id} />;
}
