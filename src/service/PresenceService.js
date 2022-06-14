export default class PresenceService {

	getPresences(lazyParams) {
        // const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';
        
        var params = 'page='+(lazyParams.page+1)+'&per_page='+lazyParams.rows
        var order_by = lazyParams.sortOrder == 1 ? 'asc' : 'desc';
        params +='&order_by='+order_by
        if(lazyParams.sortField != null)
        {
            params += '&sort_by='+lazyParams.sortField
        }

        if(lazyParams.filters.global.value)
        {
            params += '&keyword='+lazyParams.filters.global.value
        }
        
		return fetch(process.env.VUE_APP_API_URL+'presences?' + params,{
            headers:{
                'authorization' : 'Bearer '+localStorage.getItem('presence_app_token')
            }
        })
        .then(res => {
            if(res.status == 401)
            {
                return {data:{redirectTo:"Login"}};
            }
            return res.json()
        })
        .then(d => d.data);
    }

    getAllPresences() {
		return fetch(process.env.VUE_APP_API_URL+'presences?response=array',{
            headers:{
                'authorization' : 'Bearer '+localStorage.getItem('presence_app_token')
            }
        })
        .then(res => {
            if(res.status == 401)
            {
                return {data:{redirectTo:"Login"}};
            }
            return res.json()
        })
        .then(d => d.data);
    }

    updatePresence(presence){
        return fetch(process.env.VUE_APP_API_URL+'presences/'+presence.id,{
            method:'PUT',
            headers:{
                'authorization' : 'Bearer '+localStorage.getItem('presence_app_token'),
                'Content-type': 'application/json; charset=UTF-8',
            },
            body:JSON.stringify(presence)
        })
        .then(res => {
            if(res.status == 401)
            {
                return {redirectTo:"login"};
            }
            return res.json()
        })
    }

    deletePresence(presence){
        return fetch(process.env.VUE_APP_API_URL+'presences/'+presence.id,{
            method:'DELETE',
            headers:{
                'authorization' : 'Bearer '+localStorage.getItem('presence_app_token'),
                'Content-type': 'application/json; charset=UTF-8',
            },
            body:JSON.stringify(presence)
        })
        .then(res => {
            if(res.status == 401)
            {
                return {redirectTo:"Login"};
            }
            return res.json()
        })
    }
	
}