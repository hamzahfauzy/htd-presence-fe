<template>
	<div class="layout-footer">
		by <span class="font-medium ml-2">SISAPA (Sistem Informasi Absensi Pegawai) Kota Tanjung Balai</span>
	</div>
</template>

<script>
	export default {
		name: "AppFooter",
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