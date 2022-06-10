<template>
	<div class="grid">
		<div class="col-12">
			<div class="card">
                <DataTable :value="workunits" :lazy="true" :paginator="true" :rows="10" v-model:filters="filters" ref="dt" dataKey="id"
                    :totalRecords="totalRecords" :loading="loading" @page="onPage($event)" @sort="onSort($event)" @filter="onFilter($event)" filterDisplay="row"
                    :globalFilterFields="['name']" responsiveLayout="scroll"
                    v-model:selection="selectedCustomers" :selectAll="selectAll" @select-all-change="onSelectAllChange" @row-select="onRowSelect" @row-unselect="onRowUnselect">
                    <Column field="id" header="ID" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #filter="{filterModel,filterCallback}">
                            <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search by id"/>
                        </template>
						<template #body="slotProps">
							<span class="p-column-title">ID</span>
							{{slotProps.data.id}}
						</template>
					</Column>
                    <Column field="name" header="Nama" filterMatchMode="startsWith" ref="name" :sortable="true">
                        <template #filter="{filterModel,filterCallback}">
                            <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search by name"/>
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editWorkunit(slotProps.data)" />
						</template>
					</Column>
                </DataTable>

                <Dialog v-model:visible="workunitDialog" :style="{width: '450px'}" header="Detail OPD" :modal="true" class="p-fluid">
					<div class="field">
						<label for="name">Nama</label>
						<InputText id="name" v-model.trim="workunit.name" required="true" autofocus disabled />
					</div>
                    <div class="field">
						<label for="lat">Lat</label>
						<InputText id="lat" v-model.trim="workunit.lat" required="true" autofocus :class="{'p-invalid': submitted && !workunit.lat}" />
						<small class="p-invalid" v-if="submitted && !workunit.lat">Lat diperlukan.</small>
					</div>
                    <div class="field">
						<label for="lng">Lng</label>
						<InputText id="lng" v-model.trim="workunit.lng" required="true" autofocus :class="{'p-invalid': submitted && !workunit.lng}" />
						<small class="p-invalid" v-if="submitted && !workunit.lng">Lng diperlukan.</small>
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="hideDialog" />
					</template>
				</Dialog>
            </div>
        </div>
	</div>
</template>

<script>
import WorkunitService from '../../service/WorkunitService';

export default {
    data() {
        return {
            loading: false,
            totalRecords: 0,
            workunits: null,
            workunit: {},
            selectedWorkunits: null,
            selectAll: false,
            filters: {
                'id': {value: '', matchMode: 'contains'},
                'name': {value: '', matchMode: 'contains'}
            },
            lazyParams: {},
            columns: [
                {field: 'id', header: 'ID'},
                {field: 'name', header: 'Nama'}
            ],
            workunitDialog: false,
            submitted:false,
        }
    },
    workunitService: null,
    created() {
        this.workunitService = new WorkunitService();
    },
    mounted() {
        this.loading = true;

        this.lazyParams = {
            first: 0,
            page: 0,
            rows: this.$refs.dt.rows,
            sortField: null,
            sortOrder: null,
            filters: this.filters
        };

        this.loadLazyData();
    },
    methods: {
        loadLazyData() {
            this.loading = true;

            setTimeout(() => {
                this.workunitService.getWorkunits(this.lazyParams)
                        .then(data => {
                            this.workunits = data.data;
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
            this.lazyParams.filters = this.filters;
            this.loadLazyData();
        },
        onSelectAllChange(event) {
            const selectAll = event.checked;

            if (selectAll) {
                this.workunitService.getWorkunits().then(data => {
                    this.selectAll = true;
                    this.selectedWorkunits = data.data;
                });
            }
            else {
                this.selectAll = false;
                this.selectedWorkunits = [];
            }
        },
        onRowSelect() {
            this.selectAll = this.selectedWorkunits.length === this.totalRecords
        },
        onRowUnselect() {
            this.selectAll = false;
        },
        editWorkunit(workunit) {
			this.workunit = {...workunit};
			this.workunitDialog = true;
		},
        hideDialog() {
			this.workunitDialog = false;
			this.submitted = false;
		},
    }
}
</script>