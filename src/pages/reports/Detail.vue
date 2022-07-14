<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2 d-flex">

                            <Calendar dateFormat="yy-mm-dd" :showIcon="true" :showButtonBar="true" v-model="date_start"
                                class="m-2" placeholder="Pilih Tanggal Mulai" @change="onDateChange" />
                            <Calendar dateFormat="yy-mm-dd" :showIcon="true" :showButtonBar="true" v-model="date_end"
                                class="m-2" placeholder="Pilih Tanggal Selesai" @change="onDateChange" />

                            <Dropdown v-model="selectedWorkunit.id" :options="workunits"
                                v-if="['superuser', 'adminsistem','adminkepegawaian'].includes(role)" optionLabel="name"
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
                <DataTable :value="employees" :lazy="true" :paginator="true" :rows="10" v-model:filters="filters"
                    ref="dt" dataKey="id" :totalRecords="totalRecords" :loading="loading" @page="onPage($event)"
                    @sort="onSort($event)" @filter="onFilter($event)" :globalFilterFields="['name']"
                    :selectAll="selectAll" @select-all-change="onSelectAllChange" @row-select="onRowSelect"
                    @row-unselect="onRowUnselect"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5,10,25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    responsiveLayout="scroll">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Laporan</h5>
                            <export-excel v-if="employees.length" :data="employees" :fields="fields"
                                class="p-button p-button-success" worksheet="Laporan" name="Laporan Detail.xls">
                                Download Data
                            </export-excel>
                        </div>
                    </template>
                    <Column field="id" header="ID" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">ID</span>
                            {{slotProps.data.id}}
                        </template>
                    </Column>
                    <Column field="employee.name" header="Nama"></Column>
                    <Column field="employee.nip" header="NIP"></Column>
                    <Column field="workunit.name" header="OPD"></Column>
                    <Column field="worktime_item.name" header="Status"></Column>
                    <Column field="attachment_url" class="text-center" header="Lampiran">
                        <template #body="slotProps">
                            <span class="p-column-title">Lampiran</span>
                            <a v-if="slotProps.data.attachment_url"
                                :href="storage_url + slotProps.data.attachment_url">Download</a>
                            <span v-else>Tidak ada Lampiran</span>
                        </template>
                    </Column>

                    <Column class="text-center" header="Lokasi">
                        <template #body="slotProps">
                            <span class="p-column-title">Lokasi</span>
                            <Button label="Lihat" class="p-button-success m-2"
                                @click="showLocation(slotProps.data.lat,slotProps.data.lng)" />
                            <!-- <img :src="storage_url + slotProps.data.pic_url" width="150" /> -->
                        </template>
                    </Column>

                    <Column field="pic_url" class="text-center" header="Foto Selfi">
                        <template #body="slotProps">
                            <span class="p-column-title">Foto Selfi</span>
                            <Button label="Lihat" class="p-button-success m-2"
                                @click="showImage(storage_url + slotProps.data.pic_url)" />
                            <!-- <img :src="storage_url + slotProps.data.pic_url" width="150" /> -->
                        </template>
                    </Column>
                    <Column field="created_at" class="text-center" header="Tanggal"></Column>
                </DataTable>
            </div>
        </div>

        <Dialog v-model:visible="locationDialog" :style="{width: '800px'}" header="Lokasi" :modal="true"
            class="p-fluid">
            <div>
                <iframe width="700" height="500"
                    :src="'//maps.google.com/maps?q=' + lng + ',' + lat +'&z=15&output=embed'" allowfullscreen
                    style="border:0" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
            <template #footer>
                <Button label="Close" icon="pi pi-times" class="p-button-text" @click="locationDialog = false" />
            </template>
        </Dialog>

        <Dialog v-model:visible="imageDialog" :style="{ width: '800px'}" header="Foto Selfi" :modal="true"
            class="p-fluid">
            <div>
                <img :src="selectedImage" width="100%" alt="Foto Selfi">
            </div>
            <template #footer>
                <Button label="Close" icon="pi pi-times" class="p-button-text" @click="imageDialog = false" />
            </template>
        </Dialog>
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
            workunits:[],
            selectedWorkunit:{},
            storage_url:process.env.VUE_APP_STORAGE_URL,
            role:localStorage.getItem("presence_app_role"),
            userData :JSON.parse(localStorage.getItem('presence_user_data')),
            imageDialog:false,
            selectedImage:'',
            locationDialog:false,
            lat:null,
            lng:null,
            MAP_KEY:process.env.VUE_APP_MAP_KEY,
            fields:{
                'Nama':'employee.name',
                'NIP':{
                    field: 'employee.nip',
                    callback: (value) => {
                        return `'${value}`;
                    }
                },
                'OPD':'workunit.name',
                'Status':'worktime_item.name',
                'Tanggal':'created_at'
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
                    this.employeeService.getEmployeesReportDetail(this.lazyParams,this.selectedWorkunit.id)
                        .then(data => {
                            if ('redirectTo' in data) {
                                localStorage.removeItem('presence_app_token')
                                localStorage.removeItem('presence_app_role')
                                this.$router.push(data.redirectTo)
                            }
                            this.employees = data.data;
                            this.loading = false;
                        }
                        );
                }else if(this.userData.workunit_id){
                    this.employeeService.getEmployeesReportDetail(this.lazyParams, this.userData.workunit_id)
                        .then(data => {
                            if ('redirectTo' in data) {
                                localStorage.removeItem('presence_app_token')
                                localStorage.removeItem('presence_app_role')
                                this.$router.push(data.redirectTo)
                            }
                            this.employees = data.data;
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

        showImage(image){

            this.selectedImage = image
            this.imageDialog = true

        },  

        showLocation(lat,lng) {
            this.lat = lat
            this.lng = lng
            this.locationDialog = true

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