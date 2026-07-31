<template>
  <div class="bubble-game">
    <div class="game-header">
      <span class="score">💖 {{ score }} 分</span>
    </div>
    <div class="game-area" ref="gameArea">
      <template v-for="bubble in bubbles" :key="bubble.id">
        <div
          class="bubble"
          :style="{
            left: bubble.x + 'px',
            bottom: bubble.y + 'px',
            width: bubble.size + 'px',
            height: bubble.size + 'px',
            fontSize: bubble.size * 0.6 + 'px',
            opacity: bubble.opacity
          }"
          @click.stop="popBubble(bubble)"
        >
          <span v-if="!bubble.popping">{{ bubble.emoji }}</span>
          <span v-else class="pop-particles">
            <i v-for="n in 6" :key="n" class="particle" :style="particleStyle(n)">💕</i>
          </span>
        </div>
      </template>
    </div>
    <div class="game-footer">
      <p class="hint">戳破爱心泡泡得分吧！</p>
    </div>
    <div v-if="showToast" class="toast glass-card">
      <p>{{ toastMsg }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { quotes } from '../../data/quotes.js'

const score = ref(0)
const bubbles = ref([])
const gameArea = ref(null)
const showToast = ref(false)
const toastMsg = ref('')
let bubbleId = 0
let spawnTimer = null
let moveTimer = null
let areaWidth = 300
let areaHeight = 400

const emojis = ['💖', '💕', '💗', '💝', '💘', '💓', '🫧', '🌸', '✨', '💎']

function particleStyle(n) {
  const angle = (n / 6) * 360
  const dist = 20 + Math.random() * 30
  return {
    '--angle': angle + 'deg',
    '--dist': dist + 'px'
  }
}

function spawnBubble() {
  const size = 40 + Math.random() * 30
  const bubble = {
    id: ++bubbleId,
    x: Math.random() * (areaWidth - size),
    y: -size,
    size,
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
    opacity: 0.6 + Math.random() * 0.4,
    speed: 0.5 + Math.random() * 1.2,
    popping: false
  }
  bubbles.value.push(bubble)
}

function popBubble(bubble) {
  if (bubble.popping) return
  bubble.popping = true
  score.value++

  setTimeout(() => {
    const idx = bubbles.value.indexOf(bubble)
    if (idx > -1) bubbles.value.splice(idx, 1)
  }, 400)

  if (score.value % 10 === 0) {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    toastMsg.value = randomQuote
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 2500)
  }
}

function updateBubbles() {
  if (!areaHeight) return
  for (const b of bubbles.value) {
    if (!b.popping) {
      b.y += b.speed
    }
  }
  bubbles.value = bubbles.value.filter(b => b.y < areaHeight + b.size)
}

function resize() {
  if (gameArea.value) {
    areaWidth = gameArea.value.clientWidth
    areaHeight = gameArea.value.clientHeight
  }
}

onMounted(async () => {
  await nextTick()
  resize()
  window.addEventListener('resize', resize)
  spawnTimer = setInterval(spawnBubble, 800)
  moveTimer = setInterval(updateBubbles, 16)
})

onUnmounted(() => {
  clearInterval(spawnTimer)
  clearInterval(moveTimer)
  window.removeEventListener('resize', resize)
})
</script>

<style scoped>
.bubble-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  position: relative;
}

.game-header {
  padding: 8px 0;
}

.score {
  font-size: 22px;
  font-weight: 700;
  color: var(--white);
  text-shadow: 0 1px 4px rgba(0,0,0,0.15);
}

.game-area {
  flex: 1;
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: var(--white-15);
  margin: 8px 0;
  min-height: 320px;
}

.bubble {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, rgba(255,255,255,0.9), rgba(255,154,158,0.5));
  box-shadow: 0 4px 15px rgba(255,154,158,0.35);
  transition: transform 0.15s;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  animation: float-wobble 2s ease-in-out infinite;
}

.bubble:active {
  transform: scale(0.85);
}

.pop-particles {
  position: relative;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  top: 50%;
  left: 50%;
  font-style: normal;
  animation: particle-burst 0.4s ease-out forwards;
  transform: translate(-50%, -50%)
    rotate(var(--angle))
    translateY(calc(var(--dist) * -1));
}

@keyframes particle-burst {
  0% { opacity: 1; transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0); }
  100% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--angle)) translateY(calc(var(--dist) * -1.5)); }
}

@keyframes float-wobble {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(4px); }
}

.game-footer {
  padding: 4px 0;
}

.hint {
  font-size: 13px;
  color: var(--white-80);
}

.toast {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 16px 24px;
  text-align: center;
  font-size: 15px;
  color: var(--text);
  z-index: 100;
  animation: toast-in 0.4s ease-out;
  max-width: 260px;
}

@keyframes toast-in {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
</style>
