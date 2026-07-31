import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Quotes from '../views/Quotes.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/quotes', component: Quotes }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
