<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="font-medium text-3xl text-900 mb-3">Detail Pegawai</div>
                <ul class="list-none p-0 m-0">
                    <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">NIP</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{employee.nip}}</div>
                    </li>
                    <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Nama</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {{employee.name}}
                        </div>
                    </li>
                    <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Golongan</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{employee.group}}</div>
                    </li>
                    <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Jabatan</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {{employee.position}}
                        </div>
                    </li>
                    <li class="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Unit Kerja</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                            {{employee.workunit?employee.workunit.name:''}}
                        </div>
                    </li>
                    <li class="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 surface-border flex-wrap" v-if="role == 'superuser'">
                        <div class="text-500 w-6 md:w-2 font-medium">Bebas Lokasi</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                            {{employee.is_free_place?'Ya':'Tidak'}}
                            {{ role != 'adminsistem' ?'-' : ''}}
                            <a href="javascript:void(0)" @click="patchPlace()">Update</a>
                        </div>
                    </li>
                    <li class="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Pengguna Android</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                            {{employee.is_android_user?'Ya':'Tidak'}}
                            {{ role != 'adminsistem' ?'-' : ''}}
                            <a href="javascript:void(0)" @click="patchAndroid()">Update</a>
                        </div>
                    </li>
                    <li class="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 surface-border flex-wrap" v-if="role == 'adminsistem' || role == 'adminkepegawaian' || role == 'superuser'">
                        <div class="text-500 w-6 md:w-2 font-medium">Device</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                            {{employee.user?.device_number ?? '-'}}
                            <a v-if="employee.user?.device_number" href="javascript:void(0)" @click="resetDevice()">- Reset Device</a>
                        </div>
                    </li>
                    <li class="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 surface-border flex-wrap"
                        v-if="role == 'adminsistem' || role == 'adminkepegawaian' || role == 'superuser'">
                        <div class="text-500 w-6 md:w-2 font-medium">Password</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                            <a href="javascript:void(0)" @click="resetPassword()">Reset Password</a>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <Dialog v-model:visible="roleDialog" :style="{width: '450px'}" header="Edit System Role" :modal="true"
            class="p-fluid">
            <div class="field">
                <label for="name">Role Name</label>
                <Dropdown v-model="user_role" :options="roleLists" optionLabel="name" optionValue="value"
                    placeholder="Pilih Role" :class="{'p-invalid': submitted && !user_role}" />
                <small class="p-invalid" v-if="submitted && !user_role">Role name diperlukan.</small>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideRoleDialog" />
                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveRole" />
            </template>
        </Dialog>

        <!--  Detail jam kerja -->
        <DetailWorktime v-if="Object.keys(employee).length != 0" :employee="employee"
            :employeeService="employeeService">
        </DetailWorktime>

        <!--  Rekapitulasi Absensi -->
    </div>
</template>

<script>
import EmployeeService from '../../service/EmployeeService';
import DetailWorktime from './DetailWorktime'

export default {
    components:{
        "DetailWorktime" : DetailWorktime,
    },
    data() {
        return {
            employeeId:null,
            employee:{},
            roleDialog: false,
            submitted:false,
            user_role:'',
            roleLists:[
                {name: "Pegawai", value: "pegawai"},
                {name: "Kasubag Umum", value: "kasubagumum"},
                {name: "Admin BKD", value: "adminkepegawaian"},
                {name: "Admin OPD", value: "adminopd"}
            ],
            role: localStorage.getItem("presence_app_role")
        }
    },
    employeeService: null,
    created() {
        this.employeeId = this.$route.params.id
        this.employeeService = new EmployeeService();
    },
    mounted(){
        this.initData()
    },
    methods:{
        initData(){
            this.employeeService.getEmployee(this.employeeId).then(d => {
                this.employee = d
            })
        },
        editRole() {
			this.roleDialog = true;
            this.user_role = this.employee.user.role
		},
        hideRoleDialog() {
			this.roleDialog = false;
			this.submitted = false;
		},
        saveRole() {
			this.submitted = true;
            this.employeeService.updateRole(this.employee.user, this.user_role)
            .then(res => {
                if('redirectTo' in res)
                {
                    localStorage.removeItem('presence_app_token')
                    localStorage.removeItem('presence_app_role')
                    this.$router.push(res.redirectTo)
                }
                if(!res.success)
                {
                    this.$swal({
                        icon: 'error',
                        title: 'Oops...',
                        text: res.message,
                    })
                }
                else
                {
                    this.$swal({
                        icon: 'success',
                        title: 'Success',
                        text: res.message
                    })
                    this.roleDialog = false;
                    this.employee.user.role = this.user_role
                }
            })
		},
        patchPlace() {
            this.employeeService.patchPlace(this.employee)
            .then(res => {
                if('redirectTo' in res)
                {
                    localStorage.removeItem('presence_app_token')
                    localStorage.removeItem('presence_app_role')
                    this.$router.push(res.redirectTo)
                }
                if(!res.success)
                {
                    this.$swal({
                        icon: 'error',
                        title: 'Oops...',
                        text: res.message,
                    })
                }
                else
                {
                    this.$swal({
                        icon: 'success',
                        title: 'Success',
                        text: res.message
                    })
                    this.employee.is_free_place = !this.employee.is_free_place
                }
            })
		},
        patchAndroid() {
            this.employeeService.patchAndroid(this.employee)
            .then(res => {
                if('redirectTo' in res)
                {
                    localStorage.removeItem('presence_app_token')
                    localStorage.removeItem('presence_app_role')
                    this.$router.push(res.redirectTo)
                }
                if(!res.success)
                {
                    this.$swal({
                        icon: 'error',
                        title: 'Oops...',
                        text: res.message,
                    })
                }
                else
                {
                    this.$swal({
                        icon: 'success',
                        title: 'Success',
                        text: res.message
                    })
                    this.employee.is_android_user = !this.employee.is_android_user
                }
            })
		},
        resetDevice() {
            this.employeeService.resetDevice(this.employee)
                .then(res => {
                    if ('redirectTo' in res) {
                        localStorage.removeItem('presence_app_token')
                        localStorage.removeItem('presence_app_role')
                        this.$router.push(res.redirectTo)
                    }
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
        },
        resetPassword() {
            this.employeeService.resetPassword(this.employee)
                .then(res => {
                    if ('redirectTo' in res) {
                        localStorage.removeItem('presence_app_token')
                        localStorage.removeItem('presence_app_role')
                        this.$router.push(res.redirectTo)
                    }
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
        },
    }
}
</script>
