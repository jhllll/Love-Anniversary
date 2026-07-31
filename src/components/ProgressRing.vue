<template>
  <div class="progress-ring">
    <svg viewBox="0 0 120 120" class="ring-svg">
      <defs>
        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ff9a9e" />
          <stop offset="100%" stop-color="#e8728a" />
        </linearGradient>
      </defs>
      <circle
        cx="60" cy="60" r="52"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        stroke-width="6"
      />
      <circle
        cx="60" cy="60" r="52"
        fill="none"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        stroke-width="6"
        stroke-linecap="round"
        class="ring-progress"
      />
    </svg>
    <div class="ring-text">
      <div class="ring-label">距离</div>
      <div class="ring-label">纪念日</div>
      <div class="ring-days number-font">{{ days }}</div>
      <div class="ring-days-label">天</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  progress: { type: Number, default: 0 },
  days: { type: Number, default: 0 }
})

const circumference = 2 * Math.PI * 52
const dashOffset = computed(() => {
  return circumference - (props.progress / 100) * circumference
})
</script>

<style scoped>
.progress-ring {
  position: relative;
  width: 160px;
  height: 160px;
  margin: 0 auto;
}

.ring-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-progress {
  stroke: url(#ringGradient);
  transition: stroke-dashoffset 1.5s ease;
  filter: drop-shadow(0 0 6px rgba(255, 154, 158, 0.6));
}

.ring-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.ring-label {
  font-size: 13px;
  color: var(--text-light);
  line-height: 1.4;
}

.ring-days {
  font-size: 32px;
  font-weight: 700;
  color: #e8728a;
  line-height: 1.1;
}

.ring-days-label {
  font-size: 12px;
  color: var(--text-light);
}
</style>
