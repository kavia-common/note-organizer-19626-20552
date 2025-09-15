<template>
  <header class="p-4 md:p-6 sticky top-0 z-20">
    <div class="ocean-card p-3 md:p-4 flex items-center gap-3 md:gap-4">
      <button class="md:hidden ocean-btn ocean-btn-secondary" @click="toggleDrawer">Menu</button>
      <div class="relative flex-1">
        <input
          :value="query"
          @input="$emit('update:query', ($event.target as HTMLInputElement).value)"
          class="w-full pl-10 pr-12 py-2"
          placeholder="Search notes..."
        />
        <span class="absolute left-3 top-1.5">🔎</span>
        <button class="absolute right-2 top-1.5 text-sm opacity-70 hover:opacity-100" @click="$emit('update:query','')">Clear</button>
      </div>
      <div class="flex items-center gap-2">
        <button class="ocean-btn ocean-btn-primary" @click="$emit('createNote')">New Note</button>
        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-white grid place-items-center font-bold">U</div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{ query: string }>()
defineEmits<{ (e: 'update:query', q: string): void; (e: 'createNote'): void }>()
function toggleDrawer() {
  // Simple placeholder if mobile sidebar were to be implemented later.
}
</script>
