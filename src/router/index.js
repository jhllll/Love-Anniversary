import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Quotes from '../views/Quotes.vue'
import Games from '../views/Games.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/quotes', component: Quotes },
  { path: '/games', component: Games }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
