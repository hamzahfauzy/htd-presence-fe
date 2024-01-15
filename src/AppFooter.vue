<template>
	<div class="layout-footer">
		by <span class="font-medium ml-2">{{ app_footer }}</span>
	</div>
</template>

<script>
	export default {
		name: "AppFooter",
		data(){
			return {
				app_footer : process.env.VUE_APP_FOOTER,
			}
		},
		methods: {
			footerImage() {
				return this.$appState.darkTheme ? 'images/logo-white.svg' : 'images/logo-dark.svg';
			}
		},
		computed: {
			darkTheme() {
				return this.$appState.darkTheme;
			}
		}
	}
</script>