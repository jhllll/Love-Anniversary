<template>
  <div class="memory-game">
    <div class="game-header">
      <span class="moves">👣 {{ moves }} 步</span>
      <span class="pairs">✅ {{ matched }}/8 对</span>
    </div>
    <div class="board">
      <button
        v-for="(card, idx) in cards"
        :key="idx"
        class="card glass-card"
        :class="{ flipped: card.flipped, matched: card.matched }"
        :disabled="card.flipped || card.matched || lockBoard"
        @click="flipCard(idx)"
      >
        <span class="card-face card-back">❓</span>
        <span class="card-face card-front">{{ card.emoji }}</span>
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
import { ref } from 'vue'
import { quotes } from '../../data/quotes.js'

const emojiList = ['💖', '💕', '💗', '💝', '💘', '💓', '🌸', '✨']

const cards = ref([])
const moves = ref(0)
const matched = ref(0)
const lockBoard = ref(false)
const showCelebrate = ref(false)
const celebrateQuote = ref('')
let firstCard = null
let secondCard = null

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function initCards() {
  const pairs = [...emojiList, ...emojiList]
  const shuffled = shuffle(pairs)
  cards.value = shuffled.map(e => ({
    emoji: e,
    flipped: false,
    matched: false
  }))
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

  if (firstCard.card.emoji === secondCard.card.emoji) {
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
  moves.value = 0
  matched.value = 0
  firstCard = null
  secondCard = null
  lockBoard.value = false
  showCelebrate.value = false
  initCards()
}

initCards()
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
}

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
  transition: transform 0.4s;
  -webkit-tap-highlight-color: transparent;
  transform-style: preserve-3d;
}

.card:not(.flipped):not(.matched):active {
  transform: scale(0.93);
}

.card.flipped,
.card.matched {
  transform: rotateY(180deg);
}

.card.matched {
  background: rgba(255,255,255,0.35);
  border-color: rgba(255,154,158,0.5);
}

.card-face {
  position: absolute;
  backface-visibility: hidden;
}

.card-back {
  /* visible by default */
}

.card-front {
  transform: rotateY(180deg);
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

@keyframes toast-in {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
</style>
