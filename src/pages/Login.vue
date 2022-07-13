<template>
    <div class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="grid justify-content-center p-2 lg:p-0" style="min-width:80%">
            <div class="col-12 xl:col-6" style="border-radius:56px; padding:0.3rem; background: linear-gradient(180deg, var(--primary-color), rgba(33, 150, 243, 0) 30%);">
                <div class="h-full w-full m-0 py-7 px-4" style="border-radius:53px; background: linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0));">
                    <div class="text-center mb-5">
                        <img :src="app_logo" alt="Image" height="200" class="mb-3">
                        <div class="text-900 text-3xl font-medium mb-3">Selamat Datang!</div>
                        <span class="text-600 font-medium">Silahkan masuk untuk melanjutkan</span>
                    </div>
                
                    <div class="w-full md:w-10 mx-auto">
                        <form action="" method="post" @submit.prevent="doLogin()">
                            <label for="email1" class="block text-900 text-xl font-medium mb-2">Username</label>
                            <InputText id="email1" v-model="email" type="text" class="w-full mb-3" placeholder="Email" style="padding:1rem;" />
                    
                            <label for="password1" class="block text-900 font-medium text-xl mb-2">Kata Sandi</label>
                            <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem" :feedback="false"></Password>
                    
                            <!-- <div class="flex align-items-center justify-content-between mb-5">
                                <div class="flex align-items-center">
                                    <Checkbox id="rememberme1" v-model="checked" :binary="true" class="mr-2"></Checkbox>
                                    <label for="rememberme1">Ingat Saya</label>
                                </div>
                                <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Lupa Password?</a>
                            </div> -->
                            <Button type="submit" :label="sign_in_label" :disabled="disabled" class="w-full p-3 text-xl" @click="doLogin()"></button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AuthService from '../service/AuthService'
export default {
    data() {
        return {
            email: '',
            password: '',
            sign_in_label:'Masuk',
            disabled:false,
            API_URL : process.env.VUE_APP_API_URL,
            app_logo : process.env.VUE_APP_LOGO_URL,
            checked: false
        }
    },
    AuthService:null,
    created(){
        this.AuthService = new AuthService()
    },
    methods:{
        doLogin(){
            this.sign_in_label = 'Silahkan tunggu...'
            this.disabled = true
            this.AuthService.login({
                email:this.email, 
                password:this.password
            }).then(res => {
                if(!res.success)
                {
                    this.$swal({
                        icon: 'error',
                        title: 'Oops...',
                        text: res.message,
                    })
                    this.sign_in_label = 'Masuk'
                    this.disabled = false
                }
                else
                {
                    localStorage.setItem('presence_app_token',res.data.token)
                    localStorage.setItem('presence_app_role',res.data.user.role)
                    localStorage.setItem('presence_user_data',JSON.stringify(res.data.user))
                    this.sign_in_label = 'Login berhasil'
                    this.$router.push({name:'dashboard'});
                }
            })
        }
    },
    computed: {
        logoColor() {
            if (this.$appState.darkTheme) return 'white';
            return 'dark';
        }
    }
}
</script>

<style scoped>
.pi-eye {
    transform:scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform:scale(1.6);
    margin-right: 1rem;
}
</style>