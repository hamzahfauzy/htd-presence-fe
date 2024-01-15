<template>
	<div class="layout-topbar">
		<router-link to="/" class="layout-topbar-logo">
			<img alt="Logo" :src="topbarImage()" />
		</router-link>
		<button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
			<i class="pi pi-bars"></i>
		</button>

		<button class="p-link layout-topbar-menu-button layout-topbar-button" v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'scalein', 
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

		<Dialog v-model:visible="passwordDialog" :style="{width: '450px'}" header="Edit Password" :modal="true"
			class="p-fluid">
			<div class="field">
				<label for="name">Password</label>
				<InputText id="name" v-model.trim="password" required="true" autofocus
					:class="{'p-invalid': submitted && !password}" />
				<small class="p-invalid" v-if="submitted && !password">Password diperlukan.</small>
			</div>
			<template #footer>
				<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
				<Button label="Save" icon="pi pi-check" class="p-button-text" @click="savePassword" />
			</template>
		</Dialog>
	</div>
</template>

<script>
import UserService from './service/UserService'

export default {
	data(){
		return {
			password: '',
			passwordDialog: false,
			submitted: false,
			items: [
                {
                    label: 'Profile',
                    items: [{
                        label: 'Edit Password',
                        icon: 'pi pi-user-edit',
						command: () => {
							this.passwordDialog = true
						}
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
	userService: null,
	created() {
		this.userService = new UserService()
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
		},
		hideDialog() {
			this.passwordDialog = false;
			this.submitted = false;
		},
		savePassword() {
			this.submitted = true;
			this.userService.changePassword(this.password)
				.then(res => {
					if (!res.success) {
						this.$swal({
							icon: 'error',
							title: 'Oops...',
							text: res.message,
						})
					}
					else {
						this.passwordDialog = false;
						this.password = '';
						this.$swal({
							icon: 'success',
							title: 'Success',
							text: res.message
						})
					}
				})
		},
    },
	computed: {
		darkTheme() {
			return this.$appState.darkTheme;
		}
	}
}
</script>