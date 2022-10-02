<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4" v-if="role!='adminkepegawaian'">
                    <template v-slot:start>
                        <div class="my-2 d-flex">
                            <Button label="Pengajuan Cuti" class="p-button-success m-2" @click="openNew" />

                            <Calendar dateFormat="yy-mm-dd" :showIcon="true" :showButtonBar="true" v-model="date_start"
                                class="m-2" placeholder="Pilih Tanggal Mulai" @change="onDateChange" />
                            <Calendar dateFormat="yy-mm-dd" :showIcon="true" :showButtonBar="true" v-model="date_end"
                                class="m-2" placeholder="Pilih Tanggal Selesai" @change="onDateChange" />

                            <Dropdown v-model="selectedWorkunit.id" :options="workunits" optionLabel="name"
                                optionValue="id" class="m-2" placeholder="Pilih OPD" />

                            <span class="p-input-icon-left m-2">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..."
                                    @keyup="onFilter" />
                            </span>

                            <Button label="Filter" icon="pi pi-search" class="p-button-success m-2" @click="onSearch" />
                        </div>
                    </template>
                </Toolbar>

                <DataTable :value="presences" :lazy="true" :paginator="true" :rows="10" v-model:filters="filters"
                    ref="dt" dataKey="id" :totalRecords="totalRecords" :loading="loading" @page="onPage($event)"
                    @sort="onSort($event)" @filter="onFilter($event)" :globalFilterFields="['name']"
                    v-model:selection="selectedCustomers" :selectAll="selectAll" @select-all-change="onSelectAllChange"
                    @row-select="onRowSelect" @row-unselect="onRowUnselect"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5,10,25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    responsiveLayout="scroll">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manajemen Cuti</h5>

                            <div class="flex">
                                <span class="mt-2 md:mt-0 p-input-icon-left">
                                    <i class="pi pi-search" />
                                    <InputText v-model="filters['global'].value" placeholder="Search..."
                                        @keyup="onFilter" />
                                </span>
                            </div>
                        </div>
                    </template>
                    <Column field="id" header="ID" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">ID</span>
                            {{slotProps.data.id}}
                        </template>
                    </Column>
                    <Column field="employee.name" header="Nama"></Column>
                    <Column field="type" header="Jenis Pengajuan"></Column>
                    <Column field="workunit.name" header="OPD"></Column>
                    <Column field="status" header="Status"></Column>
                    <Column field="started_at" header="Waktu Mulai"></Column>
                    <Column field="finished_at" header="Waktu Selesai"></Column>
                    <Column field="created_at" header="Tanggal"></Column>
                    <Column header="Aksi" v-if="role != 'kasubagumum'">
                        <template #body="slotProps">
                            <router-link
                                :to='{"name":"presences.detail","params":{"id":slotProps.data.id,"employee_id":slotProps.data.employee.id}}'>
                                <Button icon="pi pi-eye" class="p-button-rounded p-button-info mr-2" />
                            </router-link>

                            <Button icon="pi pi-check" class="p-button-rounded p-button-success mr-2"
                                v-if="slotProps.data.status == 'diajukan'" @click="action('setujui', slotProps.data)" />
                            <Button icon="pi pi-times" class="p-button-rounded p-button-danger mr-2"
                                v-if="slotProps.data.status == 'diajukan'" @click="action('tolak', slotProps.data)" />
                            <!-- <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                                @click="editPresence(slotProps.data)" />
                            <Button v-if="slotProps.data.id" icon="pi pi-trash"
                                class="p-button-rounded p-button-warning mt-2" @click="confirmDelete(slotProps.data)" /> -->
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="pengajuanDialog" :style="{width: '450px'}" header="Form Pengajuan Cuti"
                    :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="name">OPD</label>
                        <Dropdown v-model="pengajuan.workunit_id" :options="workunits" optionLabel="name"
                            optionValue="id" class="mr-3" required="true" placeholder="Pilih OPD"
                            @change="onPengajuanWorkunitChange"
                            :class="{'p-invalid': submitted && !pengajuan.workunit_id}" />
                        <small class="p-invalid" v-if="submitted && !pengajuan.workunit_id">OPD diperlukan.</small>
                    </div>
                    <div class="field">
                        <label for="name">Pegawai</label>
                        <Dropdown v-model="pengajuan.employee_id" :options="employees" optionLabel="name"
                            optionValue="id" class="mr-3" required="true" placeholder="Pilih Pegawai"
                            :class="{'p-invalid': submitted && !pengajuan.employee_id}" />
                        <small class="p-invalid" v-if="submitted && !pengajuan.employee_id">Pegawai diperlukan.</small>
                    </div>
                    <div class="field">
                        <label for="lat">Jenis Pengajuan</label>
                        <Dropdown v-model="pengajuan.type" :options="paid_leaves" optionLabel="name" optionValue="name"
                            class="mr-3" required="true" placeholder="Pilih Jenis Pengajuan"
                            :class="{'p-invalid': submitted && !pengajuan.type}" />
                        <small class="p-invalid" v-if="submitted && !pengajuan.type">Jenis pengajuan diperlukan.</small>
                    </div>
                    <div class="field">
                        <label for="name">Waktu Mulai</label>
                        <Calendar v-model="pengajuan.started_at"
                            :class="{ 'p-invalid': submitted && !pengajuan.started_at}" />
                        <small class="p-invalid" v-if="submitted && !pengajuan.started_at">Waktu Mulai
                            diperlukan.</small>
                    </div>
                    <div class="field">
                        <label for="name">Waktu Selesai</label>
                        <Calendar v-model="pengajuan.finished_at"
                            :class="{ 'p-invalid': submitted && !pengajuan.finished_at}" />
                        <small class="p-invalid" v-if="submitted && !pengajuan.finished_at">Waktu Mulai
                            diperlukan.</small>
                    </div>
                    <div class="field">
                        <label for="lat">Lampiran</label>
                        <div class="p-component p-inputwrapper mr-3">
                            <input type="file" ref="lampiran" class=""
                                :class="{'p-invalid': submitted && !pengajuan.attachment}" required="true">
                        </div>
                        <small class="p-invalid" v-if="submitted && !pengajuan.attachment">File lampiran
                            diperlukan.</small>
                    </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="savePengajuan" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import PresenceService from '../../service/PresenceService';
import WorkunitService from '../../service/WorkunitService';
import EmployeeService from '../../service/EmployeeService';
import PaidLeaveService from '../../service/PaidLeaveService';

export default {
    data() {
        return {
            loading: false,
            pengajuanDialog: false,
            employees:null,
            paid_leaves:null,
            pengajuan:{},
            submitted:false,
            onsearchtimeout: null,
            totalRecords: 0,
            presences: null,
            presence: {},
            selectedPresences: null,
            selectAll: false,
            filters: {},
            lazyParams: {},
            workunits:[],
            selectedWorkunit:{},
            role:localStorage.getItem("presence_app_role"),
            date_start: null,
            date_end: null,
        }
    },
    presenceService: null,
    workunitService: null,
    employeeService: null,
    paidLeaveService: null,
    created() {
        this.presenceService = new PresenceService();
        this.workunitService = new WorkunitService();
        this.employeeService = new EmployeeService();
        this.paidLeaveService = new PaidLeaveService();
        this.initFilters()
    },
    mounted() {
        this.loading = true;

        this.lazyParams = {
            first: 0,
            page: 0,
            rows: this.$refs.dt.rows,
            sortField: null,
            sortOrder: 1,
            filters: this.filters,
            date_start: null,
            date_end: null,
        };

        this.loadLazyData();
    },
    methods: {
        loadLazyData() {
            this.loading = true;

            setTimeout(() => {

                this.workunitService.getWorkunits()
                    .then(data => {
                        if ('redirectTo' in data) {
                            localStorage.removeItem('presence_app_token')
                            localStorage.removeItem('presence_app_role')
                            this.$router.push(data.redirectTo)
                        }
                        this.workunits = data.data;
                        this.loading = false;
                    }
                    );

                if(this.selectedWorkunit.id){
                    this.workunitService.getPresences(this.lazyParams,this.selectedWorkunit.id,2)
                        .then(data => {
                            if ('redirectTo' in data) {
                                localStorage.removeItem('presence_app_token')
                                localStorage.removeItem('presence_app_role')
                                this.$router.push(data.redirectTo)
                            }
                            this.presences = data.data;
                            this.totalRecords = data.total;
                            this.loading = false;
                        }
                        );
                }
                else
                {
                    this.workunitService.getPresences(this.lazyParams,false,2)
                        .then(data => {
                            if ('redirectTo' in data) {
                                localStorage.removeItem('presence_app_token')
                                localStorage.removeItem('presence_app_role')
                                this.$router.push(data.redirectTo)
                            }
                            this.presences = data.data;
                            this.totalRecords = data.total;
                            this.loading = false;
                        }
                        );
                }

                this.paidLeaveService.getPaidLeaves()
                    .then(data => {
                        if ('redirectTo' in data) {
                            localStorage.removeItem('presence_app_token')
                            localStorage.removeItem('presence_app_role')
                            this.$router.push(data.redirectTo)
                        }
                        this.paid_leaves = data.data;
                    }
                    );
            }, Math.random() * 1000 + 250);
        },
        onPage(event) {
            this.lazyParams = event;
            this.loadLazyData();
        },
        onSort(event) {
            var page = this.lazyParams.page
            this.lazyParams = event;
            this.lazyParams.page = page
            this.loadLazyData();
        },
        onFilter() {
            if(this.onsearchtimeout)
                clearTimeout(this.onsearchtimeout)
            this.onsearchtimeout = setTimeout( () => {
                this.lazyParams.filters = this.filters;
                this.loadLazyData();
            }, 1000)
        },
        onSearch() {
            this.lazyParams.filters = this.filters;

            if (this.date_start) {
                let d = this.date_start
                let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate()
                let month = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1)
                this.lazyParams.date_start = d.getFullYear() + "-" + month + "-" + day
            }

            if (this.date_end) {
                let d = this.date_end
                let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate()
                let month = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1)
                this.lazyParams.date_end = d.getFullYear() + "-" + month + "-" + day
            }

            this.loadLazyData();
        },
        openNew(){
            this.pengajuanDialog = true
        },

        savePengajuan(){
            this.submitted = true
            var file = this.$refs.lampiran
            if(file.files.length)
            {
                var d = this.pengajuan.started_at
                var day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate()
                var month = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1)
                this.pengajuan.started_at = d.getFullYear() + "-" + month + "-" + day

                d = this.pengajuan.finished_at
                day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate()
                month = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1)
                this.pengajuan.finished_at = d.getFullYear() + "-" + month + "-" + day

                this.pengajuan.attachment = true
                var formData = new FormData;
                formData.append('type',this.pengajuan.type)
                formData.append('attachment',file.files[0])
                formData.append('started_at',this.pengajuan.started_at)
                formData.append('finished_at',this.pengajuan.finished_at)

                this.employeeService.insertPresence(this.pengajuan.employee_id, formData)
                    .then(data => {
                        if ('redirectTo' in data) {
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
                            this.selectedWorkunit.id = this.pengajuan.workunit_id
                            this.loadLazyData()
                            this.hideDialog()
                        }
                    });
            }
        },

        onWorkunitChange() {
            this.lazyParams.filters = this.filters;
            this.loadLazyData();
        },
        
        onPengajuanWorkunitChange() {
            this.workunitService.getWorkunit(this.pengajuan.workunit_id)
            .then(data => {
                if ('redirectTo' in data) {
                    localStorage.removeItem('presence_app_token')
                    localStorage.removeItem('presence_app_role')
                    this.$router.push(data.redirectTo)
                }
                this.employees = data.employees;
            });
        },
		initFilters() {
            this.filters = {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
            }
        },

        confirmDelete(presence) {
			this.presence = presence;
			this.$swal({
                title: 'Apakah anda yakin akan menghapus data ini ?',
                showCancelButton: true,
                confirmButtonText: 'Hapus',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.presenceService.deletePresence(this.presence)
                    .then(res => {
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
                            this.presences = this.presences.filter(val => val.id !== this.presence.id);
                            this.$swal({
                                icon: 'success',
                                title: 'Success',
                                text: res.message
                            })
                            this.presenceDialog = false;
                            this.presence = {};
                        }
                    })
                }
            })
		},
        action(status, data){
            this.$swal({
                title: 'Apakah anda yakin akan '+status+' data ini ?',
                showCancelButton: true,
                confirmButtonText: 'Ya',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.employeeService.actionPresence('di'+status, data)
                    .then(res => {
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
                            this.loadLazyData()
                        }
                    })
                }
            })
        },
        hideDialog() {
			this.pengajuanDialog = false;
			this.submitted = false;
		},
    }
}
</script>