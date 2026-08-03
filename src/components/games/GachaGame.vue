<template>
  <div class="gacha-game">
    <!-- 开始遮罩 -->
    <div v-if="!started" class="start-overlay glass-card">
      <p class="start-emoji">🥚</p>
      <p class="start-title">扭蛋机</p>
      <p class="start-desc">扭一扭，随机获得情话或恋爱任务</p>
      <button class="btn" @click="started = true">开始游戏</button>
    </div>

    <div class="machine">
      <div class="machine-body glass-card" :class="{ shaking: isShaking }">
        <div class="machine-top">
          <span class="machine-knob"><img :src="baseUrl + 'images/gacha/knob.svg'" class="knob-img" /></span>
        </div>
        <div class="machine-glass">
          <div class="capsules">
            <span
              v-for="n in 8"
              :key="n"
              class="capsule"
              :style="{ animationDelay: n * 0.15 + 's', left: (10 + (n-1)*10) + '%' }"
              :class="{ drop: isDropping && n === dropIndex }"
            ><img :src="baseUrl + 'images/gacha/capsule.svg'" class="capsule-img" /></span>
          </div>
        </div>
        <div class="machine-outlet">
          <span v-if="result" class="result-item">{{ result }}</span>
          <span v-else class="outlet-empty"><img :src="baseUrl + 'images/gacha/outlet.svg'" class="outlet-img" /></span>
        </div>
      </div>
    </div>
    <button class="btn gacha-btn" :disabled="isShaking" @click="gacha">
      {{ isShaking ? '扭蛋中...' : '🎮 扭一扭' }}
    </button>
    <div v-if="showResult" class="result-card glass-card">
      <p class="result-label">{{ isTask ? '🎯 恋爱小任务' : '💌 今日情话' }}</p>
      <p class="result-text">{{ resultText }}</p>
      <button class="btn" @click="showResult = false">知道啦</button>
    </div>
    <div class="history" v-if="history.length > 0">
      <p class="history-title">📋 历史记录</p>
      <div v-for="(item, idx) in history.slice(-5).reverse()" :key="idx" class="history-item">
        <span>{{ item.type === 'task' ? '🎯' : '💌' }}</span>
        <span class="history-text">{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { quotes } from '../../data/quotes.js'
import { tasks } from '../../data/tasks.js'

const baseUrl = import.meta.env.BASE_URL

const isShaking = ref(false)
const isDropping = ref(false)
const dropIndex = ref(0)
const result = ref('')
const showResult = ref(false)
const resultText = ref('')
const isTask = ref(false)
const history = ref([])
const started = ref(false)

function gacha() {
  if (isShaking.value) return
  isShaking.value = true
  isDropping.value = false
  result.value = ''

  dropIndex.value = 1 + Math.floor(Math.random() * 8)

  setTimeout(() => {
    isDropping.value = true
  }, 400)

  setTimeout(() => {
    isShaking.value = false
    isDropping.value = false

    isTask.value = Math.random() < 0.5
    if (isTask.value) {
      result.value = '🎯'
      resultText.value = tasks[Math.floor(Math.random() * tasks.length)]
    } else {
      result.value = '💌'
      resultText.value = quotes[Math.floor(Math.random() * quotes.length)]
    }

    history.value.push({
      type: isTask.value ? 'task' : 'quote',
      text: resultText.value
    })

    showResult.value = true
  }, 1200)
}
</script>

<style scoped>
.gacha-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.machine {
  width: 100%;
  max-width: 280px;
  margin: 16px 0;
}

.machine-body {
  padding: 0;
  overflow: hidden;
  transition: transform 0.1s;
}

.machine-body.shaking {
  animation: shake 0.1s ease-in-out infinite;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px) rotate(-1deg); }
  75% { transform: translateX(3px) rotate(1deg); }
}

.machine-top {
  padding: 12px;
  text-align: center;
  font-size: 28px;
  border-bottom: 1px solid var(--white-30);
}

.knob-img {
  width: 36px;
  height: 36px;
  vertical-align: middle;
}

.machine-glass {
  height: 120px;
  position: relative;
  background: rgba(255,255,255,0.2);
  overflow: hidden;
}

.capsules {
  position: relative;
  width: 100%;
  height: 100%;
}

.capsule {
  position: absolute;
  bottom: 8px;
  width: 22px;
  height: 28px;
  animation: float-capsule 2s ease-in-out infinite;
}

.capsule-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.capsule.drop {
  animation: capsule-drop 0.6s ease-in forwards;
}

@keyframes float-capsule {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

@keyframes capsule-drop {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(80px); opacity: 0; }
}

.machine-outlet {
  padding: 16px;
  text-align: center;
  font-size: 36px;
  border-top: 1px solid var(--white-30);
  min-height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.outlet-empty {
  opacity: 0.3;
}

.outlet-img {
  width: 32px;
  height: 28px;
}

.gacha-btn {
  margin: 12px 0;
  font-size: 18px;
  padding: 14px 40px;
}

.result-card {
  position: absolute;
  top: 20%;
  left: 16px;
  right: 16px;
  padding: 24px;
  text-align: center;
  z-index: 100;
  animation: toast-in 0.4s ease-out;
}

.result-label {
  font-size: 14px;
  color: var(--pink-deep);
  margin-bottom: 12px;
  font-weight: 600;
}

.result-text {
  font-size: 16px;
  color: var(--text);
  line-height: 1.6;
  margin-bottom: 16px;
}

.history {
  width: 100%;
  max-width: 280px;
  margin-top: 8px;
}

.history-title {
  font-size: 13px;
  color: var(--white-80);
  margin-bottom: 6px;
  text-align: center;
}

.history-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 4px 0;
  font-size: 13px;
  color: var(--white);
}

.history-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
