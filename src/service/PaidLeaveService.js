export default class PaidLeaveService {

	getPaidLeaves(lazyParams) {
        // const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';
        
        var params = ''
            if(lazyParams){
            params = 'page='+(lazyParams.page+1)+'&per_page='+lazyParams.rows
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
        }
        
		return fetch(process.env.VUE_APP_API_URL+'paid_leaves?' + params,{
            headers:{
                'authorization' : 'Bearer '+localStorage.getItem('presence_app_token')
            }
        })
        .then(res => {
            if(res.status == 401)
            {
                return {data:{redirectTo:"login"}};
            }
            return res.json()
        })
        .then(d => d.data);
    }

    getPaidLeave(id) {
		return fetch(process.env.VUE_APP_API_URL+'paid_leaves/' + id,{
            headers:{
                'authorization' : 'Bearer '+localStorage.getItem('presence_app_token')
            }
        })
        .then(res => {
            if(res.status == 401)
            {
                return {data:{redirectTo:"login"}};
            }
            return res.json()
        })
        .then(d => d.data);
    }

    createPaidLeave(PaidLeave){
        return fetch(process.env.VUE_APP_API_URL+'paid_leaves',{
            method:'POST',
            headers:{
                'authorization' : 'Bearer '+localStorage.getItem('presence_app_token'),
                'Content-type': 'application/json; charset=UTF-8',
            },
            body:JSON.stringify({
                name:PaidLeave.name,
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

    updatePaidLeave(PaidLeave){
        return fetch(process.env.VUE_APP_API_URL+'paid_leaves/'+PaidLeave.id,{
            method:'PUT',
            headers:{
                'authorization' : 'Bearer '+localStorage.getItem('presence_app_token'),
                'Content-type': 'application/json; charset=UTF-8',
            },
            body:JSON.stringify({
                name:PaidLeave.name,
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

    deletePaidLeave(PaidLeave){
        return fetch(process.env.VUE_APP_API_URL+'paid_leaves/'+PaidLeave.id,{
            method:'DELETE',
            headers:{
                'authorization' : 'Bearer '+localStorage.getItem('presence_app_token'),
                'Content-type': 'application/json; charset=UTF-8',
            },
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