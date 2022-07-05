<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <DataTable :value="workunits" :lazy="true" :paginator="true" :rows="10" v-model:filters="filters"
                    ref="dt" dataKey="id" :totalRecords="totalRecords" :loading="loading" @page="onPage($event)"
                    @sort="onSort($event)" @filter="onFilter($event)" :globalFilterFields="['name']"
                    responsiveLayout="scroll" v-model:selection="selectedCustomers" :selectAll="selectAll"
                    @select-all-change="onSelectAllChange" @row-select="onRowSelect" @row-unselect="onRowUnselect">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manajemen OPD / Unit Kerja</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..."
                                    @keyup="onFilter" />
                            </span>
                        </div>
                    </template>
                    <Column field="id" header="ID" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">ID</span>
                            {{slotProps.data.id}}
                        </template>
                    </Column>
                    <Column field="name" header="Nama" filterMatchMode="startsWith" ref="name" :sortable="true"
                        headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nama</span>
                            <router-link :to='{"name":"workunits.detail","params":{"id":slotProps.data.id}}'>
                                {{slotProps.data.name}}</router-link>
                        </template>
                    </Column>
                    <Column field="lat" header="Latitute" ref="lat"></Column>
                    <Column field="lng" header="Longitude" ref="lng"></Column>
                    <Column field="radius" header="Radius" ref="radius"></Column>
                    <Column header="Aksi">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                                @click="editWorkunit(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="workunitDialog" :style="{width: '450px'}" header="Detail OPD" :modal="true"
                    class="p-fluid">
                    <div class="field">
                        <label for="name">Nama</label>
                        <InputText id="name" v-model.trim="workunit.name" required="true" autofocus disabled />
                    </div>
                    <div class="field">
                        <label for="lat">Latitute</label>
                        <InputText id="lat" v-model.trim="workunit.lat" required="true" autofocus
                            :class="{'p-invalid': submitted && !workunit.lat}" />
                        <small class="p-invalid" v-if="submitted && !workunit.lat">Latitute diperlukan.</small>
                    </div>
                    <div class="field">
                        <label for="lng">Longitude</label>
                        <InputText id="lng" v-model.trim="workunit.lng" required="true" autofocus
                            :class="{'p-invalid': submitted && !workunit.lng}" />
                        <small class="p-invalid" v-if="submitted && !workunit.lng">Longitude diperlukan.</small>
                    </div>
                    <div class="field">
                        <label for="lng">Radius</label>
                        <InputText id="lng" v-model.trim="workunit.radius" required="true" autofocus
                            :class="{'p-invalid': submitted && !workunit.radius}" />
                        <small class="p-invalid" v-if="submitted && !workunit.radius">Radius diperlukan.</small>
                    </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveWorkunit" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import WorkunitService from '../../service/WorkunitService';

export default {
    data() {
        return {
            API_URL : process.env.VUE_APP_API_URL,
            loading: false,
            totalRecords: 0,
            workunits: null,
            workunit: {},
            selectedWorkunits: null,
            selectAll: false,
            filters: {},
            lazyParams: {},
            columns: [
                {field: 'id', header: 'ID'},
                {field: 'name', header: 'Nama'},
                {field: 'lat', header: 'Latitute'},
                {field: 'lng', header: 'Longitude'},
                {field: 'radius', header: 'Radius'}
            ],
            workunitDialog: false,
            submitted:false,
        }
    },
    workunitService: null,
    created() {
        this.workunitService = new WorkunitService();
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
                            if('redirectTo' in data)
                            {
                                localStorage.removeItem('presence_app_token')
                                localStorage.removeItem('presence_app_role')
                                this.$router.push(data.redirectTo)
                            }
                            this.workunits = data.data;
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
        onSelectAllChange(event) {
            const selectAll = event.checked;

            if (selectAll) {
                this.workunitService.getWorkunits().then(data => {
                    if('redirectTo' in data)
                            {
                                localStorage.removeItem('presence_app_token')
                        localStorage.removeItem('presence_app_role')
                                this.$router.push(data.redirectTo)
                            }
                    this.selectAll = true;
                    this.selectedWorkunits = data.data;
                });
            }
            else {
                this.selectAll = false;
                this.selectedWorkunits = [];
            }
        },
        onRowSelect() {
            this.selectAll = this.selectedWorkunits.length === this.totalRecords
        },
        onRowUnselect() {
            this.selectAll = false;
        },
        editWorkunit(workunit) {
			this.workunit = {...workunit};
			this.workunitDialog = true;
		},
        hideDialog() {
			this.workunitDialog = false;
			this.submitted = false;
		},
        saveWorkunit() {
			this.submitted = true;
            // this.workunits[this.findIndexById(this.workunit.id)] = this.workunit;
            this.workunitService.updateWorkunit(this.workunit)
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
                    this.workunits[this.findIndexById(this.workunit.id)] = this.workunit;
                    this.$swal({
                        icon: 'success',
                        title: 'Success',
                        text: res.message
                    })
                    this.workunitDialog = false;
                    this.workunit = {};
                }
            })
		},
        findIndexById(id) {
			let index = -1;
			for (let i = 0; i < this.workunits.length; i++) {
				if (this.workunits[i].id === id) {
					index = i;
					break;
				}
			}
			return index;
		},
		initFilters() {
            this.filters = {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
            }
        }
    }
}
</script>