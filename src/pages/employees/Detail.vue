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
                        <div class="text-500 w-6 md:w-2 font-medium">Instansi</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                            {{employee.workunit?employee.workunit.name:''}}
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import EmployeeService from '../../service/EmployeeService';

export default {
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
    }
}
</script>