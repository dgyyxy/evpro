/**
 * Created by yong.liu on 2016/10/23.
 */
"use strict";

Date.prototype.neFormat = function (format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
};

function VueFilter() {
}

VueFilter.prototype.constructor = VueFilter;

VueFilter.prototype.format_date = function (value, format) {
    var date = new Date(value);
    return date.neFormat(format);
};


VueFilter.prototype.status_filter = function (value) {
    let status = ['SUCCESS', 'FAILED'];
    let statusTxt = ['成功', '失败'];
    let _index = 0;
    status.map(function (currentValue, index) {
        if (currentValue == value) {
            _index = index;
        }
    });
    return statusTxt[_index];
};

VueFilter.prototype.activeDateFilter = function (value) {
    value = parseInt(value)
    if (value == "" || value == undefined || value === null || isNaN(value)) {
        return value = ""
    } else {
        let format = 'yyyy-MM-dd HH:mm:ss';
        let t = new Date(value);
        let tf = function (i) {
            return (i < 10 ? "0" : "") + i
        };
        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
            switch (a) {
                case 'yyyy':
                    return tf(t.getFullYear());
                    break;
                case 'MM':
                    return tf(t.getMonth() + 1);
                    break;
                case 'mm':
                    return tf(t.getMinutes());
                    break;
                case 'dd':
                    return tf(t.getDate());
                    break;
                case 'HH':
                    return tf(t.getHours());
                    break;
                case 'ss':
                    return tf(t.getSeconds());
                    break;
            }
        });
    }
};

VueFilter.prototype.activeYearFilter = function (value) {
    if (value == "" || value == undefined) {
        return value = ""
    } else {
        let format = 'yyyy-MM-dd';
        let t = new Date(value);
        let tf = function (i) {
            return (i < 10 ? "0" : "") + i
        };
        return format.replace(/yyyy|MM|dd/g, function (a) {
            switch (a) {
                case 'yyyy':
                    return tf(t.getFullYear());
                    break;
                case 'MM':
                    return tf(t.getMonth() + 1);
                    break;
                case 'dd':
                    return tf(t.getDate());
                    break;
            }
        });
    }
};

VueFilter.prototype.genderFilter = function (value) {
    let status = ['M', 'F'];
    let statusTxt = ['男', '女'];
    let _index = 0;
    status.map(function (currentValue, index) {
        if (currentValue == value) {
            _index = index;
        }
    });
    return statusTxt[_index];
};

VueFilter.prototype.date_filter = function(value,type){
    if(value){
        var d = new Date(value);
        var date = {
            "Y": d.getFullYear(),
            "M": d.getMonth()>8?(d.getMonth()+1):'0'+(d.getMonth()+1),
            "D": d.getDate()>9?d.getDate():'0'+d.getDate(),
            "h": d.getHours()>9?d.getHours():'0'+d.getHours(),
            "m": d.getMinutes()>9?d.getMinutes():'0'+d.getMinutes(),
            "s": d.getSeconds()>9?d.getSeconds():'0'+d.getSeconds()
        };
        var t = date['Y']+'-'+date['M']+'-'+date['D'];
        if(type != 1){
            t = date['Y']+'-'+date['M']+'-'+date['D']+' '+date['h']+':'+date['m']+':'+date['s']
        }
        return t;
    }else{
        return "";
    }
};

VueFilter.prototype.vehicle_status_filter = function(value){
    let status = ['ACTIVE', 'DEACTIVE', 'EXPIRED'];
    let statusTxt = ['可用', '不可用', '已过期'];
    let _index = 0;
    status.map(function(currentValue, index){
        if(currentValue == value){
            _index = index;
        }
    });
    return statusTxt[_index];
}

VueFilter.prototype.handleState_Filter = (value) =>{
    let statusGroup = ['0','1','2'];
    let statusGroupTxt = ['未处理','处理中','已处理'];
    let _index = 0;
    statusGroup.map(function(currentValue, index){
        if(currentValue == value){
            _index = index;
        }
    });
    return statusGroupTxt[_index];
}

VueFilter.prototype.trueFalse_Filter = (value,code) =>{
    if(code === '1007'){
        let statusGroup = ['false','true'];
        let statusGroupTxt = ['0','1'];
        let _index = 0;
        statusGroup.map(function(currentValue, index){
            if(currentValue == value){
                _index = index;
            }
        });
        return statusGroupTxt[_index];
    }else{
        return value
    }
};

VueFilter.prototype.contactTypeFilter = function(value){
    let status = ['SALES', 'RESCUE', 'AFTER_SALES'];
    let statusTxt = ['销售电话', '道路救援电话', '售后服务电话'];
    let _index = 0;
    status.map(function(currentValue, index){
        if(currentValue == value){
            _index = index;
        }
    });
    return statusTxt[_index];
}

VueFilter.prototype.default_filter = function(value, father){
    if(father){
        if(value){
            return value
        }else{
            return "N/A";
        }
    }else{
        if(value){
            return value
        }else{
            return "N/A";
        }
    }
}

VueFilter.prototype.TservicePackageStatusFilter = function (value) {
    let status = ['using', 'expired', 'closed', 'failed'];
    let statusTxt = ['开通成功', '已关闭', '已关闭', '开通失败'];
    let _index = 0;
    status.map(function (currentValue, index) {
        if (currentValue == value) {
            _index = index;
        }
    });
    return statusTxt[_index];
};

VueFilter.prototype.openerFilter = function (value) {
    let status = ['dealer', 'owner'];
    let statusTxt = ['经销商', '车主'];
    let _index = 0;
    status.map(function (currentValue, index) {
        if (currentValue == value) {
            _index = index;
        }
    });
    return statusTxt[_index];
};

VueFilter.prototype.instructionsFilter= function (type) {
    let status = ['1','2','3'];
    let statusTxt = ['车辆登录','实时数据上报','补发数据上报'];
    let _index = 0 ; 
    status.map( (item,index)=>{
        if( item==type ){
            _index = index ;
        }
    } );
    return statusTxt[_index];
}

VueFilter.prototype.vehicle_code_Filter=function(code){
    let status = ['1001001','1001002','1001003','1001004','1001005','1001006','1001007','1001008','1001009','1001010','1001011','1001012','1001013','1002001','1002002','1002003','1002004','1002005','1002006','1002007','1002008','1003001','1003002','1003003','1003004','1003005','1003006','1003007','1003008','1003009','1003010','1003011','1003012','1004001','1004002','1004003','1005001','1005002','1005003','1005004','1005005','1006001','1006002','1006003','1006004','1006005','1006006','1006007','1006008','1006009','1006010','1006011','1006012','1007001','1007002','1007003','1007004','1007005','1007006','1007007','1007008','1007009','1007010','1007011','1007012','1007013','1007014','1007015','1007016','1007017','1007018','1007019','1007020','1007021','1007022','1007023','1007024','1007025','1007026','1007027','1007028','1008001','1008002','1008003','1008004','1008005','1008006','1008007','1008008','1009001','1009002','1009003'];
    let statusTxt = ['车辆状态','充电状态','运行模式','车速','累计里程','总电压','总电流','SOC','DC-DC状态','挡位','绝缘电阻','加速踏板行程值','制动踏板状态','驱动电机序号','驱动电机状态','驱动电机控制器温度','驱动电机转速','驱动电机转矩','驱动电机温度','电机控制器输入电压','电机控制器直流母线电流','燃料电池电压','燃料电池电流','燃料电池燃料消耗率','燃料电池','探针温度值','氢系统中最高温度','氢系统中最高温度探针代号','氢气最高浓度','氢气最高浓度传感器代号','氢气最高压力','氢气最高压力传感器代号','高压DC/DC状态','发动机状态','曲轴转速','发动机燃料消耗率','有效性','纬度类型','经度类型','经度','纬度','最高电压电池子系统号','最高电压电池单体代号','电池单体电压最高值','最低电压电池子系统号','最低电压电池单体代号','电池单体电压最低值','最高温度子系统号','最高温度探针序号','最高温度值','最低温度子系统号','最低温度探针序号','最低温度值','最高报警等级','温度差异报警','电池高温报警','车载储能装置类型过压报警','车载储能装置类型欠压报警','SOC低报警','单体电池过压报警','单体电池欠压报警','SOC过高报警','SOC跳变报警','可充电储能系统不匹配报警','电池单体一致性差报警','绝缘报警','DC-DC温度报警','制动系统报警','DC-DC状态报警','驱动电机控制器温度报警','高压互锁状态报警','驱动电机温度报警','车载储能装置类型过充','可充电储能装置故障总数N1','可充电储能装置故障代码列表','驱动电机故障总数N2','驱动电机故障代码列表','发动机故障总数N3','发动机故障列表','其他故障总数N4','其他故障代码列表','可充电储能子系统号(电压)','可充电储能装置电压','可充电储能装置电流','单体电池总数','本帧起始电池序号','本帧单体电池总数','单体电池电压','可充电储能子系统号(温度)','可充电储能,温度探针个数','可充电储能子系统,各温度探针,检测到的温度值'];
    let _index = 0 ; 
    status.map( (item,index)=>{
        if( item==code ){
            _index = index ;
        }
    } );
    return statusTxt[_index];
}

VueFilter.prototype.vehicle_data_Filter= function (data,code) {
    let status = ['1001004','1001005','1001006','1001007','1001008','1001011','1001012','1001013','1002003','1002004','1002005','1002006','1002007','1002008','1003001','1003002','1003003','1003005','1003006','1003008','1003010','1004002','1004003','1006003','1006006','1006009','1006012','1008002','1008003','1008007','1009003'];
    /*第一部分是单位*/
    let statusTxt = ['KM/H','KM','V','A','%','KΩ','%','%','℃','R/MIN','N*M','℃','V','A','V','A','KG/100KM','℃','℃','PPM','MPa','RPM','L/100KM','V','','V','℃','℃','V','A','V','℃'];
    /*第二部分判断0和1*/
    let statusTwo = ['1007002','1007003','1007004','1007005','1007006','1007007','1007008','1007009','1007010','1007011','1007012','1007013','1007014','1007015','1007016','1007017','1007018','1007019','1007020'] 
    let _index = 0 ; 
    let p = /[0-9]/; 
    /*第三部分判断输出有效范围*/
    let statusThree = [ '1001004','1001005','1001006','1001007','1001008','1001011','1001012','1001013','1002001','1002003','1002004','1002005','1002006','1002007','1002008','1003001','1003002','1003003','1003004','1003005','1003006','1003007','1003008','1003009','1003011','1004002','1004003','1006001','1006002','1006003','1006004','1006005','1006006','1006007','1006008','1006009','1006010','1006011','1006012','1008001','1008002','1008003','1008004','1008005','1008006','1008007','1009001','1009002','1009003'];
    let statusThreeTxt = ['(有效值范围：0～2200)','(有效值范围：0～9999999)','(有效值范围：0～10000)','(有效值范围：0～20000)','(有效值范围：0～100)','(有效值范围：0～60000)','(有效值范围：0～100)','(有效值范围：0～100)','(有效值范围：0～250)','(有效值范围：1～253)','(有效值范围：0～65531)','(有效值范围：0～65531)','(有效值范围：0～250)','(有效值范围：0～60000)','(有效值范围：0～20000)','(有效值范围：0～20000)','(有效值范围：0～20000)','(有效值范围：0～60000)','(有效值范围：0～65531)','(有效值范围：0～240)','(有效值范围：0～2400)','(有效值范围：1～252)','(有效值范围：0～60000)','(有效值范围：1～252)','(有效值范围：0～1000)','(有效值范围：1～252)','(有效值范围：0～60000)','(有效值范围：0～60000)','(有效值范围：1～250)','(有效值范围：1～250)','(有效值范围：0～15000)','(有效值范围：1～250)','(有效值范围：1～250)','(有效值范围：0～15000)','(有效值范围：1～250)','(有效值范围：1～250)','(有效值范围：0～250)','(有效值范围：1～250)','(有效值范围：1～250)','(有效值范围：0～250)','(有效值范围：1～250)','(有效值范围：0～10000)','(有效值范围：0～20000)','(有效值范围：1～65531)','(有效值范围：1～65531)','(有效值范围：1～200)','(有效值范围：0～60000)','(有效值范围：1～250)','(有效值范围：1～65531)','(有效值范围：0～250)'];
    status.map( (item,index)=>{
        if( item==code ){
            _index = index ;
            if( p.test( data ) ){
                data += statusTxt[_index];
            }
        }
    } ); 
    statusTwo.map( (item,index)=>{
        if( item==code ){
            _index = index ;
            if( data=='true' ){
                data='正常';
            }else{
                data = '异常';
            }
        }
    } );
    statusThree.map( (item,index)=>{
        if(item==code) data += statusThreeTxt[index];
    } );

    return data;
}

let Filter = new VueFilter;
let DateFormat = Filter.format_date;
let StatusFilter = Filter.status_filter;
let activeDateFilter = Filter.activeDateFilter;
let activeYearFilter = Filter.activeYearFilter;
let genderFilter = Filter.genderFilter;
let DateFilter = Filter.date_filter;
let VehicleStatusFilter = Filter.vehicle_status_filter;
let handleStateFilter = Filter.handleState_Filter;
let trueFalseFilter = Filter.trueFalse_Filter;
let ContactTypeFilter = Filter.contactTypeFilter;
let DefaultFilter = Filter.default_filter;
let TservicePackageStatusFilter = Filter.TservicePackageStatusFilter;
let openerFilter = Filter.openerFilter;
let InstructionsFilter = Filter.instructionsFilter;
let VehicleCodeFilter = Filter.vehicle_code_Filter;
let VehicleDataFilter = Filter.vehicle_data_Filter;

export {
    DateFormat,
    StatusFilter,
    activeDateFilter,
    activeYearFilter,
    genderFilter,
    DateFilter,
    VehicleStatusFilter,
    handleStateFilter,
    trueFalseFilter,
    ContactTypeFilter,
    DefaultFilter,
    TservicePackageStatusFilter,
    openerFilter,
    InstructionsFilter,
    VehicleCodeFilter,
    VehicleDataFilter
}; 
   
    
