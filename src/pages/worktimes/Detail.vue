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

                <DataTable :value="worktimeItems" :lazy="true" :paginator="true" :rows="10" v-model:filters="filters" ref="dt" dataKey="id"
                    :totalRecords="totalRecords" :loading="loading" @page="onPage($event)" @sort="onSort($event)" @filter="onFilter($event)"
                    :globalFilterFields="['name']" v-model:selection="selectedCustomers" :selectAll="selectAll" @select-all-change="onSelectAllChange" @row-select="onRowSelect" @row-unselect="onRowUnselect"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
							currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" responsiveLayout="scroll">
                    <template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<h5 class="m-0">Detail Jam Kerja</h5>
							<span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." @keyup="onFilter" />
                            </span>
						</div>
					</template>
                    <Column field="id" header="ID" :sortable="true">
						<template #body="slotProps">
							<span class="p-column-title">ID</span>
							{{slotProps.data.id}}
						</template>
					</Column>
                    <Column field="worktime.name" header="Nama"></Column>
                    <Column field="time" header="Waktu"></Column>
                    <Column field="presence.tolerance_time" header="Waktu Toleransi"></Column>
                    <Column field="hari" header="Hari"></Column>
                    <Column field="presence.name" header="Jenis"></Column>
                    <Column header="Aksi">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editWorktimeItem(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDelete(slotProps.data)" />
						</template>
					</Column>
                </DataTable>

                <Dialog v-model:visible="worktimeItemDialog" :style="{width: '450px'}" header="Form Detail Jam Kerja" :modal="true" class="p-fluid">
					<div class="field">
						<label for="name">Jenis</label>
                        <Dropdown v-model="worktimeItem.presence_id" :options="presences" optionLabel="name" optionValue="id" placeholder="Pilih Jenis" :class="{'p-invalid': submitted && !worktimeItem.presence_id}"   />
                        <small class="p-invalid" v-if="submitted && !worktimeItem.presence_id">Jenis absensi diperlukan.</small>
					</div>
                    <div class="field">
						<label for="name">Waktu</label>
                        <Calendar v-model="worktimeItem.time" :showTime="true" :timeOnly="true" :class="{'p-invalid': submitted && !worktimeItem.time}"   />
                        <small class="p-invalid" v-if="submitted && !worktimeItem.time">Waktu diperlukan.</small>
					</div>
                    <div class="field">
						<label for="name">Hari</label>
						<Dropdown v-model="worktimeItem.day" :options="days" optionLabel="name" optionValue="value" placeholder="Pilih Hari" :class="{'p-invalid': submitted && !worktimeItem.day}"   />
                        <small class="p-invalid" v-if="submitted && !worktimeItem.day">Hari diperlukan.</small>
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveWorktimeItem" />
					</template>
				</Dialog>
            </div>
        </div>
	</div>
</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import WorktimeItemService from '../../service/WorktimeItemService';
import PresenceService from '../../service/PresenceService';

export default {
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
            days:[
                {name:'Senin',value:'1'},
                {name:'Selasa',value:'2'},
                {name:'Rabu',value:'3'},
                {name:'Kamis',value:'4'},
                {name:'Jumat',value:'5'},
                {name:'Sabtu',value:'6'},
                {name:'Minggu',value:'7'},
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
            var d = this.worktimeItem.time
            var hours = d.getHours() < 10 ? "0"+d.getHours() : d.getHours()
            var minute = d.getMinutes() < 10 ? "0"+d.getMinutes() : d.getMinutes()
            this.worktimeItem.time =  hours + ':' + minute
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
                        this.worktimeItems[this.findIndexById(this.worktimeItem.id)] = this.worktimeItem;
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
                        this.worktimeItems.push(this.worktimeItem)
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