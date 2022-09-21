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
                component: () => import('./pages/dashboard/Index.vue'),
                beforeEnter: (to,from,next) => {
                    var role = window.localStorage.getItem('presence_app_role')
                    if(!['superuser','adminsistem','kasubagumum','adminkepegawaian','adminopd'].includes(role))
                        next({'name':'login'})
                    else
                        next()
                }
            },
            {
                path: '/workunits',
                name: 'workunits',
                component: () => import('./pages/workunits/Index.vue'),
                beforeEnter: (to,from,next) => {
                    var role = window.localStorage.getItem('presence_app_role')
                    if(!['superuser','adminsistem'].includes(role))
                        next({'name':'login'})
                    else
                        next()
                }
            },
            {
                path: '/workunits/:id',
                name: 'workunits.detail',
                component: () => import('./pages/workunits/Detail.vue'),
                beforeEnter: (to,from,next) => {
                    var role = window.localStorage.getItem('presence_app_role')
                    if(!['superuser','adminsistem'].includes(role))
                        next({'name':'login'})
                    else
                        next()
                }
            },
            {
                path: '/employees',
                name: 'employees',
                component: () => import('./pages/employees/Index.vue'),
                beforeEnter: (to,from,next) => {
                    var role = window.localStorage.getItem('presence_app_role')
                    if(!['superuser','adminsistem','kasubagumum','adminkepegawaian','adminopd'].includes(role))
                        next({'name':'login'})
                    else
                        next()
                }
            },
            {
                path: '/employees/:id',
                name: 'employees.detail',
                component: () => import('./pages/employees/Detail.vue'),
                beforeEnter: (to,from,next) => {
                    var role = window.localStorage.getItem('presence_app_role')
                    if(!['superuser','adminsistem','kasubagumum','adminkepegawaian','adminopd'].includes(role))
                        next({'name':'login'})
                    else
                        next()
                }
            },
            {
                path: '/presences',
                name: 'presences',
                component: () => import('./pages/presences/Index.vue'),
                beforeEnter: (to,from,next) => {
                    var role = window.localStorage.getItem('presence_app_role')
                    if(!['superuser','adminsistem','kasubagumum','adminkepegawaian'].includes(role))
                        next({'name':'login'})
                    else
                        next()
                }
            },
            {
                path: '/presences/cuti',
                name:'presences.cuti',
                component: () => import('./pages/presences/Cuti.vue'),
                beforeEnter: (to,from,next) => {
                    var role = window.localStorage.getItem('presence_app_role')
                    if(!['superuser','adminsistem','kasubagumum','adminkepegawaian'].includes(role))
                        next({'name':'login'})
                    else
                        next()
                }
            },
            {
                path: '/presences/tugas-luar',
                name:'presences.tugas-luar',
                component: () => import('./pages/presences/TugasLuar.vue'),
                beforeEnter: (to,from,next) => {
                    var role = window.localStorage.getItem('presence_app_role')
                    if(!['superuser','adminsistem','kasubagumum','adminkepegawaian'].includes(role))
                        next({'name':'login'})
                    else
                        next()
                }
            },
            {
                path: '/presences/schedules',
                name:'presences.schedules',
                component: () => import('./pages/presences/Schedule.vue'),
                beforeEnter: (to,from,next) => {
                    var role = window.localStorage.getItem('presence_app_role')
                    if(!['superuser','adminsistem'].includes(role))
                        next({'name':'login'})
                    else
                        next()
                }
            },
            {
                path: '/presences/:id/:employee_id',
                name: 'presences.detail',
                component: () => import('./pages/presences/Detail.vue'),
                beforeEnter: (to,from,next) => {
                    var role = window.localStorage.getItem('presence_app_role')
                    if(!['superuser','adminsistem','adminkepegawaian'].includes(role))
                        next({'name':'login'})
                    else
                        next()
                }
            },
            {
                path: '/holidays',
                name: 'holidays',
                component: () => import('./pages/holidays/Index.vue'),
                beforeEnter: (to,from,next) => {
                    var role = window.localStorage.getItem('presence_app_role')
                    if(!['superuser','adminsistem'].includes(role))
                        next({'name':'login'})
                    else
                        next()
                }
            },
            {
                path: '/paid-leaves',
                name: 'paid_leaves',
                component: () => import('./pages/paid_leaves/Index.vue'),
                beforeEnter: (to,from,next) => {
                    var role = window.localStorage.getItem('presence_app_role')
                    if(!['superuser','adminsistem'].includes(role))
                        next({'name':'login'})
                    else
                        next()
                }
            },
            {
                path: '/worktimes',
                name: 'worktimes',
                component: () => import('./pages/worktimes/Index.vue'),
                beforeEnter: (to,from,next) => {
                    var role = window.localStorage.getItem('presence_app_role')
                    var user = JSON.parse(window.localStorage.getItem('presence_user_data'))
                    if(!['superuser','adminsistem','adminopd'].includes(role) || user.shif_management == 0)
                        next({'name':'login'})
                    else
                        next()
                }
            },
            {
                path: '/worktimes/:id',
                name:'worktimes.detail',
                component: () => import('./pages/worktimes/Detail.vue'),
                beforeEnter: (to,from,next) => {
                    var role = window.localStorage.getItem('presence_app_role')
                    var user = JSON.parse(window.localStorage.getItem('presence_user_data'))
                    if(!['superuser','adminsistem','adminopd'].includes(role) || user.shif_management == 0)
                        next({'name':'login'})
                    else
                        next()
                }
            },
            {
                path: '/reports',
                name: 'reports',
                component: () => import('./pages/reports/Index.vue'),
                beforeEnter: (to,from,next) => {
                    var role = window.localStorage.getItem('presence_app_role')
                    if(!['superuser','adminsistem','adminopd'].includes(role))
                        next({'name':'login'})
                    else
                        next()
                }
            },
            {
                path: '/report-details',
                name: 'report-details',
                component: () => import('./pages/reports/Detail.vue'),
                beforeEnter: (to,from,next) => {
                    var role = window.localStorage.getItem('presence_app_role')
                    if(!['superuser','adminsistem','adminopd'].includes(role))
                        next({'name':'login'})
                    else
                        next()
                }
            },
            {
                path: '/users',
                name: 'users',
                component: () => import('./pages/users/Index.vue'),
                beforeEnter: (to,from,next) => {
                    var role = window.localStorage.getItem('presence_app_role')
                    if(!['superuser','adminsistem'].includes(role))
                        next({'name':'login'})
                    else
                        next()
                }
            },
            {
                path: '/users/:id',
                name:'users.detail',
                component: () => import('./pages/users/Detail.vue'),
                beforeEnter: (to,from,next) => {
                    var role = window.localStorage.getItem('presence_app_role')
                    if(!['superuser','adminsistem'].includes(role))
                        next({'name':'login'})
                    else
                        next()
                }
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
