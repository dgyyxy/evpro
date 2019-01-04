/**
 * Created by Caan on 2017/5/18.
 */
import {Validator } from 'vee-validate';

//提示信息
const messages = {
    after: (field, [target]) => ` ${field}必须在${target}之后`,
    alpha_dash: (field) => ` ${field}能够包含字母数字字符，包括破折号、下划线`,
    alpha_num: (field) => `${field} 只能包含字母数字字符.`,
    alpha_spaces: (field) => ` ${field} 只能包含字母字符，包括空格`,
    alpha: (field) => ` ${field} 只能包含字母字符`,
    before: (field, [target]) => ` ${field} 必须在${target} 之前`,
    between: (field, [min, max]) => ` ${field} 必须在${min} ${max}之间`,
    confirmed: (field, [confirmedField]) => ` 两次密码输入不一致`,
    date_between: (field, [min, max]) => ` ${field}必须在${min}和${max}之间`,
    date_format: (field, [format]) => ` ${field}必须在在${format}格式中`,
    decimal: (field, [decimals] = ['*']) => ` ${field} 必须是数字的而且能够包含${decimals === '*' ? '' : decimals} 小数点`,
    digits: (field, [length]) => ` ${field} 必须是数字，且精确到 ${length}数`,
    dimensions: (field, [width, height]) => ` ${field}必须是 ${width} 像素到 ${height} 像素`,
    email: (field) => `请输入正确的邮箱`,

    neEmail: (field) => `请输入正确的邮箱`,
    ext: (field) => ` ${field} 必须是有效的文件`,
    image: (field) => ` ${field} 必须是图片`,
    in: (field) => ` ${field} 必须是一个有效值`,
    ip: (field) => ` ${field} 必须是一个有效的地址`,
    max: (field, [length]) => ` ${field} 长度最多为${length} 字或字符`,
    mimes: (field) => ` ${field} 必须是有效的文件类型`,
    min: (field, [length]) => ` ${field} 长度至少有 ${length} 个字或字符`,
    mobile: (field) => ` 请输入正确的手机号`,
    not_in: (field) => ` ${field}必须是一个有效值`,
    noSpace: (field) => ` ${field} 不允许有空格`,
    numeric: (field) => ` ${field} 只能包含数字字符`,
    regex: (field) => ` ${field} 格式无效`,
    required: (field) => `请输入${field} `,
    size: (field, [size]) => ` ${field} 必须小于 ${size} KB`,
    url: (field) => ` ${field}不是有效的url`,
    idCard:(field) => `必须是有效的身份证号.`,
    blankSpace:(field) => `${field}不可以包含空格.`,
    alphaANum:(field) => `${field}只可以包含数字和大写字母`
};

const locale = {
    name: 'zh_CN',
    messages,
    attributes: {}
};

//规则
const mobile = {
    messages: {},
    validate: (value, args) => {
        return value.length == 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
    }
};

const noSpace = {
    messages: {},
    validate: (value, args) => {
        if (value.indexOf(' ') === -1) {
            return true
        } else {
            return false
        }
    }
};

const neEmail = {
    messages: {},
    validate:(value,args) =>{
        return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(value)
    }
};

const blankSpace = {
    messages: {},
    validate: (value, args) => {
        return /^[^ ]+$/.test(value)
    }
};

const alphaANum = {
    messages: {},
    validate: (value, args) => {
        return /^(?=.*?[A-Z])(?=.*?[0-9])[A-Z0-9]{17}$/.test(value)
    }
};

const idCard = {
    messages: {},
    validate: (value, args) => {
        return /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value) || /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/.test(value)
    }
};

const ICCID = {
    messages : {},
    validate:( value,args )=>{
        return /^(?![0-9]*$)[a-zA-Z0-9]{20}$/.test(value)
    }
};

Validator.extend('mobile', mobile);
Validator.extend('noSpace', noSpace);
Validator.extend('neEmail', neEmail);
Validator.extend('idCard', idCard);
Validator.extend('blankSpace', blankSpace);
Validator.extend('alphaANum', alphaANum);
Validator.extend('ICCID', ICCID);


Validator.addLocale(locale);