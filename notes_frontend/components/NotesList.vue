<template>
  <div class="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
    <article
      v-for="n in notes"
      :key="n.id"
      class="ocean-card p-4 cursor-pointer transition hover:-translate-y-0.5"
      :style="{ background: n.color || 'white' }"
      @click="$emit('select', n.id)"
    >
      <div class="flex items-start justify-between mb-2">
        <h3 class="font-bold text-lg leading-tight">{{ n.title || 'Untitled' }}</h3>
        <button
          class="text-xl"
          title="Pin"
          @click.stop="$emit('togglePin', n.id)"
        >{{ n.pinned ? '📌' : '📍' }}</button>
      </div>
      <p class="whitespace-pre-line text-sm opacity-80 line-clamp-5">{{ n.content || '—' }}</p>
      <div class="mt-3 flex flex-wrap gap-2">
        <span
          v-for="t in n.tags"
          :key="t"
          class="px-2 py-0.5 rounded-full text-xs bg-white/70 border border-purple-200"
        >#{{ t }}</span>
      </div>
      <div class="mt-3 flex items-center justify-between text-xs opacity-70">
        <span>{{ new Date(n.updatedAt).toLocaleString() }}</span>
        <div class="flex gap-2">
          <button class="hover:opacity-100 opacity-80" title="Archive" @click.stop="$emit('archive', n.id)">📦</button>
          <button class="hover:opacity-100 opacity-80" title="Delete" @click.stop="$emit('delete', n.id)">🗑️</button>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import type { Note } from '~/stores/notes'

defineProps<{ notes: Note[] }>()
defineEmits<{
  (e: 'select', id: string): void
  (e: 'delete', id: string): void
  (e: 'archive', id: string): void
  (e: 'togglePin', id: string): void
}>()
</script>

<style scoped>
.line-clamp-5 {
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
