import { createRouter, createWebHashHistory } from 'vue-router'

import Editor from '@/views/Editor/editor.vue'
import PsParser from '@/views/PsParser/index.vue'
import CusComponents from '@/views/CusComponents/index.vue'
import Home from '@/views/Home/home.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      // component: Editor,
    },
    {
      path: '/editor',
      name: 'Editor',
      component: Editor,
    },
    {
      path: '/psParser',
      name: 'PsParser',
      component: PsParser,
    },
    {
      path: '/components',
      name: 'CusComponents',
      component: CusComponents,
    },
  ],
})

export default router
