<template>
  <Transition name="modal">
    <div v-if="visible" class="setter-overlay" @click.self="$emit('close')">
      <div class="setter-card glass-card">
        <h2 class="setter-title">设置纪念日</h2>
        <p class="setter-subtitle">选择你们在一起的那一天</p>

        <div class="date-picker">
          <input
            type="date"
            v-model="selectedDate"
            :max="maxDate"
            class="date-input"
          />
        </div>

        <div class="setter-actions">
          <button class="btn" @click="handleConfirm" :disabled="!selectedDate">
            确认设置
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  currentDate: { type: String, default: '' }
})

const emit = defineEmits(['confirm', 'close'])

const today = new Date()
const maxDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
const selectedDate = ref(props.currentDate || '')

function handleConfirm() {
  if (selectedDate.value) {
    emit('confirm', selectedDate.value)
  }
}
</script>

<style scoped>
.setter-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.setter-card {
  width: 100%;
  max-width: 320px;
  padding: 32px 24px;
  text-align: center;
}

.setter-title {
  font-size: 22px;
  color: #e8728a;
  margin-bottom: 8px;
}

.setter-subtitle {
  font-size: 14px;
  color: var(--text-light);
  margin-bottom: 24px;
}

.date-picker {
  margin-bottom: 24px;
}

.date-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid rgba(255, 154, 158, 0.3);
  border-radius: 12px;
  font-size: 16px;
  text-align: center;
  color: var(--text);
  background: var(--white-80);
  outline: none;
  transition: border-color 0.3s;
}

.date-input:focus {
  border-color: var(--pink);
}

.setter-actions {
  display: flex;
  justify-content: center;
}

/* modal transition */
.modal-enter-active { transition: all 0.35s ease-out; }
.modal-leave-active { transition: all 0.25s ease-in; }
.modal-enter-from { opacity: 0; }
.modal-enter-from .setter-card { transform: scale(0.9); opacity: 0; }
.modal-leave-to { opacity: 0; }
.modal-leave-to .setter-card { transform: scale(0.9); opacity: 0; }
</style>
