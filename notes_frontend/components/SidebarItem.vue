<template>
  <button
    class="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition"
    :class="active ? 'bg-white/80 shadow ring-1 ring-pink-200' : 'hover:bg-white/60'"
    @click="$emit('click')"
  >
    <span class="text-lg">{{ icon }}</span>
    <span class="font-medium">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  icon?: string
  active?: boolean
}>()
defineEmits<{ (e: 'click'): void }>()
</script>
