<template>
	<div class="layout-topbar">
		<router-link to="/" class="layout-topbar-logo">
			<img alt="Logo" :src="topbarImage()" />
			<span>Presensi</span>
		</router-link>
		<button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
			<i class="pi pi-bars"></i>
		</button>

		<button class="p-link layout-topbar-menu-button layout-topbar-button"
			v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'scalein', 
			leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true}">
			<i class="pi pi-ellipsis-v"></i>
		</button>
		<ul class="layout-topbar-menu hidden lg:flex origin-top">
			<li>
				<button class="p-link layout-topbar-button" @click="toggle">
					<i class="pi pi-user"></i>
					<span>Profile</span>
				</button>
				<Menu id="overlay_menu" ref="menu" :model="items" :popup="true" />
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	data(){
		return {
			items: [
                {
                    label: 'Profile',
                    items: [{
                        label: 'Edit Profile',
                        icon: 'pi pi-user-edit',
                    },
                    {
                        label: 'Keluar',
                        icon: 'pi pi-sign-out',
                        command: () => {
							localStorage.removeItem('presence_app_token')
							localStorage.removeItem('presence_app_role')
                            this.$router.push({name: 'login'})
                        }
                    }
                ]}
            ]
		}
	},
    methods: {
		toggle(event) {
            this.$refs.menu.toggle(event);
        },
        onMenuToggle(event) {
            this.$emit('menu-toggle', event);
        },
		onTopbarMenuToggle(event) {
            this.$emit('topbar-menu-toggle', event);
        },
		topbarImage() {
			return process.env.VUE_APP_LOGO_URL;
		}
    },
	computed: {
		darkTheme() {
			return this.$appState.darkTheme;
		}
	}
}
</script>