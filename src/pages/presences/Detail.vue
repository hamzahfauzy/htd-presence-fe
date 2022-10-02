<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="flex justify-content-between mb-3 align-items-center">
                    <div class="font-medium text-3xl text-900">Detail {{ presence.presence_id ? "Absensi" : (presence.type.includes('tugas') ? presence.type : "Cuti")}}</div>
                    <div>
                        <Button icon="pi pi-check" class="p-button-rounded p-button-success mr-2"
                            v-if="presence.status == 'diajukan'" @click="action('setujui', presence)" />
                        <Button icon="pi pi-times" class="p-button-rounded p-button-danger mr-2"
                            v-if="presence.status == 'diajukan'" @click="action('tolak', presence)" />
                    </div>
                </div>
                <ul class="list-none p-0 m-0" v-if="presence.employee">
                    <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Pegawai</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {{presence.employee.nip+' - '+presence.employee.name}}
                        </div>
                    </li>
                    <li v-if="presence.presence_id"
                        class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
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
                    <li v-if="presence.presence_id"
                        class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Di lokasi</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {{presence.in_location == 1 ? "Ya" : "Tidak"}}
                        </div>
                    </li>
                    <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Status</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {{presence.status}}
                        </div>
                    </li>
                    <li v-if="presence.presence_id == null || presence.type == 'tugas luar'"
                        class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Waktu Mulai</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {{presence.started_at}}
                        </div>
                    </li>
                    <li v-if="presence.presence_id == null || presence.type == 'tugas luar'"
                        class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
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
                    <li v-if="presence.presence_id"
                        class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
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
                    <li v-if="presence.presence_id"
                        class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Lokasi</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            <iframe width="500" height="300"
                                :src="'//maps.google.com/maps?q=' + presence.lat + ',' + presence.lng +'&z=15&output=embed'"
                                allowfullscreen style="border:0" referrerpolicy="no-referrer-when-downgrade"></iframe>
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
        action(status, data) {
            this.$swal({
                title: 'Apakah anda yakin akan ' + status + ' data ini ?',
                showCancelButton: true,
                confirmButtonText: 'Ya',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.employeeService.actionPresence('di' + status, data)
                        .then(res => {
                            if (!res.success) {
                                this.$swal({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: res.message,
                                })
                            }
                            else {
                                this.$swal({
                                    icon: 'success',
                                    title: 'Success',
                                    text: res.message
                                })
                                this.initData()
                            }
                        })
                }
            })
        },
    }
}
</script>