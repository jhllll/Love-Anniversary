<template>
  <div class="quotes-page">
    <HeartParticles />

    <div class="quotes-content">
      <!-- 顶部导航 -->
      <div class="quotes-header">
        <router-link to="/" class="back-btn">
          ← 返回
        </router-link>
        <h1 class="quotes-title">每日情话</h1>
      </div>

      <!-- 今日情话 -->
      <section class="section">
        <h2 class="section-title">今日推荐</h2>
        <QuoteCard
          :text="currentQuote"
          :favorited="isFavorited(currentQuoteIndex)"
          @toggle-favorite="toggleFavorite(currentQuoteIndex)"
        />
        <div class="section-actions">
          <button class="btn btn--secondary" @click="refreshQuote">
            换一句 ✨
          </button>
        </div>
      </section>

      <!-- 收藏的情话 -->
      <section class="section" v-if="favoriteQuotes.length > 0">
        <h2 class="section-title">我的收藏 ({{ favoriteQuotes.length }})</h2>
        <div
          v-for="fav in favoriteQuotes"
          :key="fav.index"
          class="fav-item glass-card"
        >
          <p class="fav-text">{{ fav.text }}</p>
          <button
            class="fav-remove"
            @click="toggleFavorite(fav.index)"
            aria-label="取消收藏"
          >❤</button>
        </div>
      </section>

      <div class="quotes-footer">
        <p class="footer-text">每天一句，爱你多一点</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import HeartParticles from '../components/HeartParticles.vue'
import QuoteCard from '../components/QuoteCard.vue'
import { useQuotes } from '../composables/useQuotes.js'

const {
  todayIndex,
  todayQuote,
  getRandomQuote,
  isFavorited,
  toggleFavorite,
  favoriteQuotes
} = useQuotes()

const randomQuote = ref(getRandomQuote())
const useRandom = ref(false)

const currentQuote = computed(() => {
  return useRandom.value ? randomQuote.value : todayQuote.value
})

const currentQuoteIndex = computed(() => {
  return useRandom.value ? -1 : todayIndex.value
})

function refreshQuote() {
  randomQuote.value = getRandomQuote()
  useRandom.value = true
}
</script>

<style scoped>
.quotes-page {
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.quotes-content {
  position: relative;
  z-index: 1;
  padding: 20px 16px 40px;
}

.quotes-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
}

.back-btn {
  color: var(--white);
  text-decoration: none;
  font-size: 16px;
  opacity: 0.9;
  -webkit-tap-highlight-color: transparent;
}

.quotes-title {
  font-size: 22px;
  color: var(--white);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-weight: 600;
}

.section {
  margin-bottom: 28px;
}

.section-title {
  font-size: 16px;
  color: var(--white);
  margin-bottom: 12px;
  padding-left: 4px;
  opacity: 0.9;
  font-weight: 500;
}

.section-actions {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.fav-item {
  padding: 16px 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  animation: fadeInUp 0.4s ease;
}

.fav-text {
  flex: 1;
  font-size: 15px;
  line-height: 1.7;
  color: var(--text);
}

.fav-remove {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
  padding: 4px;
}

.quotes-footer {
  text-align: center;
  padding: 20px 0;
}

.footer-text {
  font-size: 13px;
  color: var(--white);
  opacity: 0.7;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
