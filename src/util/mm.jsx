import createHistory from 'history/createHashHistory'
const history = createHistory()

class MUtil{
    request(param){
        return new Promise((resolve, reject) => {
            $.ajax({
                type: param.type || 'get',
                url: param.url || '',
                dataType: param.dataType || 'json',
                data: param.data || null,
                success: res => {
                    if(res.status === 0){
                        typeof resolve === 'function' && resolve(res.data, res.msg)
                    }else if(res.status === 10){
                        this.doLogin()
                    }else{
                        typeof reject === 'function' && reject(res.msg || res.data)
                    }
                },
                error: err => {
                    typeof reject === 'function' && reject(err.statusText)
                }
            })
        })
    }
    doLogin(){
        let path = window.location.hash.replace('#', '')
        history.push(`/login?redirect=${encodeURIComponent(path)}`)
        /* window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname) */
    }
    getUrlParam(name){
        let queryString = window.location.hash.split('?')[1] || ''
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
        let result = queryString.match(reg)
        return result ? decodeURIComponent(result[2]) : null
    }
    successTips(successMsg){
        alert(successMsg || '操作成功！')
    }
    errorTips(msg){
        alert(msg || '出错啦~')
    }
    setStorage(name, data){
        let dataType = typeof data;
        if(dataType === 'object'){
            window.localStorage.setItem(name, JSON.stringify(data))
        }else if(['number', 'string', 'boolean'].indexOf(dataType) >= 0){
            window.localStorage.setItem(name, data)
        }else{
            alert('该类型不能用于本地存储')
        }
    }
    getStorage(name){
        let data = window.localStorage.getItem(name)
        if(data){
            return JSON.parse(data)
        }
        return ''
    }
    removeStorage(name){
        window.localStorage.removeItem(name)
    }
}

export default MUtil