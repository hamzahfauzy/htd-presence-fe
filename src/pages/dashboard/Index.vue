<template>
	<div class="grid">
		<!-- <div class="col-12 lg:col-6 xl:col-6">
			<div class="card mb-0">
				<div class="flex justify-content-between mb-3">
					<div>
						<span class="block text-500 font-medium mb-3">OPD</span>
						<div class="text-900 font-medium text-xl"> {{workunits}}</div>
					</div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width:2.5rem;height:2.5rem">
						<i class="pi pi-building text-blue-500 text-xl"></i>
					</div>
				</div>
			</div>
		</div> -->
		<div class="col-12 lg:col-4 xl:col-4">
			<div class="card mb-0">
				<div class="flex justify-content-between mb-3">
					<div>
						<span class="block text-500 font-medium mb-3">Jumlah Pegawai</span>
						<div class="text-900 font-medium text-xl">{{employees}}</div>
					</div>
                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width:2.5rem;height:2.5rem">
						<i class="pi pi-users text-orange-500 text-xl"></i>
					</div>
				</div>
			</div>
		</div>
		<div class="col-12 lg:col-4 xl:col-4" v-for="worktimeItem in worktimeItems" :key="worktimeItem.id">
			<div class="card mb-0">
				<div class="flex justify-content-between mb-3">
					<div>
						<span class="block text-500 font-medium mb-3">Presensi {{worktimeItem.name}} Hari Ini</span>
						<div class="text-900 font-medium text-xl">{{worktimeItem.counter}}</div>
					</div>
					<div class="flex align-items-center justify-content-center bg-orange-100 border-round"
						style="width:2.5rem;height:2.5rem">
						<i class="pi pi-clock text-orange-500 text-xl"></i>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
    data() {
        return {
            employees:0,
			workunits:0,
			worktimeItems:[]
        }
    },
    async created() {
		var params = ''
		var userData = JSON.parse(localStorage.getItem("presence_user_data"))
		if(userData.workunit_id)
		{
			params = '?workunit_id='+userData.workunit_id
		}
        var request = await fetch(process.env.VUE_APP_API_URL+'dashboards/index'+params)
		var response = await request.json()
		this.employees = response.data.employees
		this.workunits = response.data.workunits
		this.worktimeItems = response.data.worktimeItems
    }
}
</script>