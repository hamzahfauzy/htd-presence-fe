<template>
    <div class="col-12">
        <div class="card">
            <Toolbar class="mb-4">
                <template v-slot:start>
                    <div class="my-2">
                        <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                    </div>
                </template>
            </Toolbar>

            <DataTable :value="places" ref="dt" dataKey="id" responsiveLayout="scroll">
                <template #header>
                    <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                        <h5 class="m-0">Detail Lokasi Absen</h5>
                    </div>
                </template>
                <Column field="id" header="ID" :sortable="true">
                    <template #body="slotProps">
                        <span class="p-column-title">ID</span>
                        {{slotProps.data.id}}
                    </template>
                </Column>
                <Column field="lat" header="Latitute"></Column>
                <Column field="lng" header="Longitude"></Column>
                <Column header="Aksi">
                    <template #body="slotProps">
                        <Button v-if="slotProps.data.id" icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDelete(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>

            <Dialog v-model:visible="placeDialog" :style="{width: '450px'}" header="Form Detail Jam Kerja" :modal="true" class="p-fluid">
                <div class="field">
                    <label for="name">Latitude</label>
                    <InputText id="name" v-model.trim="place.lat" required="true" autofocus :class="{'p-invalid': submitted && !place.lat}"  />
                    <small class="p-invalid" v-if="submitted && !place.lat">Latitute diperlukan.</small>
                </div>
                <div class="field">
                    <label for="name">Longitude</label>
                    <InputText id="name" v-model.trim="place.lng" required="true" autofocus :class="{'p-invalid': submitted && !place.lng}"  />
                    <small class="p-invalid" v-if="submitted && !place.lng">Longitude diperlukan.</small>
                </div>
                <template #footer>
                    <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
                    <Button label="Save" icon="pi pi-check" class="p-button-text" @click="savePlace" />
                </template>
            </Dialog>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        employee:{},
        employeeService:null,
    },
    data() {
        return {
            loading: false,
            places: null,
            place: {},
            filters: {},
            lazyParams: {},
            columns: [
                {field: 'id', header: 'ID'},
                {field: 'lat', header: 'Latitute'},
                {field: 'lng', header: 'Longitude'}
            ],
            placeDialog: false,
            submitted:false,
        }
    },
    created() {
        this.places = this.employee.places
    },
    mounted() {
        // this.loading = true;

        this.lazyParams = {
            first: 0,
            page: 0,
            rows: this.$refs.dt.rows,
            sortField: null,
            sortOrder: 1,
            filters: this.filters
        };
    },
    methods: {
        openNew() {
			this.place = {};
			this.submitted = false;
			this.placeDialog = true;
		},
        editPlace(place) {
			this.place = {...place};
			this.placeDialog = true;
		},
        confirmDelete(place) {
			this.place = place;
			this.$swal({
                title: 'Apakah anda yakin akan menghapus data ini ?',
                showCancelButton: true,
                confirmButtonText: 'Hapus',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.employeeService.deletePlace(this.employee, this.place)
                    .then(data => {
                        if('redirectTo' in data)
                        {
                            localStorage.removeItem('presence_app_token')
                            this.$router.push(data.redirectTo)
                        }

                        if(!data.success)
                        {
                            this.$swal({
                                icon: 'error',
                                title: 'Oops...',
                                text: data.message,
                            })
                        }
                        else
                        {
                            this.places = this.places.filter(val => val.id !== this.place.id);
                            this.$swal({
                                icon: 'success',
                                title: 'Success',
                                text: data.message
                            })
                            this.placeDialog = false;
                            this.place = {};
                        }
                    })
                }
            })
		},
        hideDialog() {
			this.placeDialog = false;
			this.submitted = false;
		},
        savePlace() {
			this.submitted = true;
            this.employeeService.addPlace(this.employee, this.place)
            .then(data => {
                if('redirectTo' in data)
                {
                    localStorage.removeItem('presence_app_token')
                    this.$router.push(data.redirectTo)
                }

                if(!data.success)
                {
                    this.$swal({
                        icon: 'error',
                        title: 'Oops...',
                        text: data.message,
                    })
                }
                else
                {
                    this.$swal({
                        icon: 'success',
                        title: 'Success',
                        text: data.message
                    })
                    this.places.push(this.place)
                    this.placeDialog = false;
                    this.place = {};
                }
            })
		},
        findIndexById(id) {
			let index = -1;
			for (let i = 0; i < this.places.length; i++) {
				if (this.places[i].id === id) {
					index = i;
					break;
				}
			}
			return index;
		}
    }
}
</script>