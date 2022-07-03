import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';

const routes = [
    {
        path: '/',
        name: 'app',
        component: App,
        meta: {
            requiresAuth:true
        },
        children: [
            {
                path: '',
                name: 'dashboard',
                component: () => import('./pages/dashboard/Index.vue')
            },
            {
                path: '/workunits',
                name: 'workunits',
                component: () => import('./pages/workunits/Index.vue')
            },
            {
                path: '/workunits/:id',
                name: 'workunits.detail',
                component: () => import('./pages/workunits/Detail.vue')
            },
            {
                path: '/employees',
                name: 'employees',
                component: () => import('./pages/employees/Index.vue')
            },
            {
                path: '/employees/:id',
                name: 'employees.detail',
                component: () => import('./pages/employees/Detail.vue')
            },
            {
                path: '/presences',
                name: 'presences',
                component: () => import('./pages/presences/Index.vue'),
            },
            {
                path: '/presences/schedules',
                name:'presences.schedules',
                component: () => import('./pages/presences/Schedule.vue')
            },
            {
                path: '/presences/:id/:employee_id',
                name: 'presences.detail',
                component: () => import('./pages/presences/Detail.vue'),
            },
            {
                path: '/holidays',
                name: 'holidays',
                component: () => import('./pages/holidays/Index.vue')
            },
            {
                path: '/worktimes',
                name: 'worktimes',
                component: () => import('./pages/worktimes/Index.vue'),
            },
            {
                path: '/worktimes/:id',
                name:'worktimes.detail',
                component: () => import('./pages/worktimes/Detail.vue')
            },
            {
                path: '/reports',
                name: 'reports',
                component: () => import('./pages/users/Index.vue')
            },
            {
                path: '/users',
                name: 'users',
                component: () => import('./pages/users/Index.vue')
            },
            {
                path: '/users/:id',
                name:'users.detail',
                component: () => import('./pages/users/Detail.vue')
            },
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('./pages/Login.vue')
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
