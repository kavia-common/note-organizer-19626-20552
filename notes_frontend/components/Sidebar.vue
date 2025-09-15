<template>
  <aside class="w-72 hidden md:flex flex-col gap-4 p-4 md:p-6 backdrop-blur-lg">
    <div class="ocean-card p-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 shadow-md flex items-center justify-center text-white font-extrabold">
          N
        </div>
        <div>
          <h1 class="text-lg font-bold" style="color: var(--color-text)">Ocean Notes</h1>
          <p class="text-sm opacity-70">Playful productivity</p>
        </div>
      </div>
    </div>

    <div class="ocean-card p-3">
      <nav class="flex flex-col gap-1">
        <SidebarItem
          label="All Notes"
          icon="🗒️"
          :active="activeSection === 'all'"
          @click="$emit('selectSection','all')"
        />
        <SidebarItem
          label="Pinned"
          icon="📌"
          :active="activeSection === 'pinned'"
          @click="$emit('selectSection','pinned')"
        />
        <SidebarItem
          label="Archived"
          icon="📦"
          :active="activeSection === 'archived'"
          @click="$emit('selectSection','archived')"
        />
        <SidebarItem
          label="Trash"
          icon="🗑️"
          :active="activeSection === 'trash'"
          @click="$emit('selectSection','trash')"
        />
      </nav>
    </div>

    <div class="ocean-card p-3">
      <div class="flex items-center justify-between mb-2">
        <h2 class="font-semibold">Tags</h2>
        <button class="ocean-btn ocean-btn-secondary text-sm" @click="adding = !adding">{{ adding ? 'Cancel' : 'Add' }}</button>
      </div>
      <div v-if="adding" class="flex gap-2 mb-3">
        <input v-model="newTag" class="flex-1" placeholder="New tag e.g. learning" @keyup.enter="addNewTag" />
        <button class="ocean-btn ocean-btn-primary" @click="addNewTag">Save</button>
      </div>
      <div class="flex flex-wrap gap-2">
        <TagPill
          label="all"
          :active="activeTag === 'all'"
          @click="$emit('selectTag','all')"
        />
        <TagPill
          v-for="t in tags"
          :key="t"
          :label="t"
          :active="activeTag === t"
          @click="$emit('selectTag', t)"
        />
      </div>
    </div>

    <div class="mt-auto text-xs opacity-70 px-2">
      <p>Theme: Ocean Professional</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
/**
 * Sidebar allows navigating sections and tags.
 */
import { ref } from 'vue'
import SidebarItem from './SidebarItem.vue'
import TagPill from './TagPill.vue'

defineProps<{
  activeSection: 'all'|'pinned'|'archived'|'trash',
  tags: string[],
  activeTag: string
}>()

const emit = defineEmits<{
  (e: 'selectSection', val: 'all'|'pinned'|'archived'|'trash'): void
  (e: 'selectTag', val: string): void
  (e: 'addTag', val: string): void
}>()

const adding = ref(false)
const newTag = ref('')

function addNewTag() {
  const t = newTag.value.trim()
  if (!t) return
  emit('addTag', t)
  newTag.value = ''
  adding.value = false
}
</script>
