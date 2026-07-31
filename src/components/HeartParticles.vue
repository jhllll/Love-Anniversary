<script setup>
import { computed } from 'vue'

const particles = computed(() => {
  return Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 10}s`,
    animationDuration: `${8 + Math.random() * 12}s`,
    fontSize: `${10 + Math.random() * 18}px`,
    opacity: 0.08 + Math.random() * 0.12
  }))
})
</script>

<template>
  <div class="heart-particles" aria-hidden="true">
    <span
      v-for="p in particles"
      :key="p.id"
      class="particle"
      :style="{
        left: p.left,
        animationDelay: p.animationDelay,
        animationDuration: p.animationDuration,
        fontSize: p.fontSize,
        opacity: p.opacity
      }"
    >❤</span>
  </div>
</template>

<style scoped>
.heart-particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  top: -30px;
  animation: fall linear infinite;
  color: #ff9a9e;
}

@keyframes fall {
  0% {
    transform: translateY(-30px) rotate(0deg);
    opacity: 0;
  }
  5% {
    opacity: var(--opacity, 0.1);
  }
  90% {
    opacity: var(--opacity, 0.1);
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}
</style>
