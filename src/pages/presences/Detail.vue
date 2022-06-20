<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="font-medium text-3xl text-900 mb-3">Detail Absensi</div>
                <ul class="list-none p-0 m-0">
                    <!-- <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Nama</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {{presence.employee.name}}
                        </div>
                    </li>
                    <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Jadwal</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {{presence.presence.name}}
                        </div>
                    </li> -->
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
                        <div class="text-500 w-6 md:w-2 font-medium">Tanggal</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {{presence.created_at}}
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
        }
    },
    employeeService: null,
    created() {
        this.presenceId = this.$route.params.id
        this.employeeId = this.$route.params.employee_id
        this.employeeService = new EmployeeService();
    },
    mounted(){
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