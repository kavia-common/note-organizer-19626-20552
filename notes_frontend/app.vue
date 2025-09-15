<template>
  <div class="min-h-screen flex bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
    <!-- Sidebar -->
    <Sidebar
      :active-section="activeSection"
      :tags="tags"
      :active-tag="filters.tag"
      @selectSection="onSelectSection"
      @selectTag="onSelectTag"
      @addTag="onAddTag"
    />

    <!-- Main content area -->
    <div class="flex-1 flex flex-col">
      <!-- Topbar -->
      <Topbar
        :query="filters.query"
        @update:query="onQueryChange"
        @createNote="createNote"
      />

      <!-- Main view -->
      <main class="p-4 sm:p-6 md:p-8">
        <NuxtPage
          :notes="filteredNotes"
          :active-note-id="activeNoteId"
          @updateNote="updateNote"
          @deleteNote="deleteNote"
          @selectNote="selectNote"
          @togglePin="togglePin"
        />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * App shell provides the global layout and wires the store with top-level filters.
 * Ocean Professional theme is applied via CSS variables and utility classes.
 */
import { onMounted, ref, computed, watch } from 'vue'
import Sidebar from '~/components/Sidebar.vue'
import Topbar from '~/components/Topbar.vue'
import { useNotesStore } from '~/stores/notes'

const notesStore = useNotesStore()

const filters = ref({
  query: '',
  tag: 'all',
  section: 'all' as 'all' | 'pinned' | 'archived' | 'trash'
})

const activeSection = computed(() => filters.value.section)

const tags = computed(() => notesStore.tags)

const activeNoteId = computed(() => notesStore.activeNoteId)

const filteredNotes = computed(() => {
  return notesStore.getFilteredNotes({
    query: filters.value.query,
    tag: filters.value.tag,
    section: filters.value.section
  })
})

function onSelectSection(section: 'all'|'pinned'|'archived'|'trash') {
  filters.value.section = section
}
function onSelectTag(tag: string) {
  filters.value.tag = tag
  filters.value.section = 'all'
}
function onAddTag(tag: string) {
  notesStore.addTag(tag)
}
function onQueryChange(q: string) {
  filters.value.query = q
}

function createNote() {
  notesStore.createNote()
}

function updateNote(payload: { id: string, data: Partial<Note> }) {
  notesStore.updateNote(payload.id, payload.data)
}

function deleteNote(id: string) {
  notesStore.deleteNote(id)
}

function selectNote(id: string) {
  notesStore.setActiveNote(id)
}

function togglePin(id: string) {
  // notes is a Ref<Note[]>, use .value to access the array
  const note = notesStore.notes.value.find(n => n.id === id)
  if (note) {
    notesStore.updateNote(id, { pinned: !note.pinned })
  }
}

onMounted(() => {
  notesStore.initialize()
})

watch(() => notesStore.notes, () => {
  notesStore.persist()
}, { deep: true })
</script>

<style>
:root {
  --color-primary: #EC4899;
  --color-secondary: #8B5CF6;
  --color-success: #10B981;
  --color-error: #EF4444;
  --color-bg: #FDF2F8;
  --color-surface: #FFFFFF;
  --color-text: #374151;
}

html, body, #__nuxt {
  height: 100%;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji";
}

.ocean-card {
  background: var(--color-surface);
  border-radius: 16px;
  box-shadow:
    0 10px 20px rgba(139, 92, 246, 0.12),
    0 6px 6px rgba(236, 72, 153, 0.10);
  border: 1px solid rgba(236, 72, 153, 0.08);
}

.ocean-btn {
  border-radius: 9999px;
  padding: 10px 16px;
  font-weight: 600;
  transition: transform 0.05s ease, box-shadow 0.2s ease, background 0.2s ease;
}
.ocean-btn:active {
  transform: translateY(1px);
}
.ocean-btn-primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.25), 0 6px 12px rgba(139, 92, 246, 0.2);
}
.ocean-btn-secondary {
  background: linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.15));
  color: var(--color-text);
  border: 1px solid rgba(139,92,246,0.25);
}

input, textarea {
  border-radius: 12px;
  border: 1px solid rgba(139,92,246,0.25);
  background: white;
  padding: 10px 12px;
  outline: none;
}
input:focus, textarea:focus {
  border-color: var(--color-secondary);
  box-shadow: 0 0 0 3px rgba(139,92,246,0.2);
}
</style>
