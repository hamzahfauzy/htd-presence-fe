export default class AuthService {

	async validate() {
        // const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';
        
		var req = await fetch(process.env.VUE_APP_API_URL+'user',{
            headers:{
                'authorization' : 'Bearer '+localStorage.getItem('presence_app_token')
            }
        })

        return req.status
    }

    login(data){
        return fetch(process.env.VUE_APP_API_URL+'auth/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        })
        .then(res => res.json())
    }
	
}