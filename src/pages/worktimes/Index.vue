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

                <DataTable :value="worktimes" :lazy="true" :paginator="true" :rows="10" ref="dt" dataKey="id" v-model:filters="filters"
                    :totalRecords="totalRecords" :loading="loading" @page="onPage($event)" @sort="onSort($event)" @filter="onFilter($event)"
                    :globalFilterFields="['name']" v-model:selection="selectedCustomers" :selectAll="selectAll" @select-all-change="onSelectAllChange" @row-select="onRowSelect" @row-unselect="onRowUnselect"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
							currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" responsiveLayout="scroll">
                    <template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<h5 class="m-0">Manajemen Jam Kerja</h5>
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
                    <Column field="name" header="Nama">
                        <template #body="slotProps">
							<span class="p-column-title">Nama</span>
							<router-link :to="{name:'worktimes.detail',params:{id:slotProps.data.id}}">{{slotProps.data.name}}</router-link>
						</template>
                    </Column>
                    <Column header="Aksi">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editWorktime(slotProps.data)" />
                            <Button v-if="slotProps.data.id" icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDelete(slotProps.data)" />
						</template>
					</Column>
                </DataTable>

                <Dialog v-model:visible="worktimeDialog" :style="{width: '450px'}" header="Form Hari Libur" :modal="true" class="p-fluid">
					<div class="field">
						<label for="name">Nama</label>
						<InputText id="name" v-model.trim="worktime.name" required="true" autofocus :class="{'p-invalid': submitted && !worktime.name}"  />
                        <small class="p-invalid" v-if="submitted && !worktime.name">Nama diperlukan.</small>
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveWorktime" />
					</template>
				</Dialog>
            </div>
        </div>
	</div>
</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import WorktimeService from '../../service/WorktimeService';

export default {
    data() {
        return {
            loading: false,
            onsearchtimeout: null,
            totalRecords: 0,
            worktimes: null,
            worktime: {},
            selectedWorktimes: null,
            selectAll: false,
            filters: {},
            lazyParams: {},
            columns: [
                {field: 'id', header: 'ID'},
                {field: 'name', header: 'Nama'}
            ],
            worktimeDialog: false,
            submitted:false,
        }
    },
    worktimeService: null,
    created() {
        this.worktimeService = new WorktimeService();
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
			this.worktime = {};
			this.submitted = false;
			this.worktimeDialog = true;
		},
        loadLazyData() {
            this.loading = true;

            setTimeout(() => {
                this.worktimeService.getWorktimes(this.lazyParams)
                        .then(data => {
                            if('redirectTo' in data)
                            {
                                localStorage.removeItem('presence_app_token')
                                this.$router.push(data.redirectTo)
                            }
                            this.worktimes = data.data;
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
                this.worktimeService.getWorktimes().then(data => {
                    if('redirectTo' in data)
                            {
                                localStorage.removeItem('presence_app_token')
                                this.$router.push(data.redirectTo)
                            }
                    this.selectAll = true;
                    this.selectedWorktimes = data.data;
                });
            }
            else {
                this.selectAll = false;
                this.selectedWorktimes = [];
            }
        },
        onRowSelect() {
            this.selectAll = this.selectedWorktimes.length === this.totalRecords
        },
        onRowUnselect() {
            this.selectAll = false;
        },
        editWorktime(worktime) {
			this.worktime = {...worktime};
			this.worktimeDialog = true;
		},
        confirmDelete(worktime) {
			this.worktime = worktime;
			this.$swal({
                title: 'Apakah anda yakin akan menghapus data ini ?',
                showCancelButton: true,
                confirmButtonText: 'Hapus',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.worktimeService.deleteWorktime(this.worktime)
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
                            this.worktimes = this.worktimes.filter(val => val.id !== this.worktime.id);
                            this.$swal({
                                icon: 'success',
                                title: 'Success',
                                text: res.message
                            })
                            this.worktimeDialog = false;
                            this.worktime = {};
                        }
                    })
                }
            })
		},
        hideDialog() {
			this.worktimeDialog = false;
			this.submitted = false;
		},
        saveWorktime() {
			this.submitted = true;
            if(this.worktime.id)
            {
                this.worktimeService.updateWorktime(this.worktime)
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
                        this.worktimes[this.findIndexById(this.worktime.id)] = this.worktime;
                        this.$swal({
                            icon: 'success',
                            title: 'Success',
                            text: res.message
                        })
                        this.worktimeDialog = false;
                        this.worktime = {};
                    }
                })
            }
            else
            {
                this.worktimeService.createWorktime(this.worktime)
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
                        this.worktimes.push(this.worktime)
                        this.worktimeDialog = false;
                        this.worktime = {};
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
			for (let i = 0; i < this.worktimes.length; i++) {
				if (this.worktimes[i].id === id) {
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