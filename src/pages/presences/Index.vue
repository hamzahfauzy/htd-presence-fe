<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Pengajuan Izin/Sakit" class="p-button-success mr-2" @click="openNew" />
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
                            <h5 class="m-0">Manajemen Absensi</h5>

                            <div class="flex">
                                <Dropdown v-model="selectedWorkunit.id" :options="workunits" optionLabel="name"
                                    optionValue="id" class="mr-3" placeholder="Pilih OPD" @change="onWorkunitChange" />
                                
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
                    <Column field="presence.name" header="Jadwal"></Column>
                    <Column field="type" header="Tipe"></Column>
                    <Column field="status" header="Status"></Column>
                    <Column field="created_at" header="Tanggal"></Column>
                    <Column header="Aksi">
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

                <Dialog v-model:visible="pengajuanDialog" :style="{width: '450px'}" header="Form Pengajuan Izin/Sakit" :modal="true" class="p-fluid">
					<div class="field">
						<label for="name">OPD</label>
                        <Dropdown v-model="pengajuan.workunit_id" :options="workunits" optionLabel="name"
                                    optionValue="id" class="mr-3" required="true" placeholder="Pilih OPD" @change="onPengajuanWorkunitChange" :class="{'p-invalid': submitted && !pengajuan.workunit_id}" />
                        <small class="p-invalid" v-if="submitted && !pengajuan.workunit_id">OPD diperlukan.</small>
					</div>
					<div class="field">
						<label for="name">Pegawai</label>
                        <Dropdown v-model="pengajuan.employee_id" :options="employees" optionLabel="name"
                                    optionValue="id" class="mr-3" required="true" placeholder="Pilih Pegawai" :class="{'p-invalid': submitted && !pengajuan.employee_id}" />
                        <small class="p-invalid" v-if="submitted && !pengajuan.employee_id">Pegawai diperlukan.</small>
					</div>
                    <div class="field">
						<label for="lat">Jenis Pengajuan</label>
                        <Dropdown v-model="pengajuan.type" :options="[{name:'izin'},{name:'sakit'}]" optionLabel="name"
                                    optionValue="name" class="mr-3" required="true" placeholder="Pilih Jenis Pengajuan" :class="{'p-invalid': submitted && !pengajuan.type}" />
						<small class="p-invalid" v-if="submitted && !pengajuan.type">Jenis pengajuan diperlukan.</small>
					</div>
                    <div class="field">
						<label for="lat">Lampiran</label>
                        <div class="p-component p-inputwrapper mr-3">
                            <input type="file" ref="lampiran" class="" :class="{'p-invalid': submitted && !pengajuan.attachment}" required="true">
                        </div>
						<small class="p-invalid" v-if="submitted && !pengajuan.attachment">File lampiran diperlukan.</small>
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
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

export default {
    data() {
        return {
            loading: false,
            pengajuanDialog: false,
            employees:null,
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
        }
    },
    presenceService: null,
    workunitService: null,
    employeeService: null,
    created() {
        this.presenceService = new PresenceService();
        this.workunitService = new WorkunitService();
        this.employeeService = new EmployeeService();
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
            filters: this.filters
        };

        this.loadLazyData();
    },
    methods: {
        loadLazyData() {
            this.loading = true;

            setTimeout(() => {

                this.workunitService.getWorkunits(this.lazyParams)
                    .then(data => {
                        if ('redirectTo' in data) {
                            localStorage.removeItem('presence_app_token')
                            this.$router.push(data.redirectTo)
                        }
                        this.workunits = data.data;
                        this.loading = false;
                    }
                    );

                if(this.selectedWorkunit.id){
                    this.workunitService.getPresences(this.selectedWorkunit.id)
                        .then(data => {
                            if ('redirectTo' in data) {
                                localStorage.removeItem('presence_app_token')
                                this.$router.push(data.redirectTo)
                            }
                            this.presences = data.data;
                            this.loading = false;
                        }
                        );
                }
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
        openNew(){
            this.pengajuanDialog = true
        },

        savePengajuan(){
            this.submitted = true
            var file = this.$refs.lampiran
            if(file.files.length)
            {
                this.pengajuan.attachment = true
                var formData = new FormData;
                formData.append('type',this.pengajuan.type)
                formData.append('attachment',file.files[0])

                this.employeeService.insertPresence(this.pengajuan.employee_id, formData)
                    .then(data => {
                        if ('redirectTo' in data) {
                            localStorage.removeItem('presence_app_token')
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