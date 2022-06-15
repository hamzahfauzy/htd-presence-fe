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
                component: () => import('./components/Dashboard.vue')
            },
            {
                path: '/workunits',
                name: 'workunits',
                component: () => import('./pages/workunits/Index.vue')
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
                children:[
                    {
                        path: '',
                        component: () => import('./pages/presences/Index.vue')
                    },
                    {
                        path: '/presences/hadir',
                        component: () => import('./pages/CrudDemo.vue')
                    },
                    {
                        path: '/presences/izin',
                        component: () => import('./pages/CrudDemo.vue')
                    },
                    {
                        path: '/presences/sakit',
                        component: () => import('./pages/CrudDemo.vue')
                    },
                ]
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
                component: () => import('./pages/CrudDemo.vue')
            },
            {
                path: '/users',
                name: 'users',
                component: () => import('./pages/CrudDemo.vue')
            }
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