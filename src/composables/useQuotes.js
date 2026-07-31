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
      return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
    } catch {
      return []
    }
  }

  function saveFavorites() {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.value))
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

  function isFavorited(index) {
    return favorites.value.includes(index)
  }

  function toggleFavorite(index) {
    const pos = favorites.value.indexOf(index)
    if (pos > -1) {
      favorites.value.splice(pos, 1)
    } else {
      favorites.value.push(index)
    }
    saveFavorites()
  }

  const favoriteQuotes = computed(() => {
    return favorites.value.map(idx => ({ index: idx, text: quotes[idx] }))
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
