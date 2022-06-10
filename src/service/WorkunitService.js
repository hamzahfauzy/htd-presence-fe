export default class WorkunitService {

    getProductsSmall() {
		return fetch('data/products-small.json').then(res => res.json()).then(d => d.data);
	}

	getWorkunits(lazyParams) {
        // const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';
        
        var params = 'page='+(lazyParams.page+1)+'&per_page='+lazyParams.rows
        if(lazyParams.sortField != null)
        {
            var order_by = lazyParams.sortOrder == 1 ? 'asc' : 'desc';
            params += '&sort_by='+lazyParams.sortField+'&order_by='+order_by
        }

        if(lazyParams.filters.name.value)
        {
            params += '&name='+lazyParams.filters.name.value
        }
        
        if(lazyParams.filters.id.value)
        {
            params += '&id='+lazyParams.filters.id.value
        }

		return fetch(process.env.VUE_APP_API_URL+'workunits?' + params,{
            headers:{
                'authorization' : 'Bearer '+localStorage.getItem('presence_app_token')
            }
        })
        .then(res => res.json())
        .then(d => d.data);
    }

    getProductsWithOrdersSmall() {
		return fetch('data/products-orders-small.json').then(res => res.json()).then(d => d.data);
	}
	
}