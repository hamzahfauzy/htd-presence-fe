export default class WorkunitService {

	getWorkunits(lazyParams) {
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

		return fetch(process.env.VUE_APP_API_URL+'workunits?' + params,{
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

    updateWorkunit(workunit){
        return fetch(process.env.VUE_APP_API_URL+'workunits/'+workunit.id+'/place',{
            method:'PATCH',
            headers:{
                'authorization' : 'Bearer '+localStorage.getItem('presence_app_token'),
                'Content-type': 'application/json; charset=UTF-8',
            },
            body:JSON.stringify({
                lat:workunit.lat,
                lng:workunit.lng,
                radius:workunit.radius,
            })
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