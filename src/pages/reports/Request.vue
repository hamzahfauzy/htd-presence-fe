<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2 d-flex">

                            <Calendar dateFormat="yy-mm-dd" :showIcon="true" :showButtonBar="true" v-model="date_start"
                                class="m-2" placeholder="Pilih Tanggal Awal" @date-select="onDateChange" />
                            <Calendar dateFormat="yy-mm-dd" :showIcon="true" :showButtonBar="true" v-model="date_end"
                                class="m-2" placeholder="Pilih Tanggal Akhir" @date-select="onDateChange" />

                            <Dropdown v-model="report.workunit_id" :options="workunits" optionLabel="name"
                                v-if="['superuser','adminsistem','adminkepegawaian'].includes(role)"
                                optionValue="id" class="m-2" placeholder="Pilih OPD" :filter="true" />
                            
                            <Dropdown v-model="report.report_type" :options="[{name:'Rekapitulasi',value:'rekapitulasi'},{name:'Detail',value:'detail'}]" optionLabel="name"
                                optionValue="value" class="m-2" placeholder="Pilih Report Type" :filter="true" />

                            <Button label="Buat Laporan" class="p-button-success m-2" @click="saveReport()" />
                        </div>
                    </template>
                </Toolbar>
                <DataTable :value="reports" :lazy="true" v-model:filters="filters"
                    ref="dt" dataKey="id" :loading="loading" :globalFilterFields="['name']"
                    v-model:selection="selectedCustomers" :selectAll="selectAll" @select-all-change="onSelectAllChange"
                    @row-select="onRowSelect" @row-unselect="onRowUnselect"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5,10,25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    responsiveLayout="scroll">
                    <Column field="id" header="ID" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">ID</span>
                            {{slotProps.data.id}}
                        </template>
                    </Column>
                    <Column field="workunit.name" header="OPD / Unit Kerja"></Column>
                    <Column field="start_at" header="Tanggal Awal"></Column>
                    <Column field="end_at" header="Tanggal Akhir"></Column>
                    <Column field="status" header="Status"></Column>
                    <Column field="file_url" header="File" 
                        headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">File</span>
                            <a :href="slotProps.data.file_url" v-if="slotProps.data.file_url">Download File</a>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import WorkunitService from '../../service/WorkunitService';
import ReportRequestService from '../../service/ReportRequestService';
export default {
    data() {
        return {
            loading: false,
            reports:[],
            onsearchtimeout: null,
            totalRecords: 0,
            selectAll: false,
            filters: {},
            lazyParams: {},
            date_start:null,
            date_end:null,
            cdate_start:null,
            cdate_end:null,
            report: {
                report_type:null,
                start_at:null,
                end_at:null,
                workunit_id:null,
            },
            workunits:[],
            selectedWorkunit:{},
            role:localStorage.getItem("presence_app_role"),
            fields:{
                'OPD':'workunit.name',
                'Tanggal Awal':'start_at',
                'Tanggal Akhir':'end_at',
                'Status':'status',
                'File URL':'file_url',
            }
        }
    },
    workunitService: null,
    reportService: null,
    created() {
        this.workunitService = new WorkunitService();
        this.reportService = new ReportRequestService();
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

                this.reportService.getReports(this.selectedWorkunit ? this.selectedWorkunit.id : {})
                    .then(data => {
                        if ('redirectTo' in data) {
                            localStorage.removeItem('presence_app_token')
                            localStorage.removeItem('presence_app_role')
                            this.$router.push(data.redirectTo)
                        }
                        this.reports = data.data;
                        this.totalRecords = data.total;
                        this.loading = false;
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

        onDownloadPdf() {
            window.open(this.employeeService.getEmployeesReportPdfLink(this.lazyParams, this.selectedWorkunit.id ?? this.userData.workunit_id))
        },
        
        onDateChange(){
            if (this.date_start) {
                let d = this.date_start
                let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate()
                let month = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1)
                this.report.start_at = d.getFullYear() + "-" + month + "-" + day
            }
            
            if (this.date_end) {
                let d = this.date_end
                let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate()
                let month = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1)
                this.report.end_at = d.getFullYear() + "-" + month + "-" + day
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
        saveReport() {
			this.reportService.createReport(this.report)
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
                    this.loadLazyData()
                    this.paidLeaveDialog = false;
                    this.paidLeave = {};
                    this.$swal({
                        icon: 'success',
                        title: 'Success',
                        text: res.message
                    })
                }
            })
		},
    }
}
</script>