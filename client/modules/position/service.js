/**
 * Created by mx on 2016/12/7.
 */
class PositionService{
    getInitData(){
        return {
            "pageCount": 0,
            "pageSize": 10,
            "pageIndex": 1,
            "totalCount": 0,
            "datas": []
        }
    }
}

export default new PositionService();