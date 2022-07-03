<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="font-medium text-3xl text-900 mb-3">Detail Pengguna</div>
                <ul class="list-none p-0 m-0">
                    <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Nama</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {{user.name}}
                        </div>
                    </li>
                    <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Email</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {{user.email}}
                        </div>
                    </li>
                    <li class="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                        <div class="text-500 w-6 md:w-2 font-medium">Jabatan</div>
                        <div class="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                            {{user.role}}
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import UserService from '../../service/UserService';

export default {
    data() {
        return {
            userId:null,
            user:{},
            roleDialog: false,
            submitted:false,
            user_role:'',
        }
    },
    UserService: null,
    created() {
        this.userId = this.$route.params.id
        this.UserService = new UserService();
    },
    mounted(){
        this.initData()
    },
    methods:{
        initData(){
            this.UserService.getUser(this.userId).then(d => {
                this.user = d
            })
        },
    }
}
</script>