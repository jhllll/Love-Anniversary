<template>
  <div class="quote-card glass-card">
    <div class="quote-icon">"</div>
    <p class="quote-text">{{ text }}</p>
    <div class="quote-actions">
      <button
        class="fav-btn"
        :class="{ 'fav-btn--active': favorited }"
        @click="$emit('toggle-favorite')"
        :aria-label="favorited ? '取消收藏' : '收藏'"
      >
        {{ favorited ? '❤' : '🤍' }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  text: { type: String, required: true },
  favorited: { type: Boolean, default: false }
})

defineEmits(['toggle-favorite'])
</script>

<style scoped>
.quote-card {
  padding: 32px 24px;
  text-align: center;
  position: relative;
  animation: fadeInUp 0.5s ease;
}

.quote-icon {
  font-size: 48px;
  color: var(--pink);
  opacity: 0.3;
  line-height: 1;
  margin-bottom: 12px;
  font-family: Georgia, serif;
}

.quote-text {
  font-size: 20px;
  line-height: 1.8;
  color: var(--text);
  padding: 0 8px;
  min-height: 60px;
}

.quote-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.fav-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  transition: transform 0.3s ease;
  -webkit-tap-highlight-color: transparent;
}

.fav-btn:active {
  transform: scale(1.3);
}

.fav-btn--active {
  animation: heartbeat 0.6s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes heartbeat {
  0% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(1); }
  75% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
</style>
