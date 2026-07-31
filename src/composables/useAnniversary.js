import { ref, computed } from 'vue'

const STORAGE_KEY = 'love-app-anniversary'

export function useAnniversary() {
  const anniversary = ref(localStorage.getItem(STORAGE_KEY) || '')

  function setAnniversary(date) {
    anniversary.value = date
    localStorage.setItem(STORAGE_KEY, date)
  }

  function hasAnniversary() {
    return !!anniversary.value
  }

  const daysTogether = computed(() => {
    if (!anniversary.value) return 0
    const start = new Date(anniversary.value)
    const today = new Date()
    const diff = today.getTime() - start.getTime()
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
  })

  const durationText = computed(() => {
    if (!anniversary.value) return { years: 0, months: 0, days: 0 }
    const start = new Date(anniversary.value)
    const today = new Date()

    let years = today.getFullYear() - start.getFullYear()
    let months = today.getMonth() - start.getMonth()
    let days = today.getDate() - start.getDate()

    if (days < 0) {
      months--
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
      days += prevMonth.getDate()
    }
    if (months < 0) {
      years--
      months += 12
    }

    return { years: Math.max(0, years), months: Math.max(0, months), days: Math.max(0, days) }
  })

  const nextAnniversary = computed(() => {
    if (!anniversary.value) return null
    const today = new Date()
    const annDate = new Date(anniversary.value)
    const nextYear = today.getFullYear()
    const next = new Date(nextYear, annDate.getMonth(), annDate.getDate())

    if (next <= today) {
      next.setFullYear(nextYear + 1)
    }

    return next
  })

  const daysUntilNext = computed(() => {
    if (!nextAnniversary.value) return 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diff = nextAnniversary.value.getTime() - today.getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  })

  const progress = computed(() => {
    if (!anniversary.value) return 0
    const start = new Date(anniversary.value)
    const today = new Date()
    const next = nextAnniversary.value
    if (!next) return 0

    const total = next.getTime() - new Date(next.getFullYear() - 1, next.getMonth(), next.getDate()).getTime()
    const elapsed = today.getTime() - new Date(next.getFullYear() - 1, next.getMonth(), next.getDate()).getTime()

    return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)))
  })

  const nextAnniversaryLabel = computed(() => {
    if (!nextAnniversary.value) return ''
    const y = nextAnniversary.value.getFullYear()
    const m = nextAnniversary.value.getMonth() + 1
    const d = nextAnniversary.value.getDate()
    const startYear = new Date(anniversary.value).getFullYear()
    const nth = y - startYear
    return `${y}年${m}月${d}日 · ${nth}周年纪念日`
  })

  return {
    anniversary,
    setAnniversary,
    hasAnniversary,
    daysTogether,
    durationText,
    nextAnniversary,
    daysUntilNext,
    progress,
    nextAnniversaryLabel
  }
}
