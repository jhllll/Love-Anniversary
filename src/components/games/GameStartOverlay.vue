<template>
  <div class="start-overlay glass-card">
    <p class="start-emoji">{{ emoji }}</p>
    <p class="start-title">{{ title }}</p>
    <p class="start-desc">{{ description }}</p>
    <button class="btn" @click="$emit('start')">{{ buttonText }}</button>
  </div>
</template>

<script setup>
defineProps({
  emoji: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  buttonText: { type: String, default: '开始游戏' }
})

defineEmits(['start'])
</script>

<style scoped>
.start-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  z-index: 50;
  text-align: center;
  padding: 24px;
}

.start-emoji {
  font-size: 48px;
}

.start-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--pink-deep);
}

.start-desc {
  font-size: 13px;
  color: var(--text-light);
  margin-bottom: 8px;
}
</style>
