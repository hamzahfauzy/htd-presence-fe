<template>
    <div class="col-12">
        <div class="card">
            <Toolbar class="mb-4">
                <template v-slot:start>
                    <div class="my-2">
                        <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                    </div>
                </template>
            </Toolbar>

            <DataTable :value="employeeWorktimes" ref="dt" dataKey="id" responsiveLayout="scroll">
                <template #header>
                    <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                        <h5 class="m-0">Detail Jam Kerja</h5>
                    </div>
                </template>
                <Column field="id" header="ID" :sortable="true">
                    <template #body="slotProps">
                        <span class="p-column-title">ID</span>
                        {{slotProps.data.id}}
                    </template>
                </Column>
                <Column field="name" header="Nama"></Column>
                <Column field="pivot.date_start" header="Tanggal Mulai"></Column>
                <Column field="pivot.date_end" header="Tanggal Selesai"></Column>
                <Column header="Aksi">
                    <template #body="slotProps">
                        <Button v-if="slotProps.data.id" icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDelete(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>

            <Dialog v-model:visible="employeeWorktimeDialog" :style="{width: '450px'}" header="Form Detail Jam Kerja" :modal="true" class="p-fluid">
                <div class="field">
                    <label for="name">Jam Kerja</label>
                    <Dropdown v-model="employeeWorktime.worktime_id" :options="worktimes" optionLabel="name" optionValue="id" placeholder="Pilih Jam Kerja" :class="{'p-invalid': submitted && !employeeWorktime.worktime_id}"   />
                    <small class="p-invalid" v-if="submitted && !employeeWorktime.worktime_id">Jam kerja diperlukan.</small>
                </div>
                <div class="field">
                    <label for="date">Tanggal Mulai</label>
                    <Calendar id="date" dateFormat="yy-mm-dd" :showIcon="true" :showButtonBar="true" v-model="employeeWorktime.date_start" required="true" autofocus :class="{'p-invalid': submitted && !employeeWorktime.date_start}" />
                    <small class="p-invalid" v-if="submitted && !employeeWorktime.date_start">Tanggal mulai diperlukan.</small>
                </div>
                <div class="field">
                    <label for="date">Tanggal Selesai</label>
                    <Calendar id="date" dateFormat="yy-mm-dd" :showIcon="true" :showButtonBar="true" v-model="employeeWorktime.date_end" required="true" autofocus :class="{'p-invalid': submitted && !employeeWorktime.date_end}" />
                    <small class="p-invalid" v-if="submitted && !employeeWorktime.date_end">Tanggal selesai diperlukan.</small>
                </div>
                <template #footer>
                    <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
                    <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveWorktime" />
                </template>
            </Dialog>
        </div>
    </div>
</template>

<script>
import WorktimeService from '../../service/WorktimeService'

export default {
    props:{
        employee:{},
        employeeService:null,
    },
    data() {
        return {
            loading: false,
            worktimes: null,
            employeeWorktimes: null,
            employeeWorktime: {},
            filters: {},
            lazyParams: {},
            columns: [
                {field: 'id', header: 'ID'},
                {field: 'name', header: 'Nama'},
                {field: 'pivot.date_start', header: 'Tanggal Mulai'},
                {field: 'pivot.date_end', header: 'Tanggal Selesai'}
            ],
            employeeWorktimeDialog: false,
            submitted:false,
        }
    },
    worktimeService: null,
    created() {
        this.worktimeService = new WorktimeService()
        this.employeeWorktimes = this.employee.worktimes
    },
    mounted(){
        this.initData()
    },
    methods:{
        initData(){
            this.worktimeService.getAllWorktimes().then(d => {
                this.worktimes = d
            })
        },
        openNew() {
			this.employeeWorktime = {};
			this.submitted = false;
			this.employeeWorktimeDialog = true;
		},
        editPlace(employeeWorktime) {
			this.employeeWorktime = {...employeeWorktime};
			this.employeeWorktimeDialog = true;
		},
        confirmDelete(employeeWorktime) {
			this.employeeWorktime = employeeWorktime;
			this.$swal({
                title: 'Apakah anda yakin akan menghapus data ini ?',
                showCancelButton: true,
                confirmButtonText: 'Hapus',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.employeeService.deleteWorktime(this.employee, this.employeeWorktime)
                    .then(data => {
                        if('redirectTo' in data)
                        {
                            localStorage.removeItem('presence_app_token')
                            localStorage.removeItem('presence_app_role')
                            this.$router.push(data.redirectTo)
                        }

                        if(!data.success)
                        {
                            this.$swal({
                                icon: 'error',
                                title: 'Oops...',
                                text: data.message,
                            })
                        }
                        else
                        {
                            this.employeeWorktimes = this.employeeWorktimes.filter(val => val.id !== this.employeeWorktime.id);
                            this.$swal({
                                icon: 'success',
                                title: 'Success',
                                text: data.message
                            })
                            this.employeeWorktimeDialog = false;
                            this.employeeWorktime = {};
                        }
                    })
                }
            })
		},
        hideDialog() {
			this.employeeWorktimeDialog = false;
			this.submitted = false;
		},
        saveWorktime() {
			this.submitted = true;
            var d = this.employeeWorktime.date_start
            var day = d.getDate() < 10 ? "0"+d.getDate() : d.getDate()
            var month = (d.getMonth()+1) < 10 ? "0"+(d.getMonth()+1) : (d.getMonth()+1)
            this.employeeWorktime.date_start =  d.getFullYear() + "-" + month + "-" + day

            d = this.employeeWorktime.date_end
            day = d.getDate() < 10 ? "0"+d.getDate() : d.getDate()
            month = (d.getMonth()+1) < 10 ? "0"+(d.getMonth()+1) : (d.getMonth()+1)
            this.employeeWorktime.date_end =  d.getFullYear() + "-" + month + "-" + day

            this.employeeService.addWorktime(this.employee, this.employeeWorktime)
            .then(data => {
                if('redirectTo' in data)
                {
                    localStorage.removeItem('presence_app_token')
                    localStorage.removeItem('presence_app_role')
                    this.$router.push(data.redirectTo)
                }

                if(!data.success)
                {
                    this.$swal({
                        icon: 'error',
                        title: 'Oops...',
                        text: data.message,
                    })
                }
                else
                {
                    this.$swal({
                        icon: 'success',
                        title: 'Success',
                        text: data.message
                    })
                    var worktime = this.worktimes.find(w => w.id === this.employeeWorktime.worktime_id)
                    this.employeeWorktimes.push({
                        name: worktime.name,
                        pivot: {
                            date_start:this.employeeWorktime.date_start,
                            date_end:this.employeeWorktime.date_end
                        }
                    })
                    this.employeeWorktimeDialog = false;
                    this.employeeWorktime = {};
                }
            })
		},
        findIndexById(id) {
			let index = -1;
			for (let i = 0; i < this.employeeWorktimes.length; i++) {
				if (this.employeeWorktimes[i].id === id) {
					index = i;
					break;
				}
			}
			return index;
		}
    }
}
</script>