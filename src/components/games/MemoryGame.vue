<template>
  <div class="memory-game">
    <!-- 开始遮罩 -->
    <GameStartOverlay
      v-if="!started"
      emoji="🃏"
      title="翻牌记忆"
      description="记住每张卡片的位置，找出所有配对"
      @start="startGame"
    />

    <!-- 预览倒计时 -->
    <div v-if="previewing" class="preview-overlay">
      <span class="preview-count" :key="previewCount">{{ previewCount }}</span>
    </div>

    <div class="game-header">
      <span class="moves">👣 {{ moves }} 步</span>
      <span class="pairs">✅ {{ matched }}/8 对</span>
    </div>

    <div class="board">
      <button
        v-for="(card, idx) in cards"
        :key="idx"
        class="card glass-card"
        :class="{
          flipped: card.flipped,
          matched: card.matched,
          preview: previewing
        }"
        :disabled="card.flipped || card.matched || lockBoard || previewing"
        @click="flipCard(idx)"
      >
        <img
          v-show="card.flipped || card.matched || previewing"
          class="card-front"
          :src="card.image"
          :alt="'卡牌'"
        />
        <span
          v-show="!card.flipped && !card.matched && !previewing"
          class="card-back"
        >❓</span>
      </button>
    </div>

    <div class="game-footer">
      <button class="btn" @click="resetGame">重新开始</button>
    </div>

    <div v-if="showCelebrate" class="celebrate glass-card">
      <p class="celebrate-emoji">🎉💖🎉</p>
      <p>太棒了！全部配对成功！</p>
      <p class="celebrate-quote">{{ celebrateQuote }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onDeactivated } from 'vue'
import { quotes } from '../../data/quotes.js'
import GameStartOverlay from './GameStartOverlay.vue'

const cardImages = [
  import.meta.env.BASE_URL + 'images/memory/card-01.svg',
  import.meta.env.BASE_URL + 'images/memory/card-02.svg',
  import.meta.env.BASE_URL + 'images/memory/card-03.svg',
  import.meta.env.BASE_URL + 'images/memory/card-04.svg',
  import.meta.env.BASE_URL + 'images/memory/card-05.svg',
  import.meta.env.BASE_URL + 'images/memory/card-06.svg',
  import.meta.env.BASE_URL + 'images/memory/card-07.svg',
  import.meta.env.BASE_URL + 'images/memory/card-08.svg'
]

const cards = ref([])
const moves = ref(0)
const matched = ref(0)
const lockBoard = ref(false)
const showCelebrate = ref(false)
const celebrateQuote = ref('')
const started = ref(false)
const previewing = ref(false)
const previewCount = ref(3)
let firstCard = null
let secondCard = null
let previewTimer = null

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function initCards() {
  const pairs = [...cardImages, ...cardImages]
  const shuffled = shuffle(pairs)
  cards.value = shuffled.map(img => ({
    image: img,
    flipped: false,
    matched: false
  }))
}

function beginPreview() {
  previewing.value = true
  previewCount.value = 3
  lockBoard.value = true

  previewTimer = setInterval(() => {
    previewCount.value--
    if (previewCount.value <= 0) {
      clearInterval(previewTimer)
      previewTimer = null
      previewing.value = false
      lockBoard.value = false
    }
  }, 1000)
}

function flipCard(idx) {
  const card = cards.value[idx]
  if (!card || card.flipped || card.matched || lockBoard.value) return

  card.flipped = true

  if (!firstCard) {
    firstCard = { idx, card }
    return
  }

  secondCard = { idx, card }
  moves.value++
  lockBoard.value = true

  if (firstCard.card.image === secondCard.card.image) {
    firstCard.card.matched = true
    secondCard.card.matched = true
    matched.value++
    firstCard = null
    secondCard = null
    lockBoard.value = false

    if (matched.value === 8) {
      celebrateQuote.value = quotes[Math.floor(Math.random() * quotes.length)]
      showCelebrate.value = true
    }
  } else {
    setTimeout(() => {
      firstCard.card.flipped = false
      secondCard.card.flipped = false
      firstCard = null
      secondCard = null
      lockBoard.value = false
    }, 600)
  }
}

function resetGame() {
  clearInterval(previewTimer)
  previewTimer = null
  previewing.value = false
  moves.value = 0
  matched.value = 0
  firstCard = null
  secondCard = null
  lockBoard.value = false
  showCelebrate.value = false
  initCards()
  beginPreview()
}

function startGame() {
  started.value = true
  moves.value = 0
  matched.value = 0
  firstCard = null
  secondCard = null
  lockBoard.value = false
  showCelebrate.value = false
  initCards()
  beginPreview()
}

onDeactivated(() => {
  clearInterval(previewTimer)
  previewTimer = null
  previewing.value = false
  lockBoard.value = false
  started.value = false
  firstCard = null
  secondCard = null
})
</script>

<style scoped>
.memory-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.game-header {
  display: flex;
  gap: 24px;
  padding: 8px 0;
  font-size: 16px;
  color: var(--white);
  font-weight: 600;
  text-shadow: 0 1px 4px rgba(0,0,0,0.15);
}

.board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  width: 100%;
  max-width: 320px;
  margin: 8px 0;
  position: relative;
}

/* 预览倒计时 */
.preview-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 60;
  pointer-events: none;
}

.preview-count {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--pink), var(--pink-deep));
  color: var(--white);
  font-size: 32px;
  font-weight: 700;
  box-shadow: 0 4px 20px rgba(232,114,138,0.5);
  animation: count-pop 0.8s ease-out;
}

@keyframes count-pop {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

/* 卡片 */
.card {
  aspect-ratio: 1;
  position: relative;
  padding: 0;
  border: none;
  cursor: pointer;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
  -webkit-tap-highlight-color: transparent;
  overflow: hidden;
}

.card:not(.flipped):not(.matched):not(.preview):active {
  transform: scale(0.93);
}

.card.matched {
  background: rgba(255,255,255,0.35);
  border-color: rgba(255,154,158,0.5);
}

.card.matched .card-front {
  opacity: 0.5;
}

.card-back {
  font-size: 32px;
}

.card-front {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  animation: flip-in 0.3s ease;
}

@keyframes flip-in {
  from { opacity: 0; transform: scale(0.5) rotateY(90deg); }
  to { opacity: 1; transform: scale(1) rotateY(0deg); }
}

.game-footer {
  padding: 12px 0;
}

.celebrate {
  position: absolute;
  top: 30%;
  left: 16px;
  right: 16px;
  padding: 20px;
  text-align: center;
  z-index: 100;
  animation: toast-in 0.4s ease-out;
}

.celebrate-emoji {
  font-size: 36px;
  margin-bottom: 8px;
}

.celebrate-quote {
  margin-top: 8px;
  font-size: 14px;
  color: var(--pink-deep);
  font-weight: 500;
}
</style>
