import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/text-tools',
    name: 'TextTools',
    component: () => import('../views/TextToolsView.vue'),
    children: [
      {
        path: '',
        name: 'TextToolsIndex',
        component: () => import('../views/text-tools/TextToolsIndex.vue')
      },
      {
        path: 'sort',
        name: 'SortText',
        component: () => import('../views/text-tools/SortTextView.vue')
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue')
  }
]

export default routes