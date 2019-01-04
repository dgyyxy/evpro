<template>
    <div>
        <ul class="breadcrumb">
            <li>产线检测</li>
            <li>车辆检测查询</li>
        </ul>
        <div class="smart-widget">
            <div class="smart-widget-inner">
                <div class="smart-widget-body">
                    <form @submit.prevent="search" class="form-inline no-margin">
                        <div class="form-group">
                            <label class="control-label label-name">VIN：</label>
                            <input type="text" class="form-control" placeholder="输入VIN码" v-model="searchParams.deviceId" autocomplete="off"/>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">日期：</label>
                            <date-picker 
                            v-model="dateTime" 
                            type="datetimerange"
                            @on-change="datePickerChange" 
                            :options="datePickerOption"
                            placeholder="请选择开始时间 —— 结束时间"
                            placement="bottom-end" 
                            :editable="false"
                            style="width: 320px" 
                            size="large">
                            </date-picker>
                        </div>
                        <button class="btn btn-sm btn-success"><Icon type="ios-search"/>搜索</button>
                        <button @click="_export" class="btn btn-sm btn-default">导出</button>
                    </form>
                </div>
            </div>
        </div>
        <div class="data-table table-responsive">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>VIN</th>
                        <th>指令类型</th>
                        <th>采集时间</th>
                        <th>状态</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in detectionList" :key='index'>
                        <td>{{item.deviceId}}</td>
                        <td>{{item.dataType | InstructionsFilter(item.dataType)}}</td>
                        <td>{{item.acquisitionTime | activeDateFilter}}</td>
                        <td>
                            <i-button :type="item.status==0?'success':'error'" shape="circle" size="small">{{item.status==0?"成功":"失败"}}</i-button>
                        </td>
                        <td><i-button type="ghost" icon="ios-eye" size="small" @click="vehicleData(index)" v-if='item.dataType==1?false:true'>查看详情</i-button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination-row clearfix">
            <div class="pull-right pull-left-sm">
                <zpagenav 
                :page="searchParams.pageIndex" 
                :page-size="searchParams.pageSize"
                :total="totalCount" 
                :max-link="5"
                :page-handler="pageChange"></zpagenav>
            </div>
        </div>
        <alert v-model="alert.modalShow" placement="top" duration="3000" 
        type="danger" width="400px" dismissable
               class="prompt-alert-box">
            <span class="icon-info-circled alert-icon-float-left"></span>
            <p v-text="alert.content"></p>
        </alert>
    </div>
</template>
<style>

</style>
<script>
    import {modal, alert} from 'vue-strap';
    import Vue from 'vue';
    import {mapActions} from 'vuex'
    import XLSX from 'xlsx';
    import 'xlsx/dist/xlsx.full.min.js';
    export default{
        data(){
            return {
                exportData:[],
                data: [
                  ["VIN","指令类型","采集时间","状态"]
                ],
                dateTime: [new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7), new Date()],
                searchParams: {
                    deviceId: '',
                    startTime:0,
                    endTime:0,
                    pageIndex: 1,
                    pageSize: 10
                },
                datePickerOption: {
                    disabledDate (date) {
                        return date.valueOf() > Date.now();
                    }
                },
                totalCount: 0,
                detectionList:[],
                alert: {
                    modalShow: false,
                    content: ""
                }
            }
        },
        methods: {
            InstructionsFilter(type) {
                let status = ['1','2','3'];
                let statusTxt = ['车辆登录','实时数据上报','补发数据上报'];
                let _index = 0 ; 
                status.map( (item,index)=>{
                    if( item==type ){
                        _index = index ;
                    }
                } );
                return statusTxt[_index];
            },
            activeDateFilter(value) {
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
            },
            _export(evt) {
              const wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' };
              const wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} };
              wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(this.data);
              saveAs(new Blob([this.s2ab(XLSX.write(wb, wopts))], { type: "application/octet-stream" }), "车辆检测信息统计" + '.' + (wopts.bookType=="biff2"?"xls":wopts.bookType));
            },
            s2ab(s) {
                if (typeof ArrayBuffer !== 'undefined') {
                    var buf = new ArrayBuffer(s.length);
                    var view = new Uint8Array(buf);
                    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
                } else {
                    var buf = new Array(s.length);
                    for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
                }
            },
            search(){

                this.searchParams.startTime=this.dateTime[0].getTime();
                this.searchParams.endTime=this.dateTime[1].getTime();
                let _this = this;

                let url = 'api/findVehicleDetectionList';

                if( this.searchParams.deviceId!='' ){
                    url = 'api/queryDataListWithHbase';
                };
                _this.$http.get(url, {params: _this.searchParams}).then((res) => {
                   if(res.body.status){
                        _this.detectionList = res.body.data;
                        _this.totalCount = res.body.totalCount;

                        $.each(_this.detectionList,function(i,item){
                            let a = _this.InstructionsFilter(item.dataType)
                            console.log(a)
                            _this.exportData.push(item.deviceId);
                            _this.exportData.push(_this.InstructionsFilter(item.dataType));
                            _this.exportData.push(_this.activeDateFilter(item.acquisitionTime));
                            _this.exportData.push(item.status==0?"成功":"失败");
                            _this.data.push(_this.exportData);
                            _this.exportData = []
                        })  
                   }
                });
            },
            /*详情*/
            vehicleData(id){
                this.detectionList.forEach((item,index)=>{
                    if( index==id ){
                        this.setUpLoadContent( item.uploadContent );
                    }
                });
                this.$router.push('/detection/VehicleData');
            },
            /*选择时间时进行判断*/
            datePickerChange(time){
                let flag = 0;
                let sub = 0;
                for (let i = 0; i < time.length; i++) {
                    if (time[i] === '-') {
                        flag++;
                        if (flag === 3) {
                            sub = i;
                            break;
                        }
                    }
                }
                let startTime = new Date(time.slice(0, sub - 1));
                let endTime = new Date(time.slice(sub + 1));
                if (endTime.getTime() - startTime.getTime() > 7 * 24 * 60 * 60 * 1000) {
                    this.showAlert({
                        content: "最大范围为一周，结束时间已调整至" + new Date(startTime.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleString()
                    });
                    this.dateTime = [startTime, new Date(startTime.getTime() + 7 * 24 * 60 * 60 * 1000)];
                }
            },
            showAlert(options){
                this.alert.modalShow = true;
                this.alert.content = options.content;
            },
            pageChange(page){
                this.searchParams.pageIndex=page;
                this.search();
            },
            ...mapActions(['setUpLoadContent'])
        },
        created() {
            this.search();
        },
        components:{
            alert
        }
    }
</script>