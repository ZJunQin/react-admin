import MUtil from 'util/mm.jsx'
const _mm = new MUtil()

class Statistic{
    getHomeCount(loginInfo){
        return _mm.request({
            url: '/manage/statistic/base_count.do'
        })
    }
}

export default Statistic;