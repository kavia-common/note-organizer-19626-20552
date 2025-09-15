<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
    <section class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold">Notes</h2>
        <div class="text-sm opacity-70">{{ notes.length }} items</div>
      </div>
      <NotesList
        :notes="notes"
        @select="id => $emit('selectNote', id)"
        @delete="id => $emit('deleteNote', id)"
        @archive="onArchive"
        @togglePin="id => $emit('togglePin', id)"
      />
    </section>

    <section>
      <NoteEditor
        :note="activeNote"
        @update="payload => $emit('updateNote', payload)"
        @delete="id => $emit('deleteNote', id)"
        @togglePin="id => $emit('togglePin', id)"
        @archive="onArchive"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import NotesList from '~/components/NotesList.vue'
import NoteEditor from '~/components/NoteEditor.vue'
import type { Note } from '~/stores/notes'
import { computed } from 'vue'
import { useNotesStore } from '~/stores/notes'

const props = defineProps<{
  notes: Note[],
  activeNoteId: string | null
}>()

defineEmits<{
  (e: 'updateNote', payload: { id: string; data: Partial<Note> }): void
  (e: 'deleteNote', id: string): void
  (e: 'selectNote', id: string): void
  (e: 'togglePin', id: string): void
}>()

const store = useNotesStore()
const activeNote = computed(() => store.notes.value.find(n => n.id === props.activeNoteId) ?? null)

function onArchive(id: string) {
  const n = store.notes.value.find(n => n.id === id)
  if (!n) return
  if (n.archived) store.unarchiveNote(id)
  else store.archiveNote(id)
}
</script>
