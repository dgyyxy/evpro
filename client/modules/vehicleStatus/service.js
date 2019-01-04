/**
 * Created by yong.liu on 2016/9/21.
 */
"use strict";
class StatusService{
    getAlertHandleValidation(){
        let validation = {
            name: {
                required: {
                    rule: true,
                    message: "姓名必填"
                },
                minlength: {
                    rule: 2,
                    message: "姓名至少2个字符"
                },
                maxlength: {
                    rule: 12,
                    message: "姓名最多12个字符"
                }
            },
            mobile: {
                required: {
                   rule: true,
                   message: "电话必填"
                },
                mobile: {
                    rule: true,
                    message: "非法的电话"
                }
            },
            remark:{
                maxlength: {
                    rule: 500,
                    message: "姓名最多12个字符"
                }
            },
            handleState:{
                required: {
                    rule: true,
                    message: "状态必填"
                }
            }

        };

        return validation;
    }
}

export default new StatusService;