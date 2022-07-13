<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="font-medium text-3xl text-900 mb-3">Detail Absensi</div>
                <ul class="list-none p-0 m-0" v-if="presence.employee">
                    <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Pegawai</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {{presence.employee.nip+' - '+presence.employee.name}}
                        </div>
                    </li>
                    <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Jadwal</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {{ presence.worktime_item?.name }}
                        </div>
                    </li>
                    <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">OPD</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {{presence.workunit.name}}
                        </div>
                    </li>
                    <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Tipe</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {{presence.type}}
                        </div>
                    </li>
                    <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Status</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {{presence.status}}
                        </div>
                    </li>
                    <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Waktu Mulai</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {{presence.started_at}}
                        </div>
                    </li>
                    <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Waktu Selesai</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {{presence.finished_at}}
                        </div>
                    </li>
                    <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Tanggal</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {{presence.created_at}}
                        </div>
                    </li>
                    <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Selfi</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            <img :src="storage_url+presence.pic_url" v-if="presence.pic_url" style="width:250px">
                        </div>
                    </li>
                    <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Lampiran</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            <a :href="storage_url+presence.attachment_url" target="_blank"
                                v-if="presence.attachment_url">Download</a>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import EmployeeService from '../../service/EmployeeService'

export default {
    data() {
        return {
            employeeId:null,
            presenceId:null,
            presence:{},
            submitted:false,
            storage_url:process.env.VUE_APP_STORAGE_URL
        }
    },
    employeeService: null,
    created() {
        this.presenceId = this.$route.params.id
        this.employeeId = this.$route.params.employee_id
        this.employeeService = new EmployeeService();
        this.initData()
    },
    methods:{
        initData(){
            this.employeeService.getPresence(this.employeeId,this.presenceId).then(d => {
                this.presence = d
                console.log(d)
            })
        },
    }
}
</script>