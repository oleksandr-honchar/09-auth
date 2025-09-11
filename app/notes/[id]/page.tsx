import NotePreview from "@/components/NotePreview/NotePreview";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Note = {
  id: string;
  title: string;
  description: string;
  image?: string;
};

type Props = {
  params: { id: string };
};

async function getNoteById(id: string): Promise<Note | null> {
  if (Number(id) < 1) return null; 
  return {
    id,
    title: `Title ${id}`,
    description: `Brief description ${id}`,
    image: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const note = await getNoteById(params.id);

  if (!note) notFound();

  return {
    title: note.title,
    description: note.description,
    openGraph: {
      title: note.title,
      description: note.description,
      url: `https://08-zustand-three-rho.vercel.app/notes/${params.id}`,
      images: [
        {
          url: note.image ?? "/og-images/note.png",
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
      description: note.description,
      images: [note.image ?? "/og-images/note.png"],
    },
  };
}

export default async function NotePage({ params }: Props) {
  const note = await getNoteById(params.id);

  if (!note) notFound();

  return <NotePreview noteId={note.id} />;
}
