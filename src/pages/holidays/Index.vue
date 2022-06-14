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

                <DataTable :value="holidays" :lazy="true" :paginator="true" :rows="10" v-model:filters="filters" ref="dt" dataKey="id"
                    :totalRecords="totalRecords" :loading="loading" @page="onPage($event)" @sort="onSort($event)" @filter="onFilter($event)"
                    :globalFilterFields="['name']" v-model:selection="selectedCustomers" :selectAll="selectAll" @select-all-change="onSelectAllChange" @row-select="onRowSelect" @row-unselect="onRowUnselect"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
							currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" responsiveLayout="scroll">
                    <template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<h5 class="m-0">Manajemen Hari Libur</h5>
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
                    <Column field="date" header="Tanggal"></Column>
                    <Column header="Aksi">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editHoliday(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDelete(slotProps.data)" />
						</template>
					</Column>
                </DataTable>

                <Dialog v-model:visible="holidayDialog" :style="{width: '450px'}" header="Form Hari Libur" :modal="true" class="p-fluid">
					<div class="field">
						<label for="name">Nama</label>
						<InputText id="name" v-model.trim="holiday.name" required="true" autofocus :class="{'p-invalid': submitted && !holiday.name}"  />
                        <small class="p-invalid" v-if="submitted && !holiday.name">Nama diperlukan.</small>
					</div>
                    <div class="field">
						<label for="date">Tanggal</label>
						<Calendar id="date" dateFormat="yy-mm-dd" :showIcon="true" :showButtonBar="true" v-model="holiday.date" required="true" autofocus :class="{'p-invalid': submitted && !holiday.date}" />
						<small class="p-invalid" v-if="submitted && !holiday.date">Tanggal diperlukan.</small>
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveHoliday" />
					</template>
				</Dialog>
            </div>
        </div>
	</div>
</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import HolidayService from '../../service/HolidayService';

export default {
    data() {
        return {
            loading: false,
            onsearchtimeout: null,
            totalRecords: 0,
            holidays: null,
            holiday: {},
            selectedHolidays: null,
            selectAll: false,
            filters: {},
            lazyParams: {},
            columns: [
                {field: 'id', header: 'ID'},
                {field: 'name', header: 'Nama'},
                {field: 'date', header: 'Tanggal'}
            ],
            holidayDialog: false,
            submitted:false,
        }
    },
    holidayService: null,
    created() {
        this.holidayService = new HolidayService();
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
			this.holiday = {};
			this.submitted = false;
			this.holidayDialog = true;
		},
        loadLazyData() {
            this.loading = true;

            setTimeout(() => {
                this.holidayService.getHolidays(this.lazyParams)
                        .then(data => {
                            if('redirectTo' in data)
                            {
                                localStorage.removeItem('presence_app_token')
                                this.$router.push(data.redirectTo)
                            }
                            this.holidays = data.data;
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
                this.holidayService.getHolidays().then(data => {
                    if('redirectTo' in data)
                            {
                                localStorage.removeItem('presence_app_token')
                                this.$router.push(data.redirectTo)
                            }
                    this.selectAll = true;
                    this.selectedHolidays = data.data;
                });
            }
            else {
                this.selectAll = false;
                this.selectedHolidays = [];
            }
        },
        onRowSelect() {
            this.selectAll = this.selectedHolidays.length === this.totalRecords
        },
        onRowUnselect() {
            this.selectAll = false;
        },
        editHoliday(holiday) {
			this.holiday = {...holiday};
			this.holidayDialog = true;
		},
        confirmDelete(holiday) {
			this.holiday = holiday;
			this.$swal({
                title: 'Apakah anda yakin akan menghapus data ini ?',
                showCancelButton: true,
                confirmButtonText: 'Hapus',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.holidayService.deleteHoliday(this.holiday)
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
                            this.holidays = this.holidays.filter(val => val.id !== this.holiday.id);
                            this.$swal({
                                icon: 'success',
                                title: 'Success',
                                text: res.message
                            })
                            this.holidayDialog = false;
                            this.holiday = {};
                        }
                    })
                }
            })
		},
        hideDialog() {
			this.holidayDialog = false;
			this.submitted = false;
		},
        saveHoliday() {
			this.submitted = true;
            // this.employees[this.findIndexById(this.Holiday.id)] = this.Holiday;
            var d = this.holiday.date
            var day = d.getDate() < 10 ? "0"+d.getDate() : d.getDate()
            var month = (d.getMonth()+1) < 10 ? "0"+(d.getMonth()+1) : (d.getMonth()+1)
            this.holiday.date =  d.getFullYear() + "-" + month + "-" + day
            if(this.holiday.id)
            {
                this.holidayService.updateHoliday(this.holiday)
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
                        this.holidays[this.findIndexById(this.holiday.id)] = this.holiday;
                        this.$swal({
                            icon: 'success',
                            title: 'Success',
                            text: res.message
                        })
                        this.holidayDialog = false;
                        this.holiday = {};
                    }
                })
            }
            else
            {
                this.holidayService.createHoliday(this.holiday)
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
                        this.holidays.push(this.holiday)
                        this.holidayDialog = false;
                        this.holiday = {};
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
			for (let i = 0; i < this.holidays.length; i++) {
				if (this.holidays[i].id === id) {
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