<template>
  <button
    class="px-3 py-1 rounded-full text-sm transition"
    :class="active ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow' : 'bg-white/80 border border-purple-200 hover:bg-white'"
    @click="$emit('click')"
  >
    #{{ label }}
  </button>
</template>

<script setup lang="ts">
defineProps<{ label: string; active?: boolean }>()
defineEmits<{ (e: 'click'): void }>()
</script>
