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

				<DataTable :value="users" :lazy="true" :paginator="true" :rows="10" v-model:filters="filters" ref="dt"
					dataKey="id" :totalRecords="totalRecords" :loading="loading" @page="onPage($event)"
					@sort="onSort($event)" @filter="onFilter($event)" :globalFilterFields="['name']"
					v-model:selection="selectedUsers" :selectAll="selectAll" @select-all-change="onSelectAllChange"
					@row-select="onRowSelect" @row-unselect="onRowUnselect"
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					:rowsPerPageOptions="[5,10,25]"
					currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
					responsiveLayout="scroll">
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<h5 class="m-0">Manajemen Pengguna</h5>
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
					<Column field="email" header="Email"></Column>
					<Column field="name" header="Nama" filterMatchMode="startsWith" ref="name" :sortable="true"
						headerStyle="width:20%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Nama</span>
							<router-link :to='{"name":"users.detail","params":{"id":slotProps.data.id}}'>
								{{slotProps.data.name}}</router-link>
						</template>
					</Column>
					<Column field="role" header="Jabatan"></Column>
					<Column header="Aksi">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
								@click="editUser(slotProps.data)" v-if="slotProps.data.role != 'pegawai'" />
							<Button v-if="slotProps.data.role != 'pegawai'" icon="pi pi-trash"
								class="p-button-rounded p-button-warning mt-2" @click="confirmDelete(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="userDialog" :style="{width: '450px'}" header="Form Pengguna" :modal="true"
					class="p-fluid">
					<div class="field">
						<label for="name">Nama</label>
						<InputText id="name" v-model.trim="user.name" required="true" autofocus
							:class="{'p-invalid': submitted && !user.name}" />
						<small class="p-invalid" v-if="submitted && !user.name">Nama diperlukan.</small>
					</div>
					<div class="field">
						<label for="email">Email</label>
						<InputText id="email" v-model.trim="user.email" required="true" autofocus
							:class="{'p-invalid': submitted && !user.email}" />
						<small class="p-invalid" v-if="submitted && !user.email">Email diperlukan.</small>
					</div>
					<div class="field">
						<label for="password">Password</label>
						<InputText id="password" v-model.trim="user.password" autofocus />
					</div>
					<div class="field">
						<label>Jabatan</label>
						<Dropdown v-model="user.role" :options="roleLists" optionLabel="name" optionValue="value"
							placeholder="Pilih Jabatan" :class="{'p-invalid': submitted && !user.role}" />
						<small class="p-invalid" v-if="submitted && !user.role">Jabatan diperlukan.</small>
					</div>
					<div class="field">
						<label>OPD</label>
						<Dropdown v-model="user.workunit_id" :options="workunits" optionLabel="name"
							optionValue="id" required="true" placeholder="Pilih OPD"
							:class="{'p-invalid': submitted && !user.workunit_id}" />
						<small class="p-invalid" v-if="submitted && !user.workunit_id">OPD diperlukan.</small>
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveUser" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>
</template>

<script>
import { FilterMatchMode } from 'primevue/api';
import UserService from '../../service/UserService';
import WorkunitService from '../../service/WorkunitService';

export default {
	data() {
		return {
			API_URL: process.env.VUE_APP_API_URL,
			loading: false,
			onsearchtimeout: null,
			totalRecords: 0,
			users: null,
			workunits: null,
			user: {},
			selectedUsers: null,
			selectAll: false,
			filters: {},
			lazyParams: {},
			userDialog: false,
			submitted: false,
			roleLists: [
				{ name: "Pegawai", value: "pegawai" },
				{ name: "Kasubag Umum", value: "kasubagumum" },
				{ name: "Admin BKD", value: "adminkepegawaian" },
				{ name: "Admin OPD", value: "adminopd" }
			]
		}
	},
	UserService: null,
	WorkunitService: null,
	created() {
		this.UserService = new UserService();
		this.WorkunitService = new WorkunitService();
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
				this.UserService.getUsers(this.lazyParams)
					.then(data => {
						if ('redirectTo' in data) {
							localStorage.removeItem('presence_app_token')
							localStorage.removeItem('presence_app_role')
							this.$router.push(data.redirectTo)
						}
						this.users = data.data;
						this.totalRecords = data.total;
						this.loading = false;
					}
					);

				this.WorkunitService.getWorkunits()
					.then(data => {
						if ('redirectTo' in data) {
							localStorage.removeItem('presence_app_token')
							localStorage.removeItem('presence_app_role')
							this.$router.push(data.redirectTo)
						}
						this.workunits = data.data;
					}
					);
			}, Math.random() * 1000 + 250);
		},
		openNew() {
			this.user = {};
			this.submitted = false;
			this.userDialog = true;
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
			if (this.onsearchtimeout)
				clearTimeout(this.onsearchtimeout)
			this.onsearchtimeout = setTimeout(() => {
				this.lazyParams.filters = this.filters;
				this.loadLazyData();
			}, 1000)
		},
		onSelectAllChange(event) {
			const selectAll = event.checked;

			if (selectAll) {
				this.UserService.getUsers().then(data => {
					if ('redirectTo' in data) {
						localStorage.removeItem('presence_app_token')
						localStorage.removeItem('presence_app_role')
						this.$router.push(data.redirectTo)
					}
					this.selectAll = true;
					this.selectedUsers = data.data;
				});
			}
			else {
				this.selectAll = false;
				this.selectedUsers = [];
			}
		},
		onRowSelect() {
			this.selectAll = this.selectedUsers.length === this.totalRecords
		},
		onRowUnselect() {
			this.selectAll = false;
		},
		initFilters() {
			this.filters = {
				'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
			}
		},
		editUser(user) {
			this.user = { ...user };
			this.userDialog = true;
		},
		hideDialog() {
			this.userDialog = false;
			this.submitted = false;
		},
		saveUser() {
			this.submitted = true;
			if (this.user.id) {
				this.UserService.updateUser(this.user)
					.then(res => {
						if (!res.success) {
							this.$swal({
								icon: 'error',
								title: 'Oops...',
								text: res.message,
							})
						}
						else {
							this.users[this.findIndexById(this.user.id)] = this.user;
							this.$swal({
								icon: 'success',
								title: 'Success',
								text: res.message
							})
							this.userDialog = false;
							this.user = {};
						}
					})
			} else {
				this.UserService.createUser(this.user)
					.then(res => {
						if (!res.success) {
							this.$swal({
								icon: 'error',
								title: 'Oops...',
								text: res.message,
							})
						}
						else {
							this.loadLazyData()
							this.$swal({
								icon: 'success',
								title: 'Success',
								text: res.message
							})
							this.userDialog = false;
							this.user = {};
						}
					})
			}
		},
		findIndexById(id) {
			let index = -1;
			for (let i = 0; i < this.users.length; i++) {
				if (this.users[i].id === id) {
					index = i;
					break;
				}
			}
			return index;
		},
		confirmDelete(user) {
			this.user = user;
			this.$swal({
				title: 'Apakah anda yakin akan menghapus data ini ?',
				showCancelButton: true,
				confirmButtonText: 'Hapus',
			}).then((result) => {
				if (result.isConfirmed) {
					this.UserService.deleteUser(this.user)
						.then(res => {
							if (!res.success) {
								this.$swal({
									icon: 'error',
									title: 'Oops...',
									text: res.message,
								})
							}
							else {
								this.users = this.users.filter(val => val.id !== this.user.id);
								this.$swal({
									icon: 'success',
									title: 'Success',
									text: res.message
								})
								this.userDialog = false;
								this.user = {};
							}
						})
				}
			})
		},
	}
}
</script>