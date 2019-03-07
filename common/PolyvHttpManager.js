import Axios from "axios";
import PolyvVodConfigRnModule from '../page/PolyvVodConfigRnModule'

const HttpManager ={

    getVideoList(num,size,callback){

        var token = PolyvVodConfigRnModule.getToken
        var isSign = PolyvVodConfigRnModule.isSign

        console.log('sign :'+sign+' token :'+token())
        var sign=''
        if(isSign){
            //如果需要  计算sha值
        }

        Axios.get('http://v.polyv.net/uc/services/rest?method=getNewList',{
            params:{
                readtoken:token(),
                pageNum:num,
                numPerPage:size,
                sign:sign
            }
        }).then(ret =>{
            debugger
            console.log(' request is '+ret)

            callback(ret)
        })
        .catch(error =>{
            console.log(' request is '+error)
        })
    }
}
module.exports= HttpManager