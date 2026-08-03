<template>
  <div class="catch-game">
    <!-- 开始遮罩 -->
    <div v-if="!started" class="start-overlay glass-card">
      <p class="start-emoji">🧺</p>
      <p class="start-title">接爱心</p>
      <p class="start-desc">移动篮子接住下落的爱心，有5条命</p>
      <button class="btn" @click="beginGame">开始游戏</button>
    </div>

    <div class="game-header">
      <span class="lives">❤️ x {{ lives }}</span>
      <span class="score">💖 {{ score }} 分</span>
      <span class="speed">⚡ Lv.{{ level }}</span>
    </div>
    <div
      class="game-area"
      ref="gameArea"
      @touchmove.prevent="onMove"
      @touchstart.prevent="onMove"
      @mousemove="onMove"
    >
      <template v-for="heart in hearts" :key="heart.id">
        <div
          class="heart"
          :style="{ left: heart.x + 'px', top: heart.y + 'px', width: heart.size + 'px', height: heart.size + 'px' }"
        >
        <img :src="heart.image" class="heart-img" />
        </div>
      </template>
      <div
        class="basket"
        :style="{ left: basketX + 'px' }"
      >
        🧺
      </div>
    </div>
    <div class="game-footer">
      <p v-if="playing" class="hint">移动篮子接住爱心！</p>
    </div>
    <div v-if="!playing && started" class="game-over glass-card">
      <p class="go-emoji">{{ lives <= 0 ? '😢' : '🎉' }}</p>
      <p>{{ lives <= 0 ? '游戏结束' : '' }}</p>
      <p class="go-score">最终得分：{{ score }} 分</p>
      <button class="btn" @click="startGame">再来一次</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const lives = ref(5)
const score = ref(0)
const hearts = ref([])
const basketX = ref(130)
const playing = ref(false)
const started = ref(false)
const level = ref(1)
const gameArea = ref(null)
let areaWidth = 300
let areaHeight = 400
let heartId = 0
let spawnTimer = null
let fallTimer = null

const heartImages = [
  import.meta.env.BASE_URL + 'images/heart/heart-01.svg',
  import.meta.env.BASE_URL + 'images/heart/heart-02.svg',
  import.meta.env.BASE_URL + 'images/heart/heart-03.svg',
  import.meta.env.BASE_URL + 'images/heart/heart-04.svg',
  import.meta.env.BASE_URL + 'images/heart/heart-05.svg',
  import.meta.env.BASE_URL + 'images/heart/heart-06.svg',
  import.meta.env.BASE_URL + 'images/heart/heart-07.svg',
  import.meta.env.BASE_URL + 'images/heart/heart-08.svg'
]

function getLevel() {
  return Math.floor(score.value / 5) + 1
}

function getSpawnInterval() {
  return Math.max(450, 1100 - (getLevel() - 1) * 100)
}

function getSpeedMul() {
  return 0.8 + (getLevel() - 1) * 0.2
}

function spawnHeart() {
  const size = 22 + Math.random() * 16
  const mul = getSpeedMul()
  heartId++
  hearts.value.push({
    id: heartId,
    x: Math.random() * (areaWidth - size),
    y: -size,
    size,
    image: heartImages[Math.floor(Math.random() * heartImages.length)],
    speed: (1.0 + Math.random() * 2.0) * mul
  })
  level.value = getLevel()
  scheduleSpawn()
}

function scheduleSpawn() {
  spawnTimer = setTimeout(spawnHeart, getSpawnInterval())
}

function updateHearts() {
  const basketLeft = basketX.value
  const basketRight = basketLeft + 60
  const basketTop = areaHeight - 60

  for (const heart of hearts.value) {
    heart.y += heart.speed
  }

  const missed = []
  const caught = []
  for (const heart of hearts.value) {
    if (heart.y > areaHeight) {
      missed.push(heart)
    } else if (heart.y + heart.size >= basketTop && heart.y <= basketTop + 30) {
      const hx = heart.x + heart.size / 2
      if (hx >= basketLeft && hx <= basketRight) {
        caught.push(heart)
      }
    }
  }

  if (caught.length > 0) {
    score.value += caught.length
    hearts.value = hearts.value.filter(h => !caught.includes(h))
  }

  if (missed.length > 0) {
    lives.value -= missed.length
    hearts.value = hearts.value.filter(h => !missed.includes(h))
    if (lives.value <= 0) {
      lives.value = 0
      stopGame()
    }
  }
}

function stopGame() {
  playing.value = false
  clearTimeout(spawnTimer)
  clearInterval(fallTimer)
}

function onMove(e) {
  if (!playing.value) return
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const rect = gameArea.value.getBoundingClientRect()
  const x = clientX - rect.left - 30
  basketX.value = Math.max(0, Math.min(areaWidth - 60, x))
}

function startGame() {
  lives.value = 5
  score.value = 0
  hearts.value = []
  level.value = 1
  playing.value = true
  basketX.value = areaWidth / 2 - 30
  scheduleSpawn()
  fallTimer = setInterval(updateHearts, 16)
}

function beginGame() {
  started.value = true
  startGame()
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
})

onUnmounted(() => {
  clearTimeout(spawnTimer)
  clearInterval(fallTimer)
  window.removeEventListener('resize', resize)
})
</script>

<style scoped>
.catch-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  position: relative;
}

.game-header {
  display: flex;
  gap: 16px;
  padding: 8px 0;
  font-size: 16px;
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
  touch-action: none;
  user-select: none;
}

.heart {
  position: absolute;
  pointer-events: none;
  filter: drop-shadow(0 2px 6px rgba(255,100,120,0.5));
  transition: none;
}

.heart-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.basket {
  position: absolute;
  bottom: 8px;
  font-size: 40px;
  width: 60px;
  text-align: center;
  pointer-events: none;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.2));
  transition: left 0.05s linear;
}

.game-footer {
  padding: 4px 0;
}

.hint {
  font-size: 13px;
  color: var(--white-80);
}

.game-over {
  position: absolute;
  top: 30%;
  left: 16px;
  right: 16px;
  padding: 24px;
  text-align: center;
  z-index: 100;
  animation: toast-in 0.4s ease-out;
}

.go-emoji {
  font-size: 48px;
  margin-bottom: 8px;
}

.go-score {
  font-size: 18px;
  font-weight: 600;
  margin: 8px 0 16px;
  color: var(--pink-deep);
}

@keyframes toast-in {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

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
