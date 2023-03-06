<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2 d-flex">

                            <Calendar dateFormat="yy-mm-dd" :showIcon="true" :showButtonBar="true" v-model="date_start"
                                class="m-2" placeholder="Pilih Tanggal Mulai" @date-select="onDateChange" />
                            <Calendar dateFormat="yy-mm-dd" :showIcon="true" :showButtonBar="true" v-model="date_end"
                                class="m-2" placeholder="Pilih Tanggal Selesai" />

                            <Dropdown v-model="selectedWorkunit.id" :options="workunits" optionLabel="name"
                                v-if="['superuser','adminsistem','adminkepegawaian'].includes(role)"
                                optionValue="id" class="m-2" placeholder="Pilih OPD" :filter="true" />

                            <span class="p-input-icon-left m-2">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..."
                                    @keyup="onFilter" />
                            </span>

                            <Button label="Filter" icon="pi pi-search" class="p-button-success m-2" @click="onSearch" />
                        </div>
                    </template>
                </Toolbar>
                <DataTable :value="employees" :lazy="true" v-model:filters="filters"
                    ref="dt" dataKey="id" :loading="loading" :globalFilterFields="['name']"
                    v-model:selection="selectedCustomers" :selectAll="selectAll" @select-all-change="onSelectAllChange"
                    @row-select="onRowSelect" @row-unselect="onRowUnselect"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5,10,25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    responsiveLayout="scroll">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Laporan</h5>

                            <div>
                                <!-- <export-excel v-if="employees.length" :data="employees"
                                    class="p-button p-button-success m-2" worksheet="Laporan" :fields="fields"
                                    :name="'Laporan Rekapitulasi.xls'">
                                    Download Excel
                                </export-excel> -->

                                <Button v-if="employees.length" label="Download Pdf" class="p-button-success m-2"
                                    @click="onDownloadPdf" />
                            </div>
                        </div>
                    </template>
                    <Column field="id" header="ID" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">ID</span>
                            {{slotProps.data.id}}
                        </template>
                    </Column>
                    <Column field="name" header="Nama"></Column>
                    <Column field="nip" header="NIP"></Column>
                    <Column field="group" header="Golongan"></Column>
                    <Column field="position" header="Jabatan"></Column>
                    <Column field="kehadiran" class="text-center" header="Hadir"></Column>
                    <Column field="alfa" class="text-center" header="Alfa"></Column>
                    <Column field="_cuti" class="text-center" header="Cuti"></Column>
                    <Column field="_tugas" class="text-center" header="Tugas Luar/Dalam"></Column>
                    <Column field="hari_kerja" class="text-center" header="Hari Kerja"></Column>
                    <Column field="time_left" class="text-center" header="Kekurangan Waktu (Menit)"></Column>
                    <Column field="presentase" class="text-center" header="Persentase"></Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import WorkunitService from '../../service/WorkunitService';
import EmployeeService from '../../service/EmployeeService';
export default {
    data() {
        return {
            loading: false,
            employees:[],
            onsearchtimeout: null,
            totalRecords: 0,
            selectAll: false,
            filters: {},
            lazyParams: {},
            date_start:null,
            date_end:null,
            cdate_start:null,
            cdate_end:null,
            workunits:[],
            selectedWorkunit:{},
            role:localStorage.getItem("presence_app_role"),
            fields:{
                'Nama':'name',
                'NIP':{
                    field: 'nip',
                    callback: (value) => {
                        return `'${value}`;
                    }
                },
                'Golongan':'group',
                'Jabatan':'position',
                'Hadir':'hadir',
                'Izin':'izin',
                'Cuti':'cuti',
                'Sakit':'sakit',
                'Tugas Luar':'tugasluar',
                'Kegiatan':'kegiatan',
                'Alfa':'alfa',
            }
        }
    },
    workunitService: null,
    employeeService: null,
    created() {
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
            date_start:null,
            date_end:null,
            filters: this.filters
        };

        this.loadLazyData();
    },
    methods: {
        loadLazyData() {
            this.loading = true;

            var userData = JSON.parse(localStorage.getItem("presence_user_data"))
            if(userData.workunit_id) this.selectedWorkunit.id = userData.workunit_id

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
                    this.employeeService.getEmployeesReport(this.lazyParams,this.selectedWorkunit.id)
                        .then(data => {
                            if ('redirectTo' in data) {
                                localStorage.removeItem('presence_app_token')
                                localStorage.removeItem('presence_app_role')
                                this.$router.push(data.redirectTo)
                            }
                            this.employees = data.data;
                            this.totalRecords = data.total;
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

        onDownloadPdf() {
            window.open(this.employeeService.getEmployeesReportPdfLink(this.lazyParams, this.selectedWorkunit.id ?? this.userData.workunit_id))
        },

        onDateChange(){
            if (this.date_start) {
                let d = this.date_start
                let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate()
                let month = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1)
                this.cdate_start = d.getFullYear() + "-" + month + "-" + day
            }

            if (this.date_end) {
                let d = this.date_end
                let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate()
                let month = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1)
                this.cdate_end = d.getFullYear() + "-" + month + "-" + day
            }
        },

        onSearch(){
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
    }
}
</script>