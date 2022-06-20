<template>
	<div class="grid">
		<div class="col-12">
			<div class="card">
                <div class="font-medium text-3xl text-900 mb-3">Detail OPD</div>
                <ul class="list-none p-0 m-0">
                    <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Nama</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {{workunit.name}}
                        </div>
                    </li>
                    <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Latitude</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {{workunit.lat}}
                        </div>
                    </li>
                    <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Longitude</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {{workunit.lng}}
                        </div>
                    </li>
                    <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Radius</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {{workunit.radius}}
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <!--  Detail jam kerja -->
        <DetailWorktime 
            v-if="Object.keys(workunit).length != 0" 
            :workunit="workunit" 
            :workunitService="workunitService">
        </DetailWorktime>
        <!--  Rekapitulasi Absensi -->
	</div>
</template>

<script>
import WorkunitService from '../../service/WorkunitService'
import DetailWorktime from './DetailWorktime'

export default {
    components:{
        "DetailWorktime" : DetailWorktime,
    },
    data() {
        return {
            workunitId:null,
            workunit:{},
            submitted:false,
        }
    },
    workunitService: null,
    created() {
        this.workunitId = this.$route.params.id
        this.workunitService = new WorkunitService();
    },
    mounted(){
        this.initData()
    },
    methods:{
        initData(){
            this.workunitService.getWorkunit(this.workunitId).then(d => {
                this.workunit = d
            })
        },
    }
}
</script>