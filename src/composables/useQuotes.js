import { ref, computed } from 'vue'
import { quotes } from '../data/quotes.js'

const FAVORITES_KEY = 'love-app-favorites'

function hashDay(dateStr) {
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function getDateKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

export function useQuotes() {
  const favorites = ref(loadFavorites())
  const currentIndex = ref(-1)

  function loadFavorites() {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      if (parsed.length > 0 && typeof parsed[0] === 'number') {
        // 旧格式：索引数组 → 迁移为文本数组
        const migrated = parsed.map(i => quotes[i]).filter(Boolean)
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(migrated))
        return migrated
      }
      return parsed
    } catch {
      return []
    }
  }

  function saveFavorites(arr) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(arr))
  }

  const todayIndex = computed(() => {
    return hashDay(getDateKey()) % quotes.length
  })

  const todayQuote = computed(() => {
    return quotes[todayIndex.value]
  })

  function getRandomQuote() {
    let idx
    do {
      idx = Math.floor(Math.random() * quotes.length)
    } while (idx === currentIndex.value && quotes.length > 1)
    currentIndex.value = idx
    return quotes[idx]
  }

  function isFavorited(text) {
    return favorites.value.includes(text)
  }

  function toggleFavorite(text) {
    const pos = favorites.value.indexOf(text)
    if (pos > -1) {
      favorites.value.splice(pos, 1)
    } else {
      favorites.value.push(text)
    }
    saveFavorites(favorites.value)
  }

  const favoriteQuotes = computed(() => {
    return favorites.value.map(text => ({ text }))
  })

  return {
    todayIndex,
    todayQuote,
    getRandomQuote,
    isFavorited,
    toggleFavorite,
    favorites,
    favoriteQuotes,
    totalQuotes: quotes.length
  }
}
