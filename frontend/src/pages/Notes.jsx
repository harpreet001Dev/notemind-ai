import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/api";
import { useForm } from 'react-hook-form'
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";

const notsSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(3)
})

const askSchema = z.object({
  ques: z.string().trim().min(1, 'Please enter a question')
})

function Notes() {
  const navigate = useNavigate();
  const [editId, setEditId] = useState(null);
  const [isAskOpen, setIsAskOpen] = useState(false);
  const [askAnswer, setAskAnswer] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(notsSchema),
    defaultValues: {
      title: "",
      content: "",
    }
  })

  const {
    register: registerAsk,
    handleSubmit: handleAskSubmit,
    formState: { errors: askErrors },
    reset: resetAsk,
  } = useForm({
    resolver: zodResolver(askSchema),
    defaultValues: {
      ques: '',
    },
  })

  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("accesstoken");
    navigate("/login");
  };

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [pagination,setPagination]=useState([]);


  const getNotes = async () => {
    try {
      const res = await api.GetNotes({ page, limit });
      if (res.status == 'success') {
        setNotes(res.data?.notes)
        setPagination(res?.data?.pagination)
      }
    } catch (error) {
      console.error(error);
    }
  }


  useEffect(() => {
    let isCurrent = true;
    const loadNotes = async () => {
      try {
        const res = await getNotes();
        if (isCurrent && res.status === 'success') {
          setNotes(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadNotes();

    return () => {
      isCurrent = false;
    };
  }, [page])

  const onSubmit = async (data) => {
    try {
      let res;

      if (editId === null) {
        res = await api.AddNote(data);
      } else {
        data.noteId = editId
        res = await api.updateNote(data);
      }

      if (res.status === "success") {
        alert(
          editId === null
            ? "Note added!"
            : "Note updated!"
        );

        reset();
        setEditId(null);
        await getNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (note) => {
    setEditId(note._id)
    reset({
      title: note.title,
      content: note.content
    })
  }

  const handleDelete = async (noteId) => {
    if (!window.confirm('Delete this note?')) return;

    try {
      const res = await api.deleteNote(noteId);
      if (res.status === 'success') {
        setNotes((currentNotes) => currentNotes.filter((note) => note._id !== noteId));
        if (selectedNote?._id === noteId) setSelectedNote(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAskQuery = async (data) => {
    setIsAsking(true);
    setAskAnswer('');

    try {
      const response = await api.askQuery(data);
      const answer = response.data;

      setAskAnswer(
        typeof answer === 'string'
          ? answer
          : answer?.answer || answer?.response || answer?.message || 'No answer was returned.'
      );
      resetAsk();
    } catch (error) {
      setAskAnswer(error.message || 'Unable to answer that question right now.');
    } finally {
      setIsAsking(false);
    }
  }

  const closeAskModal = () => {
    setIsAskOpen(false);
    resetAsk();
    setAskAnswer('');
  }

  const handleNext=()=>{
    if(pagination.hasNextPage){
      setPage((prev)=>prev+1)
    }
  }
  const handlePrevious=()=>{
    if(pagination.hasPreviousPage){
      setPage((prev)=>prev-1)
    }
  }

  return (
    <main className="dashboard-shell">
      <section className="mx-auto max-w-5xl">
        <div className="dashboard-topbar">
          <div>
            <div className="flex items-center gap-3">
              <span className="brand-mark">N</span>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-600">NoteMind workspace</p>
            </div>
            <h1 className="dashboard-title mt-5 text-3xl font-bold tracking-tight sm:text-4xl">A calm place for busy thoughts</h1>
          </div>
          <div className="dashboard-actions shrink-0">
            <button
              type="button"
              onClick={() => setIsAskOpen(true)}
              className="ask-button rounded-xl px-4 py-2.5 text-sm font-bold transition"
            >
              <span aria-hidden="true">✦</span>
              Ask
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="logout-button rounded-xl px-4 py-2.5 text-sm font-bold transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="note-composer note-surface mx-auto p-6 sm:p-9">
          <div className="composer-heading">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-600">{editId !== null ? 'Editing note' : 'New note'}</p>
              <h2 className="mt-2 text-2xl font-bold text-stone-800 sm:text-3xl">What is on your mind?</h2>
            </div>
            <span className="hidden text-4xl text-brand-300 sm:block" aria-hidden="true">✦</span>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-5">
              <label className="dashboard-label block text-sm font-semibold">
                <span>Title</span>
                <input
                  type="text"
                  {...register('title')}
                  placeholder="Give your note a title"
                  className="note-input mt-2 w-full rounded-xl px-4 py-3 outline-none transition"
                />
                {errors.title && <span className="mt-1 block text-xs text-red-600">{errors.title.message}</span>}
              </label>
              <label className="dashboard-label block text-sm font-semibold">
                <span>Body</span>
                <textarea
                  rows="4"
                  {...register('content')}
                  placeholder="Start writing here..."
                  className="note-input mt-2 w-full resize-none rounded-xl px-4 py-3 outline-none transition"
                />
                {errors.content && <span className="mt-1 block text-xs text-red-600">{errors.content.message}</span>}
              </label>
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-600 sm:w-auto"
            >
              {editId !== null ? 'Update Note' : 'Add Note'}
            </button>
          </form>
        </div>

        <div className="notes-library mt-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-600">Your collection</p>
              <h2 className="mt-2 text-2xl font-bold text-stone-800 sm:text-3xl">Recent notes</h2>
            </div>
            <span className="rounded-full bg-[#f1e4d7] px-3 py-1 text-xs font-bold uppercase tracking-wider text-stone-600">{notes.length} {notes.length === 1 ? 'note' : 'notes'}</span>
          </div>
          {notes.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-3">
              {notes.map((note) => (
                <article key={note._id} className="note-card rounded-2xl p-4 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="note-card-title text-lg font-bold">{note.title}</h3>
                      <p className="note-card-copy mt-2 line-clamp-2 text-sm leading-6">
                        {note.content}</p>
                    </div>
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-400" aria-hidden="true" />
                  </div>
                  <div className="note-card-actions mt-5 flex gap-3 border-t pt-3">
                    <button type="button" className="text-sm font-bold transition" onClick={() => setSelectedNote(note)}>View</button>
                    <button type="button" className="note-edit-button text-sm font-bold transition" onClick={() => handleClick(note)}>Edit</button>
                    <button type="button" className="note-delete-button text-sm font-bold transition" onClick={() => handleDelete(note._id)}>Delete</button>
                  </div>
                </article>
              ))}
              <nav className="notes-pagination" aria-label="Notes pagination">
                <button
                  onClick={handlePrevious}
                  type="button"
                  className="pagination-arrow pagination-arrow-previous"
                  aria-label="Previous page"
                  disabled={!pagination.hasPreviousPage}
                >
                  <span aria-hidden="true">&lsaquo;</span>
                  <span>Previous</span>
                </button>

                <p className="pagination-status">
                  <span>Page</span>
                  <strong>{pagination.currentPage || page}</strong>
                  <span>of {pagination.totalPages || 1}</span>
                </p>

                <button
                  onClick={handleNext}
                  type="button"
                  className="pagination-arrow pagination-arrow-next"
                  aria-label="Next page"
                  disabled={!pagination.hasNextPage}
                >
                  <span>Next</span>
                  <span aria-hidden="true">&rsaquo;</span>
                </button>
              </nav>
            </div>
          ) : (
            <div className="empty-notes note-surface px-6 py-12 text-center">
              <span className="text-3xl text-brand-400" aria-hidden="true">✎</span>
              <h3 className="mt-4 text-lg font-bold text-stone-800">Your collection is waiting</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-stone-500">Capture an idea above and it will appear here, ready whenever you need it.</p>
            </div>
          )}
        </div>
      </section>

      {selectedNote && (
        <div className="note-modal-backdrop" role="presentation" onClick={() => setSelectedNote(null)}>
          <section className="note-modal" role="dialog" aria-modal="true" aria-labelledby="note-modal-title" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-600">Note details</p>
                <h2 id="note-modal-title" className="mt-2 text-2xl font-bold text-stone-800">{selectedNote.title}</h2>
              </div>
              <button type="button" className="modal-close" aria-label="Close note details" onClick={() => setSelectedNote(null)}>×</button>
            </div>
            <p className="note-modal-content mt-6 whitespace-pre-wrap text-sm leading-7">{selectedNote.content}</p>
            <div className="note-modal-footer mt-7 flex items-center justify-between gap-3">
              <span className="text-xs text-stone-500">Created {new Date(selectedNote.createdAt).toLocaleDateString()}</span>
              <button type="button" className="modal-action rounded-xl bg-brand-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-600" onClick={() => setSelectedNote(null)}>Done</button>
            </div>
          </section>
        </div>
      )}

      {isAskOpen && (
        <div className="note-modal-backdrop ask-modal-backdrop" role="presentation" onClick={closeAskModal}>
          <section className="ask-modal" role="dialog" aria-modal="true" aria-labelledby="ask-modal-title" onClick={(event) => event.stopPropagation()}>
            <div className="ask-modal-header">
              <div className="flex items-start gap-3">
                <span className="ask-avatar" aria-hidden="true">N</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-600">NoteMind assistant</p>
                  <h2 id="ask-modal-title" className="mt-1 text-2xl font-bold text-stone-800">Ask about your notes</h2>
                </div>
              </div>
              <button type="button" className="modal-close" aria-label="Close Ask assistant" onClick={closeAskModal}>×</button>
            </div>

            <div className="ask-chat-window" aria-live="polite">
              <div className={`ask-message ask-message-assistant${isAsking ? ' ask-message-thinking' : ''}`}>
                <span className="ask-message-label">Assistant</span>
                {isAsking ? (
                  <div className="ask-thinking" role="status" aria-label="Assistant is thinking">
                    <span>Thinking</span>
                    <span className="ask-thinking-dots" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                  </div>
                ) : (
                  <p>{askAnswer || 'Ask me anything about the ideas you have captured.'}</p>
                )}
              </div>
              {/* <div className="ask-suggestions" aria-hidden="true">
                <span>Summarize my notes</span>
                <span>Find related ideas</span>
              </div> */}
            </div>

            <form className="ask-input-row" onSubmit={handleAskSubmit(handleAskQuery)}>
              <input
                type="text"
                {...registerAsk('ques')}
                placeholder="Ask about your note..."
                aria-label="Ask about your note"
                autoFocus={!askAnswer}
              />
              <button type="submit" aria-label="Send question" title="Send question" className="ask-send-button" disabled={isAsking}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </form>
            {askErrors.ques && <p className="ask-form-error">{askErrors.ques.message}</p>}
            <p className="ask-modal-hint">Your assistant will use your saved notes to help you think.</p>
          </section>
        </div>
      )}
    </main>
  )
}

export default Notes
