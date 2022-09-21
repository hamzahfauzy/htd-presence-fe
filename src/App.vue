<template>
	<div :class="containerClass" @click="onWrapperClick">
        <AppTopBar @menu-toggle="onMenuToggle" />
        <div class="layout-sidebar" @click="onSidebarClick">
            <AppMenu :model="menu" @menuitem-click="onMenuItemClick" />
        </div>

        <div class="layout-main-container">
            <div class="layout-main">
                <router-view />
            </div>
            <AppFooter />
        </div>

		<!-- <AppConfig :layoutMode="layoutMode" @layout-change="onLayoutChange" /> -->
        <transition name="layout-mask">
            <div class="layout-mask p-component-overlay" v-if="mobileMenuActive"></div>
        </transition>
	</div>
</template>

<script>
import AppTopBar from './AppTopbar.vue';
import AppMenu from './AppMenu.vue';
// import AppConfig from './AppConfig.vue';
import AppFooter from './AppFooter.vue';

export default {
    emits: ['change-theme'],
    data() {
        return {
            layoutMode: 'static',
            staticMenuInactive: false,
            overlayMenuActive: false,
            mobileMenuActive: false,
            menu : [
                {
                    label: 'Home',
                    permissions: ['superuser', 'adminsistem', 'kasubagumum', 'adminkepegawaian', 'adminopd'],
                    items: [{
                        label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/',
                        permissions: ['superuser', 'adminsistem', 'kasubagumum', 'adminkepegawaian', 'adminopd']
                    }]
                },
				{
					label: 'Modul', icon: 'pi pi-fw pi-clone',
                    permissions: ['superuser', 'adminsistem', 'kasubagumum', 'adminkepegawaian', 'adminopd'],
					items: [
                        { label: 'OPD', icon: 'pi pi-fw pi-microsoft', to: '/workunits', permissions: ['superuser', 'adminsistem'] },
                        { label: 'Pegawai', icon: 'pi pi-fw pi-user', to: '/employees', permissions: ['superuser', 'adminsistem', 'kasubagumum', 'adminkepegawaian', 'adminopd'] },
						{
                            label: 'Presensi', icon: 'pi pi-fw pi-calendar', 
                            permissions: ['superuser', 'adminsistem', 'kasubagumum', 'adminkepegawaian'],
                            items: [
                                { label: 'Master Cuti', icon: 'pi pi-fw pi-bookmark', to: '/paid-leaves', permissions: ['superuser', 'adminsistem'] },
                                { label: 'Absensi', icon: 'pi pi-fw pi-bookmark', to: '/presences' ,permissions: ['superuser', 'adminsistem', 'kasubagumum', 'adminkepegawaian']},
                                { label: 'Cuti', icon: 'pi pi-fw pi-bookmark', to: '/presences/cuti' ,permissions: ['superuser', 'adminsistem', 'kasubagumum', 'adminkepegawaian']},
                                { label: 'Tugas Luar', icon: 'pi pi-fw pi-bookmark', to: '/presences/tugas-luar' ,permissions: ['superuser', 'adminsistem', 'kasubagumum', 'adminkepegawaian']},
                                // { label: 'Jadwal', icon: 'pi pi-fw pi-bookmark', to: '/presences/schedules', permissions: ['superuser', 'adminsistem'] },
                                { label: 'Hari Libur', icon: 'pi pi-fw pi-bookmark', to: '/holidays', permissions: ['superuser', 'adminsistem'] },
                            ],
                        },
                        { label: 'Jam Kerja', icon: 'pi pi-fw pi-bookmark', to: '/worktimes', permissions: ['superuser', 'adminsistem','adminopd','shift_management'] },
                        { 
                            label: 'Laporan', icon: 'pi pi-fw pi-file', 
                            permissions: ['superuser', 'adminsistem','adminopd'],
                            items:[
                                { label: 'Rekapitulasi', icon: 'pi pi-fw pi-bookmark', to: '/reports', permissions: ['superuser', 'adminsistem', 'adminopd'] },
                                { label: 'Detail', icon: 'pi pi-fw pi-bookmark', to: '/report-details', permissions: ['superuser', 'adminsistem', 'adminopd'] },
                            ]
                        },
                        { label: 'Pengguna', icon: 'pi pi-fw pi-users', to: '/users', permissions: ['superuser', 'adminsistem'] },
					]
				}
            ]
        }
    },
    watch: {
        $route() {
            this.menuActive = false;
            this.$toast.removeAllGroups();
        }
    },
    methods: {
        onWrapperClick() {
            if (!this.menuClick) {
                this.overlayMenuActive = false;
                this.mobileMenuActive = false;
            }

            this.menuClick = false;
        },
        onMenuToggle() {
            this.menuClick = true;

            if (this.isDesktop()) {
                if (this.layoutMode === 'overlay') {
					if(this.mobileMenuActive === true) {
						this.overlayMenuActive = true;
					}

                    this.overlayMenuActive = !this.overlayMenuActive;
					this.mobileMenuActive = false;
                }
                else if (this.layoutMode === 'static') {
                    this.staticMenuInactive = !this.staticMenuInactive;
                }
            }
            else {
                this.mobileMenuActive = !this.mobileMenuActive;
            }

            event.preventDefault();
        },
        onSidebarClick() {
            this.menuClick = true;
        },
        onMenuItemClick(event) {
            if (event.item && !event.item.items) {
                this.overlayMenuActive = false;
                this.mobileMenuActive = false;
            }
        },
		onLayoutChange(layoutMode) {
			this.layoutMode = layoutMode;
		},
        addClass(element, className) {
            if (element.classList)
                element.classList.add(className);
            else
                element.className += ' ' + className;
        },
        removeClass(element, className) {
            if (element.classList)
                element.classList.remove(className);
            else
                element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        },
        isDesktop() {
            return window.innerWidth >= 992;
        },
        isSidebarVisible() {
            if (this.isDesktop()) {
                if (this.layoutMode === 'static')
                    return !this.staticMenuInactive;
                else if (this.layoutMode === 'overlay')
                    return this.overlayMenuActive;
            }

            return true;
        }
    },
    computed: {
        containerClass() {
            return ['layout-wrapper', {
                'layout-overlay': this.layoutMode === 'overlay',
                'layout-static': this.layoutMode === 'static',
                'layout-static-sidebar-inactive': this.staticMenuInactive && this.layoutMode === 'static',
                'layout-overlay-sidebar-active': this.overlayMenuActive && this.layoutMode === 'overlay',
                'layout-mobile-sidebar-active': this.mobileMenuActive,
				'p-input-filled': this.$primevue.config.inputStyle === 'filled',
				'p-ripple-disabled': this.$primevue.config.ripple === false
            }];
        },
        logo() {
            return (this.$appState.darkTheme) ? "images/logo-white.svg" : "images/logo.svg";
        }
    },
    beforeUpdate() {
        if (this.mobileMenuActive)
            this.addClass(document.body, 'body-overflow-hidden');
        else
            this.removeClass(document.body, 'body-overflow-hidden');
    },
    components: {
        'AppTopBar': AppTopBar,
        'AppMenu': AppMenu,
        // 'AppConfig': AppConfig,
        'AppFooter': AppFooter,
    }
}
</script>

<style lang="scss">
@import './App.scss';
</style>
