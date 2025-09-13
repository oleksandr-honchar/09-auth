import css from "./NoteList.module.css";
import type { Note } from "@/types/note";

type NoteListProps = {
  notes: Note[];
  onNoteClick?: (note: Note) => void;
};

export default function NoteList({ notes, onNoteClick }: NoteListProps) {
  return (
    <div className={css.list}>
      {notes.map((note) => (
        <div
          key={note.id}
          className={css.item}
          onClick={() => onNoteClick?.(note)}
        >
          <h3 className={css.title}>{note.title}</h3>
          <p className={css.content}>{note.content}</p>
          {note.tag && <span className={css.tag}>{note.tag}</span>}
          {note.createdAt && (
            <p className={css.date}>
             {new Date(note.createdAt).toISOString().split("T")[0]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
