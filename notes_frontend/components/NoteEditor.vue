<template>
  <div v-if="note" class="ocean-card p-4 md:p-6">
    <div class="flex items-center gap-2 justify-between">
      <input
        class="w-full text-xl md:text-2xl font-bold"
        :value="note.title"
        @input="onTitle(($event.target as HTMLInputElement).value)"
        placeholder="Note title"
      />
      <div class="flex items-center gap-2">
        <input type="color" :value="note.color || '#ffffff'" @input="onColor(($event.target as HTMLInputElement).value)" title="Note color" />
        <button class="ocean-btn ocean-btn-secondary" @click="$emit('togglePin', note.id)">{{ note.pinned ? 'Unpin' : 'Pin' }}</button>
        <button class="ocean-btn ocean-btn-secondary" @click="$emit('archive', note.id)">{{ note.archived ? 'Unarchive' : 'Archive' }}</button>
        <button class="ocean-btn ocean-btn-secondary" @click="$emit('delete', note.id)">{{ note.trashed ? 'Delete permanently' : 'Move to trash' }}</button>
      </div>
    </div>

    <textarea
      class="w-full mt-3 min-h-[200px]"
      :value="note.content"
      @input="onContent(($event.target as HTMLTextAreaElement).value)"
      placeholder="Start writing..."
    ></textarea>

    <div class="mt-4 flex items-center gap-2 flex-wrap">
      <div class="flex items-center gap-2">
        <span class="text-sm opacity-70">Tags:</span>
        <div class="flex gap-1 flex-wrap">
          <button
            v-for="t in note.tags"
            :key="t"
            class="px-2 py-0.5 rounded-full text-xs bg-white/70 border border-purple-200"
            @click="removeTag(t)"
            title="Remove tag"
          >
            #{{ t }} ✕
          </button>
        </div>
      </div>
      <div class="flex items-center gap-2 ml-auto">
        <input v-model="tagInput" class="text-sm" placeholder="Add tag" @keyup.enter="addTag" />
        <button class="ocean-btn ocean-btn-primary text-sm" @click="addTag">Add</button>
      </div>
    </div>
  </div>
  <div v-else class="ocean-card p-10 grid place-items-center text-center">
    <div>
      <div class="text-5xl mb-4">🌊</div>
      <p class="font-semibold mb-2">No note selected</p>
      <p class="opacity-70">Create a new note or select one from the list to start editing.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Note } from '~/stores/notes'
const props = defineProps<{ note: Note | null }>()
const emit = defineEmits<{
  (e: 'update', payload: { id: string; data: Partial<Note> }): void
  (e: 'delete', id: string): void
  (e: 'togglePin', id: string): void
  (e: 'archive', id: string): void
}>()

import { ref } from 'vue'
const tagInput = ref('')

function onTitle(v: string) {
  if (!props.note) return
  emit('update', { id: props.note.id, data: { title: v } })
}
function onContent(v: string) {
  if (!props.note) return
  emit('update', { id: props.note.id, data: { content: v } })
}
function onColor(v: string) {
  if (!props.note) return
  emit('update', { id: props.note.id, data: { color: v } })
}
function addTag() {
  if (!props.note) return
  const t = tagInput.value.trim()
  if (!t) return
  const set = new Set(props.note.tags)
  set.add(t)
  emit('update', { id: props.note.id, data: { tags: Array.from(set) } })
  tagInput.value = ''
}
function removeTag(t: string) {
  if (!props.note) return
  emit('update', { id: props.note.id, data: { tags: props.note.tags.filter(x => x !== t) } })
}
</script>
