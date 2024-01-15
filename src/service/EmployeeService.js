export default class EmployeeService {

	getEmployees(lazyParams, workunit_id = false) {
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

        var userData = JSON.parse(localStorage.getItem('presence_user_data'))
        if(userData.workunit_id)
        {
            params += '&workunit_id='+userData.workunit_id;
        }

        if(workunit_id)
        {
            params += '&workunit_id='+workunit_id;
        }
        
		return fetch(process.env.VUE_APP_API_URL+'employees?' + params,{
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

    getEmployeesReport(lazyParams,workunit_id) {
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

            if(lazyParams.date_start != null && lazyParams.date_end != null)
            {
                params += '&date_start='+lazyParams.date_start+'&date_end='+lazyParams.date_end
            }
        }
        
		return fetch(process.env.VUE_APP_API_URL+'employees/reports/'+workunit_id+'?' + params,{
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

    getEmployeesReportDetail(lazyParams,workunit_id) {
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

            if(lazyParams.date_start != null && lazyParams.date_end != null)
            {
                params += '&date_start='+lazyParams.date_start+'&date_end='+lazyParams.date_end
            }
        }
        
		return fetch(process.env.VUE_APP_API_URL+'employees/report-details/'+workunit_id+'?' + params,{
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

    getEmployeesReportPdfLink(lazyParams,workunit_id) {
        // const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';
        
        var params = ''
        if(lazyParams){
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

            if(lazyParams.date_start != null && lazyParams.date_end != null)
            {
                params += '&date_start='+lazyParams.date_start+'&date_end='+lazyParams.date_end
            }
        }
        
		return (process.env.VUE_APP_API_URL+'employees/report-pdf/'+workunit_id+'?' + params)
    }

    getEmployeesReportDetailPdfLink(lazyParams,workunit_id) {
        // const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';
        
        var params = ''
        if(lazyParams){
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

            if(lazyParams.date_start != null && lazyParams.date_end != null)
            {
                params += '&date_start='+lazyParams.date_start+'&date_end='+lazyParams.date_end
            }
        }
        
		return (process.env.VUE_APP_API_URL+'employees/report-detail-pdf/'+workunit_id+'?' + params)
    }

    getEmployee(id) {
		return fetch(process.env.VUE_APP_API_URL+'employees/' + id,{
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

    getPresence(id,presence_id) {
		return fetch(process.env.VUE_APP_API_URL+'employees/' + id + '/presences/'+presence_id,{
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

    // updateEmployee(employee){
    //     return fetch(process.env.VUE_APP_API_URL+'employees/'+employee.id+'/place',{
    //         method:'PATCH',
    //         headers:{
    //             'authorization' : 'Bearer '+localStorage.getItem('presence_app_token'),
    //             'Content-type': 'application/json; charset=UTF-8',
    //         },
    //         body:JSON.stringify({
    //             lat:employee.lat,
    //             lng:employee.lng,
    //             radius:employee.radius,
    //         })
    //     })
    //     .then(res => {
    //         if(res.status == 401)
    //         {
    //             return {redirectTo:"Login"};
    //         }
    //         return res.json()
    //     })
    // }

    updateRole(user, role){
        var _user = {...user}
        _user.role = role
        return fetch(process.env.VUE_APP_API_URL+'users/'+user.id,{
            method:'PUT',
            headers:{
                'authorization' : 'Bearer '+localStorage.getItem('presence_app_token'),
                'Content-type': 'application/json; charset=UTF-8',
            },
            body:JSON.stringify(_user)
        })
        .then(res => {
            if(res.status == 401)
            {
                return {redirectTo:"Login"};
            }
            return res.json()
        })
    }

    addPlace(employee, data){
        return fetch(process.env.VUE_APP_API_URL+'employees/'+employee.id+'/place',{
            method:'POST',
            headers:{
                'authorization' : 'Bearer '+localStorage.getItem('presence_app_token'),
                'Content-type': 'application/json; charset=UTF-8',
            },
            body:JSON.stringify(data)
        })
        .then(res => {
            if(res.status == 401)
            {
                return {redirectTo:"Login"};
            }
            return res.json()
        })
    }

    deletePlace(employee, data){
        return fetch(process.env.VUE_APP_API_URL+'employees/'+employee.id+'/place',{
            method:'DELETE',
            headers:{
                'authorization' : 'Bearer '+localStorage.getItem('presence_app_token'),
                'Content-type': 'application/json; charset=UTF-8',
            },
            body:JSON.stringify({
                place_id:data.id
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

    patchPlace(employee){
        return fetch(process.env.VUE_APP_API_URL+'employees/'+employee.id+'/place',{
            method:'PATCH',
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

    patchAndroid(employee){
        return fetch(process.env.VUE_APP_API_URL+'employees/'+employee.id+'/android-user',{
            method:'PATCH',
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

    resetDevice(employee){
        return fetch(process.env.VUE_APP_API_URL+'employees/'+employee.id+'/reset-device',{
            method:'POST',
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

    resetPassword(employee){
        return fetch(process.env.VUE_APP_API_URL+'employees/'+employee.id+'/reset-password',{
            method:'POST',
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

    addWorktime(employee, data){
        return fetch(process.env.VUE_APP_API_URL+'employees/'+employee.id+'/worktime',{
            method:'POST',
            headers:{
                'authorization' : 'Bearer '+localStorage.getItem('presence_app_token'),
                'Content-type': 'application/json; charset=UTF-8',
            },
            body:JSON.stringify(data)
        })
        .then(res => {
            if(res.status == 401)
            {
                return {redirectTo:"Login"};
            }
            return res.json()
        })
    }

    deleteWorktime(employee, data){
        return fetch(process.env.VUE_APP_API_URL+'employees/'+employee.id+'/worktime',{
            method:'DELETE',
            headers:{
                'authorization' : 'Bearer '+localStorage.getItem('presence_app_token'),
                'Content-type': 'application/json; charset=UTF-8',
            },
            body:JSON.stringify({
                worktime_id:data.id,
                date_start:data.pivot.date_start,
                date_end:data.pivot.date_end,
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

    actionPresence(status, data){
        return fetch(process.env.VUE_APP_API_URL+'employees/'+data.employee_id+'/presences/'+data.id,{
            method:'PATCH',
            headers:{
                'authorization' : 'Bearer '+localStorage.getItem('presence_app_token'),
                'Content-type': 'application/json; charset=UTF-8',
            },
            body:JSON.stringify({
                status:status
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

    insertPresence(employee_id, data){
        return fetch(process.env.VUE_APP_API_URL+'employees/'+employee_id+'/presences',{
            method:'POST',
            headers:{
                'authorization' : 'Bearer '+localStorage.getItem('presence_app_token'),
                // 'Content-type': 'multipart/form-data',
            },
            body:data
        })
        .then(res => {
            if(res.status == 401)
            {
                return {redirectTo:"Login"};
            }
            return res.json()
        })
    }

    addEmployee(employee){
        return fetch(process.env.VUE_APP_API_URL+'employees',{
            method:'POST',
            headers:{
                'authorization' : 'Bearer '+localStorage.getItem('presence_app_token'),
                'Content-type': 'application/json; charset=UTF-8',
            },
            body:JSON.stringify({
                workunit_id:employee.workunit_id,
                nip:employee.nip,
                name:employee.name,
                group:employee.group,
                position:employee.position,
                phone:employee.phone,
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

    updateEmployee(employee){
        return fetch(process.env.VUE_APP_API_URL+'employees/'+employee.id,{
            method:'POST',
            headers:{
                'authorization' : 'Bearer '+localStorage.getItem('presence_app_token'),
                'Content-type': 'application/json; charset=UTF-8',
            },
            body:JSON.stringify({
                workunit_id:employee.workunit_id,
                nip:employee.nip,
                name:employee.name,
                group:employee.group,
                position:employee.position,
                phone:employee.phone,
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

    deleteEmployee(employee){
        return fetch(process.env.VUE_APP_API_URL+'employees/'+employee.id,{
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