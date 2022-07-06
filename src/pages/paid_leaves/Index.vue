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

                <DataTable :value="paidLeaves" :lazy="true" :paginator="true" :rows="10" v-model:filters="filters" ref="dt" dataKey="id"
                    :totalRecords="totalRecords" :loading="loading" @page="onPage($event)" @sort="onSort($event)" @filter="onFilter($event)"
                    :globalFilterFields="['name']" v-model:selection="selectedCustomers" :selectAll="selectAll" @select-all-change="onSelectAllChange" @row-select="onRowSelect" @row-unselect="onRowUnselect"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
							currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" responsiveLayout="scroll">
                    <template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<h5 class="m-0">Manajemen Cuti</h5>
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
                    <Column header="Aksi">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editPaidLeave(slotProps.data)" />
                            <Button v-if="slotProps.data.id" icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDelete(slotProps.data)" />
						</template>
					</Column>
                </DataTable>

                <Dialog v-model:visible="paidLeaveDialog" :style="{width: '450px'}" header="Form Cuti" :modal="true" class="p-fluid">
					<div class="field">
						<label for="name">Nama</label>
						<InputText id="name" v-model.trim="paidLeave.name" required="true" autofocus :class="{'p-invalid': submitted && !paidLeave.name}"  />
                        <small class="p-invalid" v-if="submitted && !paidLeave.name">Nama diperlukan.</small>
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="savePaidLeave" />
					</template>
				</Dialog>
            </div>
        </div>
	</div>
</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import PaidLeaveService from '../../service/PaidLeaveService';

export default {
    data() {
        return {
            loading: false,
            onsearchtimeout: null,
            totalRecords: 0,
            paidLeaves: null,
            paidLeave: {},
            selectedPaidLeaves: null,
            selectAll: false,
            filters: {},
            lazyParams: {},
            columns: [
                {field: 'id', header: 'ID'},
                {field: 'name', header: 'Nama'},
                {field: 'date', header: 'Tanggal'}
            ],
            paidLeaveDialog: false,
            submitted:false,
        }
    },
    PaidLeaveService: null,
    created() {
        this.PaidLeaveService = new PaidLeaveService();
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
			this.paidLeave = {};
			this.submitted = false;
			this.paidLeaveDialog = true;
		},
        loadLazyData() {
            this.loading = true;

            setTimeout(() => {
                this.PaidLeaveService.getPaidLeaves(this.lazyParams)
                        .then(data => {
                            if('redirectTo' in data)
                            {
                                localStorage.removeItem('presence_app_token')
                                localStorage.removeItem('presence_app_role')
                                this.$router.push(data.redirectTo)
                            }
                            this.paidLeaves = data.data;
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
                this.PaidLeaveService.getPaidLeaves().then(data => {
                    if('redirectTo' in data)
                            {
                                localStorage.removeItem('presence_app_token')
                        localStorage.removeItem('presence_app_role')
                                this.$router.push(data.redirectTo)
                            }
                    this.selectAll = true;
                    this.selectedPaidLeaves = data.data;
                });
            }
            else {
                this.selectAll = false;
                this.selectedPaidLeaves = [];
            }
        },
        onRowSelect() {
            this.selectAll = this.selectedPaidLeaves.length === this.totalRecords
        },
        onRowUnselect() {
            this.selectAll = false;
        },
        editPaidLeave(paidLeave) {
			this.paidLeave = paidLeave;
			this.paidLeaveDialog = true;
		},
        confirmDelete(paidLeave) {
			this.paidLeave = paidLeave;
			this.$swal({
                title: 'Apakah anda yakin akan menghapus data ini ?',
                showCancelButton: true,
                confirmButtonText: 'Hapus',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.PaidLeaveService.deletePaidLeave(this.paidLeave)
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
                            this.paidLeaves = this.paidLeaves.filter(val => val.id !== this.paidLeave.id);
                            this.$swal({
                                icon: 'success',
                                title: 'Success',
                                text: res.message
                            })
                            this.paidLeaveDialog = false;
                            this.paidLeave = {};
                        }
                    })
                }
            })
		},
        hideDialog() {
			this.paidLeaveDialog = false;
			this.submitted = false;
		},
        savePaidLeave() {
			this.submitted = true;
            if(this.paidLeave.id)
            {
                this.PaidLeaveService.updatePaidLeave(this.paidLeave)
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
                        this.paidLeaves[this.findIndexById(this.paidLeave.id)] = this.paidLeave;
                        this.$swal({
                            icon: 'success',
                            title: 'Success',
                            text: res.message
                        })
                        this.paidLeaveDialog = false;
                        this.paidLeave = {};
                    }
                })
            }
            else
            {
                this.PaidLeaveService.createPaidLeave(this.paidLeave)
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
                        this.paidLeaves.push(this.paidLeave)
                        this.paidLeaveDialog = false;
                        this.paidLeave = {};
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
			for (let i = 0; i < this.paidLeaves.length; i++) {
				if (this.paidLeaves[i].id === id) {
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