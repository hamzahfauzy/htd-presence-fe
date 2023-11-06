export default class ReportRequestService {

	getReports(workunit_id = false) {
        // const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';

        var params = ''
        var userData = JSON.parse(localStorage.getItem('presence_user_data'))
        if(userData.workunit_id)
        {
            params += '&workunit_id='+userData.workunit_id;
        }

        if(workunit_id)
        {
            params += '&workunit_id='+workunit_id;
        }
        
		return fetch(process.env.VUE_APP_API_URL+'report-requests?' + params,{
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

    createReport(data){
        var userData = JSON.parse(localStorage.getItem('presence_user_data'))
        if(userData.workunit_id)
        {
            data.workunit_id = userData.workunit_id
        }

        return fetch(process.env.VUE_APP_API_URL+'report-requests',{
            method:'POST',
            headers:{
                'authorization' : 'Bearer '+localStorage.getItem('presence_app_token'),
                'Content-type': 'application/json; charset=UTF-8',
            },
            body:JSON.stringify({
                workunit_id:data.workunit_id,
                start_at:data.start_at,
                end_at:data.end_at,
                report_type:data.report_type,
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