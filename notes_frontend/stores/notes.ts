import { ref } from 'vue'

export type Note = {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
  tags: string[]
  color?: string
  pinned?: boolean
  archived?: boolean
  trashed?: boolean
}

type Filter = {
  query?: string
  tag?: string
  section?: 'all'|'pinned'|'archived'|'trash'
}

const STORAGE_KEY = 'notes_app_v1'
const TAGS_KEY = 'notes_app_tags_v1'
const ACTIVE_KEY = 'notes_app_active_v1'

let _storeSingleton: ReturnType<typeof _createNotesStore> | null = null

function _createId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function _now() {
  return Date.now()
}

/**
 * Simple lightweight store tailored for Nuxt 3 without external deps.
 * This mimics a Pinia-like usage but avoids adding packages.
 */
// PUBLIC_INTERFACE
export function useNotesStore() {
  /** Create singleton store instance */
  if (_storeSingleton) return _storeSingleton
  _storeSingleton = _createNotesStore()
  return _storeSingleton
}

function _createNotesStore() {
  const notes = ref<Note[]>([])
  const tags = ref<string[]>(['work', 'personal', 'ideas'])
  const activeNoteId = ref<string | null>(null)

  // PUBLIC_INTERFACE
  function initialize(): void {
    /** Initialize store state by loading from localStorage if available. */
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      const savedTags = localStorage.getItem(TAGS_KEY)
      const savedActive = localStorage.getItem(ACTIVE_KEY)
      if (saved) notes.value = JSON.parse(saved)
      if (savedTags) tags.value = JSON.parse(savedTags)
      if (savedActive) activeNoteId.value = JSON.parse(savedActive)
      if (notes.value.length === 0) {
        // Seed with a welcome note to showcase the style
        const id = _createId()
        const now = _now()
        notes.value.push({
          id,
          title: 'Welcome to Ocean Notes',
          content: 'Create, edit, and organize your thoughts with a splash of color! 🎉\n\nUse the sidebar to filter by tags or sections, and try pinning important notes.',
          createdAt: now,
          updatedAt: now,
          tags: ['ideas'],
          color: '#FCE7F3',
          pinned: true,
          archived: false,
          trashed: false
        })
        activeNoteId.value = id
      }
    } catch (e) {
      // ignore
    }
  }

  // PUBLIC_INTERFACE
  function persist(): void {
    /** Persist notes and tags to localStorage. */
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes.value))
      localStorage.setItem(TAGS_KEY, JSON.stringify(tags.value))
      localStorage.setItem(ACTIVE_KEY, JSON.stringify(activeNoteId.value))
    } catch (e) {
      // ignore quota errors in CI
    }
  }

  // PUBLIC_INTERFACE
  function createNote(): string {
    /** Create a new note and set it active. Returns the note id. */
    const id = _createId()
    const now = _now()
    const newNote: Note = {
      id,
      title: 'Untitled',
      content: '',
      createdAt: now,
      updatedAt: now,
      tags: [],
      color: '#FFFFFF',
      pinned: false,
      archived: false,
      trashed: false
    }
    notes.value.unshift(newNote)
    activeNoteId.value = id
    persist()
    return id
  }

  // PUBLIC_INTERFACE
  function updateNote(id: string, data: Partial<Note>): void {
    /** Update a note by id with partial fields. */
    const idx = notes.value.findIndex(n => n.id === id)
    if (idx === -1) return
    const existing = notes.value[idx]
    notes.value[idx] = {
      ...existing,
      ...data,
      updatedAt: _now()
    }
    persist()
  }

  // PUBLIC_INTERFACE
  function deleteNote(id: string): void {
    /** Soft-delete a note to trash; if already in trash, delete permanently. */
    const n = notes.value.find(n => n.id === id)
    if (!n) return
    if (n.trashed) {
      const idx = notes.value.findIndex(x => x.id === id)
      if (idx !== -1) notes.value.splice(idx, 1)
      if (activeNoteId.value === id) activeNoteId.value = null
    } else {
      n.trashed = true
      n.pinned = false
      n.archived = false
      n.updatedAt = _now()
    }
    persist()
  }

  // PUBLIC_INTERFACE
  function restoreFromTrash(id: string): void {
    /** Restore a trashed note back to active. */
    const n = notes.value.find(n => n.id === id)
    if (!n) return
    n.trashed = false
    n.updatedAt = _now()
    persist()
  }

  // PUBLIC_INTERFACE
  function archiveNote(id: string): void {
    /** Archive a note. */
    const n = notes.value.find(n => n.id === id)
    if (!n) return
    n.archived = true
    n.pinned = false
    n.updatedAt = _now()
    persist()
  }

  // PUBLIC_INTERFACE
  function unarchiveNote(id: string): void {
    /** Unarchive a note. */
    const n = notes.value.find(n => n.id === id)
    if (!n) return
    n.archived = false
    n.updatedAt = _now()
    persist()
  }

  // PUBLIC_INTERFACE
  function setActiveNote(id: string | null): void {
    /** Set the active note id. */
    activeNoteId.value = id
    persist()
  }

  // PUBLIC_INTERFACE
  function addTag(tag: string): void {
    /** Add a new tag to the collection. */
    const t = tag.trim()
    if (!t) return
    if (!tags.value.includes(t)) {
      tags.value.push(t)
      tags.value.sort((a, b) => a.localeCompare(b))
      persist()
    }
  }

  // PUBLIC_INTERFACE
  function getFilteredNotes(filter: Filter): Note[] {
    /** Return notes filtered by query, tag, and section with smart ordering. */
    let arr = [...notes.value]

    if (filter.section === 'pinned') {
      arr = arr.filter(n => n.pinned && !n.archived && !n.trashed)
    } else if (filter.section === 'archived') {
      arr = arr.filter(n => n.archived && !n.trashed)
    } else if (filter.section === 'trash') {
      arr = arr.filter(n => n.trashed)
    } else {
      arr = arr.filter(n => !n.archived && !n.trashed)
    }

    if (filter.tag && filter.tag !== 'all') {
      arr = arr.filter(n => n.tags.includes(filter.tag!))
    }

    if (filter.query) {
      const q = filter.query.toLowerCase()
      arr = arr.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
      )
    }

    // Order: pinned first, then by updatedAt desc
    arr.sort((a, b) => {
      if ((b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) !== 0) {
        return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)
      }
      return b.updatedAt - a.updatedAt
    })
    return arr
  }

  return {
    notes,
    tags,
    activeNoteId,
    initialize,
    persist,
    createNote,
    updateNote,
    deleteNote,
    setActiveNote,
    restoreFromTrash,
    archiveNote,
    unarchiveNote,
    addTag,
    getFilteredNotes
  }
}

export type { Filter }
