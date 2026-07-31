<template>
  <div class="countdown-display">
    <div class="days-number number-font" ref="daysRef">{{ displayDays }}</div>
    <div class="days-label">我们在一起的第</div>
    <div class="days-label-sub">天</div>

    <div class="duration-row">
      <div class="duration-item">
        <span class="duration-num number-font">{{ displayDuration.years }}</span>
        <span class="duration-unit">年</span>
      </div>
      <div class="duration-item">
        <span class="duration-num number-font">{{ displayDuration.months }}</span>
        <span class="duration-unit">个月</span>
      </div>
      <div class="duration-item">
        <span class="duration-num number-font">{{ displayDuration.days }}</span>
        <span class="duration-unit">天</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  days: { type: Number, default: 0 },
  duration: { type: Object, default: () => ({ years: 0, months: 0, days: 0 }) }
})

const displayDays = ref(0)
const displayDuration = ref({ years: 0, months: 0, days: 0 })

function animateValue(key, from, to, duration = 1200) {
  const start = performance.now()
  function tick(now) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    if (key === 'days') {
      displayDays.value = Math.floor(from + (to - from) * eased)
    } else {
      displayDuration.value = {
        ...displayDuration.value,
        [key]: Math.floor(from + (to - from) * eased)
      }
    }
    if (progress < 1) {
      requestAnimationFrame(tick)
    }
  }
  requestAnimationFrame(tick)
}

watch(() => props.days, (val) => {
  animateValue('days', 0, val)
}, { immediate: true })

watch(() => props.duration, (val) => {
  animateValue('years', 0, val.years, 1000)
  animateValue('months', 0, val.months, 800)
  animateValue('days', 0, val.days, 600)
}, { immediate: true, deep: true })
</script>

<style scoped>
.countdown-display {
  text-align: center;
  padding: 20px 0;
}

.days-number {
  font-size: 72px;
  font-weight: 700;
  background: linear-gradient(135deg, #ff6b8a, #e8728a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
}

.days-label {
  font-size: 18px;
  color: var(--text-light);
  margin-top: 4px;
}

.days-label-sub {
  font-size: 16px;
  color: var(--text-light);
  margin-bottom: 20px;
}

.duration-row {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.duration-item {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.duration-num {
  font-size: 28px;
  font-weight: 700;
  color: #e8728a;
}

.duration-unit {
  font-size: 14px;
  color: var(--text-light);
}
</style>
