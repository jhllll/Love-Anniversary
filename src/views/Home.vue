<template>
  <div class="home">
    <HeartParticles />

    <div class="home-content">
      <!-- 标题 -->
      <h1 class="home-title">我们的时光</h1>

      <!-- 核心展示区 -->
      <div class="main-card glass-card">
        <CountdownDisplay
          :days="daysTogether"
          :duration="durationText"
        />

        <!-- 进度环 -->
        <div class="progress-section" v-if="nextAnniversary">
          <ProgressRing
            :progress="progress"
            :days="daysUntilNext"
          />
          <p class="next-label">{{ nextAnniversaryLabel }}</p>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="home-actions">
        <button class="btn btn--secondary" @click="showSetter = true">
          修改纪念日
        </button>
      </div>

      <!-- 底部导航 -->
      <nav class="bottom-nav">
        <div class="nav-item nav-item--active">
          <span class="nav-icon">💕</span>
          <span class="nav-label">纪念日</span>
        </div>
        <router-link to="/quotes" class="nav-item">
          <span class="nav-icon">💌</span>
          <span class="nav-label">每日情话</span>
        </router-link>
      </nav>
    </div>

    <!-- 设置弹窗 -->
    <AnniversarySetter
      :visible="showSetter"
      :current-date="anniversary"
      @confirm="handleSetDate"
      @close="showSetter = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HeartParticles from '../components/HeartParticles.vue'
import CountdownDisplay from '../components/CountdownDisplay.vue'
import ProgressRing from '../components/ProgressRing.vue'
import AnniversarySetter from '../components/AnniversarySetter.vue'
import { useAnniversary } from '../composables/useAnniversary.js'

const {
  anniversary,
  setAnniversary,
  hasAnniversary,
  daysTogether,
  durationText,
  nextAnniversary,
  daysUntilNext,
  progress,
  nextAnniversaryLabel
} = useAnniversary()

const showSetter = ref(false)

onMounted(() => {
  if (!hasAnniversary()) {
    showSetter.value = true
  }
})

function handleSetDate(date) {
  setAnniversary(date)
  showSetter.value = false
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.home-content {
  position: relative;
  z-index: 1;
  padding: 40px 16px 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.home-title {
  font-size: 28px;
  color: var(--white);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  font-weight: 600;
  letter-spacing: 2px;
}

.main-card {
  width: 100%;
  padding: 28px 20px 20px;
  margin-bottom: 20px;
}

.progress-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--white-30);
}

.next-label {
  text-align: center;
  font-size: 13px;
  color: var(--text-light);
  margin-top: 10px;
}

.home-actions {
  margin-bottom: 20px;
}

/* 底部导航 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 414px;
  display: flex;
  background: var(--white-80);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--white-30);
  padding: 8px 0;
  padding-bottom: max(8px, env(safe-area-inset-bottom));
  z-index: 50;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 0;
  text-decoration: none;
  color: var(--text-light);
  transition: color 0.3s;
  -webkit-tap-highlight-color: transparent;
}

.nav-item--active {
  color: #e8728a;
}

.nav-icon {
  font-size: 24px;
  margin-bottom: 2px;
}

.nav-label {
  font-size: 12px;
}
</style>
