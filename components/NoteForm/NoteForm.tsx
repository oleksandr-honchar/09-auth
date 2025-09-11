// "use client";

// import { useState, useEffect } from "react";
// import css from "./NoteForm.module.css";
// import { useNoteStore } from "@/lib/store/noteStore";
// import type { CreateNotePayload } from "@/lib/api";

// export interface NoteFormProps {
//   onAdd?: (payload: CreateNotePayload) => void;
//   onCancel?: () => void;
// }

// export default function NoteForm({ onAdd, onCancel }: NoteFormProps) {
//   const { draft, saveDraft, clearDraft } = useNoteStore();
//   const [title, setTitle] = useState(draft?.title || "");
//   const [content, setContent] = useState(draft?.content || "");
//   const [tag, setTag] = useState<CreateNotePayload["tag"]>(draft?.tag || "Todo");

//   useEffect(() => {
//     saveDraft({ title, content, tag });
//   }, [title, content, tag, saveDraft]);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (title.trim().length < 3) {
//       alert("Title must be at least 3 characters long");
//       return;
//     }
//     if (title.trim().length > 50) {
//       alert("Title must be at most 50 characters long");
//       return;
//     }
//     if (content.trim().length > 500) {
//       alert("Content must be at most 500 characters long");
//       return;
//     }
//     if (!tag) {
//       alert("Tag is required");
//       return;
//     }

//     const payload: CreateNotePayload = { title: title.trim(), content: content.trim(), tag };
//     if (onAdd) await onAdd(payload);

//     clearDraft();
//     setTitle("");
//     setContent("");
//     setTag("Todo");
//   };

//   return (
//     <form className={css.form} onSubmit={handleSubmit} noValidate>
//       <div className={css.formGroup}>
//         <label htmlFor="title">Title</label>
//         <input
//           id="title"
//           name="title"
//           type="text"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className={css.input}
//           required
//           minLength={3}
//           maxLength={50}
//         />
//       </div>

//       <div className={css.formGroup}>
//         <label htmlFor="content">Content</label>
//         <textarea
//           id="content"
//           name="content"
//           rows={8}
//           placeholder="Content"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           className={css.textarea}
//           maxLength={500}
//         />
//       </div>

//       <div className={css.formGroup}>
//         <label htmlFor="tag">Tag</label>
//         <select
//           id="tag"
//           name="tag"
//           value={tag}
//           onChange={(e) => setTag(e.target.value as CreateNotePayload["tag"])}
//           className={css.select}
//           required
//         >
//           <option value="Todo">Todo</option>
//           <option value="Work">Work</option>
//           <option value="Personal">Personal</option>
//           <option value="Meeting">Meeting</option>
//           <option value="Shopping">Shopping</option>
//         </select>
//       </div>

//       <div className={css.actions}>
//         {onCancel && (
//           <button type="button" className={css.cancelButton} onClick={onCancel}>
//             Cancel
//           </button>
//         )}
//         <button type="submit" className={css.submitButton}>
//           Create note
//         </button>
//       </div>
//     </form>
//   );
// }

"use client";

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import css from "./NoteForm.module.css";
import { useNoteStore } from "@/lib/store/noteStore";
import { createNote } from "@/lib/api";
import type { CreateNotePayload } from "@/lib/api";
import type { Note } from "@/types/note";

export interface NoteFormProps {
  onAdd?: (payload: CreateNotePayload) => Promise<void> | void;
  onCancel?: () => void;
}

export default function NoteForm({ onAdd, onCancel }: NoteFormProps) {
  const { draft, saveDraft, clearDraft } = useNoteStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: CreateNotePayload) => createNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"], exact: false });
    },
  });

  const title = draft?.title ?? "";
  const content = draft?.content ?? "";
  const tag = (draft?.tag as CreateNotePayload["tag"]) ?? "Todo";

  const validate = () => {
    if (title.trim().length < 3) {
      alert("Title must be at least 3 characters long");
      return false;
    }
    if (title.trim().length > 50) {
      alert("Title must be at most 50 characters long");
      return false;
    }
    if (content.trim().length > 500) {
      alert("Content must be at most 500 characters long");
      return false;
    }
    if (!tag) {
      alert("Tag is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateNotePayload = {
      title: title.trim(),
      content: content.trim(),
      tag,
    };

    try {
      if (onAdd) {
        // parent will handle creation (modal case)
        await onAdd(payload);
        clearDraft();
        onCancel?.();
        return;
      }

const created: Note = await createMutation.mutateAsync(payload);
router.push(`/notes/${created.id}`);

     const createdId = created.id;
      if (createdId) {
        router.push(`/notes/${createdId}`);
      } else {
        router.push("/notes");
      }
    } catch (err) {
      console.error("Create note failed:", err);
      alert("Failed to create note. See console for details.");
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit} noValidate>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => saveDraft({ title: e.target.value, content, tag })}
          className={css.input}
          required
          minLength={3}
          maxLength={50}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          placeholder="Content"
          value={content}
          onChange={(e) => saveDraft({ title, content: e.target.value, tag })}
          className={css.textarea}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          value={tag}
          onChange={(e) =>
            saveDraft({
              title,
              content,
              tag: e.target.value as CreateNotePayload["tag"],
            })
          }
          className={css.select}
          required
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        {onCancel && (
          <button
            type="button"
            className={css.cancelButton}
            onClick={() => {
              onCancel();
            }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className={css.submitButton}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
