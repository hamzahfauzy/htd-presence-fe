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

            <DataTable :value="workunitWorktimes" ref="dt" dataKey="id" responsiveLayout="scroll">
                <template #header>
                    <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                        <h5 class="m-0">Detail Jam Kerja</h5>
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
                        <Button v-if="slotProps.data.id" icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDelete(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>

            <Dialog v-model:visible="workunitWorktimeDialog" :style="{width: '450px'}" header="Form Detail Jam Kerja" :modal="true" class="p-fluid">
                <div class="field">
                    <label for="name">Jam Kerja</label>
                    <Dropdown v-model="workunitWorktime.worktime_id" :options="worktimes" optionLabel="name" optionValue="id" placeholder="Pilih Jam Kerja" :class="{'p-invalid': submitted && !workunitWorktime.worktime_id}"   />
                    <small class="p-invalid" v-if="submitted && !workunitWorktime.worktime_id">Jam kerja diperlukan.</small>
                </div>
                <template #footer>
                    <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
                    <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveWorktime" />
                </template>
            </Dialog>
        </div>
    </div>
</template>

<script>
import WorktimeService from '../../service/WorktimeService'

export default {
    props:{
        workunit:{},
        workunitService:null,
    },
    data() {
        return {
            loading: false,
            worktimes: null,
            workunitWorktimes: null,
            workunitWorktime: {},
            filters: {},
            lazyParams: {},
            columns: [
                {field: 'id', header: 'ID'},
                {field: 'name', header: 'Nama'},
            ],
            workunitWorktimeDialog: false,
            submitted:false,
        }
    },
    worktimeService: null,
    created() {
        this.worktimeService = new WorktimeService()
        this.workunitWorktimes = this.workunit.worktimes
    },
    mounted(){
        this.initData()
    },
    methods:{
        initData(){
            this.worktimeService.getAllWorktimes().then(d => {
                this.worktimes = d
            })
        },
        openNew() {
			this.workunitWorktime = {};
			this.submitted = false;
			this.workunitWorktimeDialog = true;
		},
        editPlace(workunitWorktime) {
			this.workunitWorktime = {...workunitWorktime};
			this.workunitWorktimeDialog = true;
		},
        confirmDelete(workunitWorktime) {
			this.workunitWorktime = workunitWorktime;
			this.$swal({
                title: 'Apakah anda yakin akan menghapus data ini ?',
                showCancelButton: true,
                confirmButtonText: 'Hapus',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.workunitService.deleteWorktime(this.workunit, this.workunitWorktime)
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
                            this.workunitWorktimes = this.workunitWorktimes.filter(val => val.id !== this.workunitWorktime.id);
                            this.$swal({
                                icon: 'success',
                                title: 'Success',
                                text: data.message
                            })
                            this.workunitWorktimeDialog = false;
                            this.workunitWorktime = {};
                        }
                    })
                }
            })
		},
        hideDialog() {
			this.workunitWorktimeDialog = false;
			this.submitted = false;
		},
        saveWorktime() {
			this.submitted = true;
            this.workunitService.assignWorktime(this.workunit, this.workunitWorktime)
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
                    var worktime = this.worktimes.find(w => w.id === this.workunitWorktime.worktime_id)
                    this.workunitWorktimes = [{
                        id: worktime.id,
                        name: worktime.name,
                    }]
                    this.workunitWorktimeDialog = false;
                    this.workunitWorktime = {};
                }
            })
		},
        findIndexById(id) {
			let index = -1;
			for (let i = 0; i < this.workunitWorktimes.length; i++) {
				if (this.workunitWorktimes[i].id === id) {
					index = i;
					break;
				}
			}
			return index;
		}
    }
}
</script>