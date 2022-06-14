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

                <DataTable :value="presences" :lazy="true" :paginator="true" :rows="10" v-model:filters="filters" ref="dt" dataKey="id"
                    :totalRecords="totalRecords" :loading="loading" @page="onPage($event)" @sort="onSort($event)" @filter="onFilter($event)"
                    :globalFilterFields="['name']" v-model:selection="selectedCustomers" :selectAll="selectAll" @select-all-change="onSelectAllChange" @row-select="onRowSelect" @row-unselect="onRowUnselect"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
							currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" responsiveLayout="scroll">
                    <template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<h5 class="m-0">Manajemen Jadwal</h5>
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
                    <Column field="name" header="Nama"></Column>
                    <Column field="tolerance_time" header="Waktu Toleransi"></Column>
                    <Column header="Aksi">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editWorkunit(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDelete(slotProps.data)" />
						</template>
					</Column>
                </DataTable>

                <Dialog v-model:visible="presenceDialog" :style="{width: '450px'}" header="Edit Jadwal" :modal="true" class="p-fluid">
					<div class="field">
						<label for="name">Nama</label>
						<InputText id="name" v-model.trim="presence.name" required="true" autofocus :class="{'p-invalid': submitted && !presence.name}"  />
                        <small class="p-invalid" v-if="submitted && !presence.name">Nama diperlukan.</small>
					</div>
                    <div class="field">
						<label for="lat">Waktu Toleransi</label>
						<InputText id="lat" v-model.trim="presence.tolerance_time" required="true" autofocus :class="{'p-invalid': submitted && !presence.tolerance_time}" />
						<small class="p-invalid" v-if="submitted && !presence.tolerance_time">Waktu toleransi diperlukan.</small>
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="savePresence" />
					</template>
				</Dialog>
            </div>
        </div>
	</div>
</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import PresenceService from '../../service/PresenceService';

export default {
    data() {
        return {
            loading: false,
            onsearchtimeout: null,
            totalRecords: 0,
            presences: null,
            presence: {},
            selectedPresences: null,
            selectAll: false,
            filters: {},
            lazyParams: {},
            columns: [
                {field: 'id', header: 'ID'},
                {field: 'name', header: 'Nama'},
                {field: 'tolerance_time', header: 'Waktu Toleransi'}
            ],
            presenceDialog: false,
            submitted:false,
        }
    },
    presenceService: null,
    created() {
        this.presenceService = new PresenceService();
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
                this.presenceService.getPresences(this.lazyParams)
                        .then(data => {
                            if('redirectTo' in data)
                            {
                                localStorage.removeItem('presence_app_token')
                                this.$router.push(data.redirectTo)
                            }
                            this.presences = data.data;
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
                this.presenceService.getPresences().then(data => {
                    if('redirectTo' in data)
                            {
                                localStorage.removeItem('presence_app_token')
                                this.$router.push(data.redirectTo)
                            }
                    this.selectAll = true;
                    this.selectedPresences = data.data;
                });
            }
            else {
                this.selectAll = false;
                this.selectedPresences = [];
            }
        },
        onRowSelect() {
            this.selectAll = this.selectedPresences.length === this.totalRecords
        },
        onRowUnselect() {
            this.selectAll = false;
        },
        editPresence(presence) {
			this.presence = {...presence};
			this.presenceDialog = true;
		},
        hideDialog() {
			this.presenceDialog = false;
			this.submitted = false;
		},
        savePresence() {
			this.submitted = true;
            // this.employees[this.findIndexById(this.Presence.id)] = this.Presence;
            this.presenceService.updatePresence(this.presence)
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
                    this.presences[this.findIndexById(this.presence.id)] = this.presence;
                    this.$swal({
                        icon: 'success',
                        title: 'Success',
                        text: res.message
                    })
                    this.presenceDialog = false;
                    this.presence = {};
                }
            })
		},
        findIndexById(id) {
			let index = -1;
			for (let i = 0; i < this.presences.length; i++) {
				if (this.presences[i].id === id) {
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
    }
}
</script>