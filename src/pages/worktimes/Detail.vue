<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                        </div>
                    </template>
                </Toolbar>

                <DataTable :value="worktimeItems" :lazy="true" :paginator="true" :rows="10" v-model:filters="filters"
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
                            <h5 class="m-0">Detail Jam Kerja</h5>
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
                    <Column field="name" header="Nama"></Column>
                    <Column field="start_time" header="Waktu Mulai"></Column>
                    <Column field="end_time" header="Waktu Selesai"></Column>
                    <Column field="on_time_start" header="On Time Waktu Mulai"></Column>
                    <Column field="on_time_end" header="On Time Waktu Selesai"></Column>
                    <Column field="days" header="Hari"></Column>
                    <Column field="penalty" header="Penalti (menit)"></Column>
                    <Column header="Aksi">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                                @click="editWorktimeItem(slotProps.data)" />
                            <Button v-if="slotProps.data.id" icon="pi pi-trash"
                                class="p-button-rounded p-button-warning mt-2" @click="confirmDelete(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="worktimeItemDialog" :style="{width: '450px'}" header="Form Detail Jam Kerja"
                    :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="name">Nama</label>
                        <InputText id="name" v-model.trim="worktimeItem.name" required="true" autofocus
                            :class="{'p-invalid': submitted && !worktimeItem.name}" />
                        <small class="p-invalid" v-if="submitted && !worktimeItem.name">Nama diperlukan.</small>
                    </div>
                    <div class="field">
                        <label for="name">Waktu Mulai</label>
                        <div class="w-full">
                            <input type="time" v-model="worktimeItem.start_time" id=""
                                class="p-inputtext p-component p-filled"
                                :class="{ 'p-invalid': submitted && !worktimeItem.start_time }">
                        </div>
                        <small class="p-invalid" v-if="submitted && !worktimeItem.start_time">Waktu Mulai
                            diperlukan.</small>
                    </div>
                    <div class="field">
                        <label for="name">Waktu Selesai</label>
                        <div class="w-full">
                            <input type="time" v-model="worktimeItem.end_time" id=""
                                class="p-inputtext p-component p-filled"
                                :class="{ 'p-invalid': submitted && !worktimeItem.end_time }">
                        </div>
                        <small class="p-invalid" v-if="submitted && !worktimeItem.end_time">Waktu Selesai
                            diperlukan.</small>
                    </div>
                    <div class="field">
                        <label for="name">On Time Waktu Mulai</label>
                        <div class="w-full">
                            <input type="time" v-model="worktimeItem.on_time_start" id=""
                                class="p-inputtext p-component p-filled"
                                :class="{ 'p-invalid': submitted && !worktimeItem.on_time_start }">
                        </div>
                        <small class="p-invalid" v-if="submitted && !worktimeItem.on_time_start">On Time Waktu Mulai
                            diperlukan.</small>
                    </div>
                    <div class="field">
                        <label for="name">On Time Waktu Selesai</label>
                        <div class="w-full">
                            <input type="time" v-model="worktimeItem.on_time_end" id=""
                                class="p-inputtext p-component p-filled"
                                :class="{ 'p-invalid': submitted && !worktimeItem.on_time_end }">
                        </div>
                        <small class="p-invalid" v-if="submitted && !worktimeItem.on_time_end">On Time Waktu Selesai
                            diperlukan.</small>
                    </div>
                    <div class="field">
                        <label for="name">Hari</label>
                        <div class="w-full">
                            <Multiselect v-model="selectedDays" :options="days" mode="tags" />
                        </div>
                    </div>
                    <div class="field">
                        <label for="name">Penalti (Menit)</label>
                        <InputText id="name" v-model.trim="worktimeItem.penalty" required="true" autofocus
                            :class="{'p-invalid': submitted && !worktimeItem.penalty}" />
                        <small class="p-invalid" v-if="submitted && !worktimeItem.penalty">Penalti diperlukan.</small>
                    </div>
                    <div>

                    </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveWorktimeItem" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style src="@vueform/multiselect/themes/default.css">
</style>

<script>
import {FilterMatchMode} from 'primevue/api';
import WorktimeItemService from '../../service/WorktimeItemService';
import PresenceService from '../../service/PresenceService';
import Multiselect from '@vueform/multiselect'

export default {
    components: {
        Multiselect
    },
    data() {
        return {
            worktimeId:null,
            loading: false,
            presences:null,
            onsearchtimeout: null,
            totalRecords: 0,
            worktimeItems: null,
            worktimeItem: {},
            selectedWorktimeItems: null,
            selectAll: false,
            filters: {},
            lazyParams: {},
            columns: [
                {field: 'id', header: 'ID'},
                {field: 'name', header: 'Nama'}
            ],
            selectedDays: [],
            days: [
                'Senin',
                'Selasa',
                'Rabu',
                'Kamis',
                'Jumat',
                'Sabtu',
                'Minggu',
            ],
            worktimeItemDialog: false,
            submitted:false,
        }
    },
    worktimeItemService: null,
    presenceService: null,
    created() {
        this.worktimeId = this.$route.params.id
        this.worktimeItemService = new WorktimeItemService();
        this.presenceService = new PresenceService();
        this.presenceService.getAllPresences().then(d => {
            this.presences = d
        })
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
        openNew() {
			this.worktimeItem = {};
			this.submitted = false;
			this.worktimeItemDialog = true;
		},
        loadLazyData() {
            this.loading = true;

            setTimeout(() => {
                this.worktimeItemService.getWorktimeItems(this.lazyParams, this.worktimeId)
                        .then(data => {
                            if('redirectTo' in data)
                            {
                                localStorage.removeItem('presence_app_token')
                                localStorage.removeItem('presence_app_role')
                                this.$router.push(data.redirectTo)
                            }
                            this.worktimeItems = data.data;
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
                this.worktimeItemService.getWorktimeItems(this.worktimeId).then(data => {
                    if('redirectTo' in data)
                            {
                                localStorage.removeItem('presence_app_token')
                        localStorage.removeItem('presence_app_role')
                                this.$router.push(data.redirectTo)
                            }
                    this.selectAll = true;
                    this.selectedWorktimeItems = data.data;
                });
            }
            else {
                this.selectAll = false;
                this.selectedWorktimeItems = [];
            }
        },
        onRowSelect() {
            this.selectAll = this.selectedWorktimeItems.length === this.totalRecords
        },
        onRowUnselect() {
            this.selectAll = false;
        },
        editWorktimeItem(worktimeItem) {
			this.worktimeItem = {...worktimeItem};
            if(worktimeItem.days){
                this.selectedDays = worktimeItem.days.split(',')
            }else{
                this.selectedDays = []
            }
			this.worktimeItemDialog = true;
		},
        confirmDelete(worktimeItem) {
			this.worktimeItem = worktimeItem;
			this.$swal({
                title: 'Apakah anda yakin akan menghapus data ini ?',
                showCancelButton: true,
                confirmButtonText: 'Hapus',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.worktimeItemService.deleteWorktimeItem(this.worktimeItem, this.worktimeId)
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
                            this.worktimeItems = this.worktimeItems.filter(val => val.id !== this.worktimeItem.id);
                            this.$swal({
                                icon: 'success',
                                title: 'Success',
                                text: res.message
                            })
                            this.worktimeItemDialog = false;
                            this.worktimeItem = {};
                        }
                    })
                }
            })
		},
        hideDialog() {
			this.worktimeItemDialog = false;
			this.submitted = false;
		},
        saveWorktimeItem() {
			this.submitted = true;
            if(this.selectedDays){
                this.worktimeItem.days = this.selectedDays.join()
            }
            if(this.worktimeItem.id)
            {
                this.worktimeItemService.updateWorktimeItem(this.worktimeItem, this.worktimeId)
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
                        // this.worktimeItems[this.findIndexById(this.worktimeItem.id)] = this.worktimeItem;
                        this.loadLazyData()
                        this.$swal({
                            icon: 'success',
                            title: 'Success',
                            text: res.message
                        })
                        this.worktimeItemDialog = false;
                        this.worktimeItem = {};
                    }
                })
            }
            else
            {
                this.worktimeItemService.createWorktimeItem(this.worktimeItem, this.worktimeId)
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
                        this.worktimeItemDialog = false;
                        this.worktimeItem = {};
                        this.$swal({
                            icon: 'success',
                            title: 'Success',
                            text: res.message
                        })
                    }
                })
            }
		},
        findIndexById(id) {
			let index = -1;
			for (let i = 0; i < this.worktimeItems.length; i++) {
				if (this.worktimeItems[i].id === id) {
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