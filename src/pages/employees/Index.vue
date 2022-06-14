<template>
	<div class="grid">
		<div class="col-12">
			<div class="card">
                <DataTable :value="employees" :lazy="true" :paginator="true" :rows="10" v-model:filters="filters" ref="dt" dataKey="id"
                    :totalRecords="totalRecords" :loading="loading" @page="onPage($event)" @sort="onSort($event)" @filter="onFilter($event)"
                    :globalFilterFields="['name']" v-model:selection="selectedCustomers" :selectAll="selectAll" @select-all-change="onSelectAllChange" @row-select="onRowSelect" @row-unselect="onRowUnselect"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
							currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" responsiveLayout="scroll">
                    <template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<h5 class="m-0">Manajemen Pegawai</h5>
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
                    <Column field="nip" header="NIP"></Column>
                    <Column field="employee.name" header="OPD / Unit Kerja" headerStyle="width:20%; min-width:10rem;"></Column>
                    <Column field="name" header="Nama" filterMatchMode="startsWith" ref="name" :sortable="true" headerStyle="width:20%; min-width:10rem;"></Column>
                    <Column field="position" header="Jabatan" ref="position"></Column>
                    <Column field="phone" header="Telepon" ref="phone"></Column>
                    <Column header="Aksi">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editEmployee(slotProps.data)" />
						</template>
					</Column>
                </DataTable>

                <Dialog v-model:visible="employeeDialog" :style="{width: '450px'}" header="Detail OPD" :modal="true" class="p-fluid">
					<div class="field">
						<label for="name">Nama</label>
						<InputText id="name" v-model.trim="employee.name" required="true" autofocus disabled />
					</div>
                    <div class="field">
						<label for="lat">Latitute</label>
						<InputText id="lat" v-model.trim="employee.lat" required="true" autofocus :class="{'p-invalid': submitted && !employee.lat}" />
						<small class="p-invalid" v-if="submitted && !employee.lat">Latitute diperlukan.</small>
					</div>
                    <div class="field">
						<label for="lng">Longitude</label>
						<InputText id="lng" v-model.trim="employee.lng" required="true" autofocus :class="{'p-invalid': submitted && !employee.lng}" />
						<small class="p-invalid" v-if="submitted && !employee.lng">Longitude diperlukan.</small>
					</div>
                    <div class="field">
						<label for="lng">Radius</label>
						<InputText id="lng" v-model.trim="employee.radius" required="true" autofocus :class="{'p-invalid': submitted && !employee.radius}" />
						<small class="p-invalid" v-if="submitted && !employee.radius">Radius diperlukan.</small>
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveEmployee" />
					</template>
				</Dialog>
            </div>
        </div>
	</div>
</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import EmployeeService from '../../service/EmployeeService';

export default {
    data() {
        return {
            API_URL : process.env.VUE_APP_API_URL,
            loading: false,
            onsearchtimeout: null,
            totalRecords: 0,
            employees: null,
            employee: {},
            selectedEmployees: null,
            selectAll: false,
            filters: {},
            lazyParams: {},
            columns: [
                {field: 'id', header: 'ID'},
                {field: 'nip', header: 'NIP'},
                {field: 'employee.name', header: 'OPD / Unit Kerja'},
                {field: 'name', header: 'Nama'},
                {field: 'position', header: 'Jabatan'},
                {field: 'phone', header: 'Telepon'}
            ],
            employeeDialog: false,
            submitted:false,
        }
    },
    employeeService: null,
    created() {
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
            filters: this.filters
        };

        this.loadLazyData();
    },
    methods: {
        loadLazyData() {
            this.loading = true;

            setTimeout(() => {
                this.employeeService.getEmployees(this.lazyParams)
                        .then(data => {
                            if('redirectTo' in data)
                            {
                                localStorage.removeItem('presence_app_token')
                                this.$router.push(data.redirectTo)
                            }
                            this.employees = data.data;
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
                this.employeeService.getEmployees().then(data => {
                    if('redirectTo' in data)
                    {
                        localStorage.removeItem('presence_app_token')
                        this.$router.push(data.redirectTo)
                    }
                    this.selectAll = true;
                    this.selectedEmployees = data.data;
                });
            }
            else {
                this.selectAll = false;
                this.selectedEmployees = [];
            }
        },
        onRowSelect() {
            this.selectAll = this.selectedEmployees.length === this.totalRecords
        },
        onRowUnselect() {
            this.selectAll = false;
        },
        editEmployee(employee) {
			this.employee = {...employee};
			this.employeeDialog = true;
		},
        hideDialog() {
			this.employeeDialog = false;
			this.submitted = false;
		},
        saveEmployee() {
			this.submitted = true;
            // this.employees[this.findIndexById(this.employee.id)] = this.employee;
            this.employeeService.updateEmployee(this.employee)
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
                    this.employees[this.findIndexById(this.employee.id)] = this.employee;
                    this.$swal({
                        icon: 'success',
                        title: 'Success',
                        text: res.message
                    })
                    this.employeeDialog = false;
                    this.employee = {};
                }
            })
		},
        findIndexById(id) {
			let index = -1;
			for (let i = 0; i < this.employees.length; i++) {
				if (this.employees[i].id === id) {
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