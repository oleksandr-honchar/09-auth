// "use client";

// import css from "./NoteList.module.css";
// import type { Note } from "@/types/note";

// type NoteListProps = {
//   notes: Note[];
//   onNoteClick: (note: Note) => void;
//   onDeleteNote: (id: string) => void;
//   deletingNoteId: string | null;
// };

// export default function NoteList({ notes, onNoteClick, onDeleteNote, deletingNoteId }: NoteListProps) {
//   return (
//     <ul className={css.list}>
//       {notes.map((note) => (
//         <li key={note.id} className={css.listItem}>
//           <h2 className={css.title}>{note.title}</h2>
//           <p className={css.content}>{note.content}</p>
//           <div className={css.footer}>
//             <span className={css.tag}>{note.tag}</span>
//             <button className={css.viewbutton} onClick={() => onNoteClick(note)}>
//               View details
//             </button>
//             <button
//               className={css.button}
//               onClick={() => onDeleteNote(note.id)}
//               disabled={deletingNoteId === note.id}
//             >
//               {deletingNoteId === note.id ? "Deleting..." : "Delete"}
//             </button>
//           </div>
//         </li>
//       ))}
//     </ul>
//   );
// }

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
