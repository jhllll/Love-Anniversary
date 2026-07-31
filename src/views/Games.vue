<template>
  <div class="games-page">
    <div class="games-content">
      <h1 class="games-title">🎮 小游戏</h1>

      <div class="tab-bar glass-card">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-btn"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </div>

      <div class="game-panel glass-card">
        <BubbleGame v-if="activeTab === 'bubble'" />
        <MemoryGame v-if="activeTab === 'memory'" />
        <CatchGame v-if="activeTab === 'catch'" />
        <GachaGame v-if="activeTab === 'gacha'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BubbleGame from '../components/games/BubbleGame.vue'
import MemoryGame from '../components/games/MemoryGame.vue'
import CatchGame from '../components/games/CatchGame.vue'
import GachaGame from '../components/games/GachaGame.vue'

const activeTab = ref('bubble')

const tabs = [
  { key: 'bubble', icon: '🫧', label: '戳泡泡' },
  { key: 'memory', icon: '🃏', label: '翻牌记忆' },
  { key: 'catch', icon: '🧺', label: '接爱心' },
  { key: 'gacha', icon: '🥚', label: '扭蛋机' }
]
</script>

<style scoped>
.games-page {
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.games-content {
  position: relative;
  z-index: 1;
  padding: 40px 16px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.games-title {
  font-size: 28px;
  color: var(--white);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  font-weight: 600;
  letter-spacing: 2px;
}

.tab-bar {
  display: flex;
  width: 100%;
  padding: 4px;
  margin-bottom: 12px;
}

.tab-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 4px;
  border: none;
  background: transparent;
  color: var(--text-light);
  cursor: pointer;
  border-radius: 14px;
  transition: all 0.3s;
  -webkit-tap-highlight-color: transparent;
  font-family: inherit;
}

.tab-btn.active {
  background: linear-gradient(135deg, var(--pink), var(--pink-deep));
  color: var(--white);
  box-shadow: 0 2px 10px rgba(255,154,158,0.3);
}

.tab-icon {
  font-size: 20px;
  margin-bottom: 2px;
}

.tab-label {
  font-size: 11px;
  font-weight: 500;
}

.game-panel {
  width: 100%;
  padding: 12px;
  min-height: 440px;
}
</style>
