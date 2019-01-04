<template>
    <Row>
        <modal large v-model="modalShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" 
                class="close" 
                @click="modalShow=false"
                ><span>×</span></button>
                <h4 class="modal-title" style='float:left'>添加终端</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <div class="data-table table-responsive">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th 
                                @click='checkAllBox(checkAll,1)'
                                v-model='checkAll'            
                                >
                                    <input 
                                    type="checkbox" 
                                    v-model='checkAll'
                                    @click='checkAllBox(checkAll,0)'>全选
                                </th>
                                <th>
                                    VIN   
                                    <input type="text" class='vinInput' v-model='deviceSearchParmas.keyword'>
                                    <a 
                                    href="javascript:;" 
                                    id='searchButton'
                                    @click='search()'
                                    >搜索</a>
                                </th>
                                <th>设备号</th>
                                <th>品牌</th>
                                <th>车主</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr 
                            v-for="(item,index) in deviceList" 
                            :key='item.id'>
                                <td @click='checkSingleBox(item.id)'>
                                    <input 
                                    type="checkbox" 
                                    v-model='item.show'
                                    >
                                </td>
                                <td>{{item.vin}}</td>
                                <td>{{item.deviceSN}}</td>
                                <td>{{item.brandName}}</td>
                                <td>{{item.ownerName}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="pagination-row clearfix">
                    <div class="pull-right pull-left-sm">
                        <zpagenav 
                        :page="vehiclePage.pageIndex" 
                        :page-size="vehiclePage.pageSize"
                        :total="vehiclePage.totalCount" 
                        :max-link="10"
                        :page-handler="vehiclePageHandler"></zpagenav>
                    </div>
                </div>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <i-button @click='selectVin'>确定</i-button>
                <button type="button" class="btn btn-default" 
                @click="modalShow=false">取消</button>
            </div>
        </modal>
        <i-col span="24">
            <ul class="breadcrumb">
                <li>设备管理</li>
                <li>远程控制</li>
            </ul>
        </i-col>
        <i-col span="24" class="mypadding">
            控制命令类型：
            <i-select :model.sync="controlModel" style="width:200px"
            @on-change='returnValue'>
                <i-option v-for="(item,index) in controlList" 
                :key='index'
                :value='item.value'
                >
                    {{item.label}}
                </i-option>
            </i-select>
            <i-button icon="plus" type="ghost" @click="addDevice">添加终端</i-button>
            <i-button icon="android-send" type="ghost" @click="sendOperate">发送指令</i-button>
        </i-col>
        <i-col span="24" v-if='upgradeShow'>
            <Tabs active-key="upgradeData">
                <Tab-pane label="远程升级" key="upgradeData">
                    <div class='col-lg-3 col-md-3 col-sm-12 col-xs-12' v-for='(item,index) in upgradeData' :key='index'>
                        <h6 class='remote-name'>
                            {{ item.name }}
                            <span style='color:#000'>
                                {{ item.warn?item.warn:''}}
                            </span>
                        </h6>
                        <input type="text" 
                        :class="['form-control',item.class?'bd-danger':'']"
                        v-model='upgradeParameter[item.value]' 
                        @blur='upgradeBlur(index,item.value)'>
                        <p :class="['alertMessage',item.class?'alertVisble':'']">
                            <Icon type="alert-circled"></Icon>
                            {{item.message}}
                        </p>
                    </div>
                </Tab-pane>
            </Tabs>   
        </i-col>
        <i-col span="24" v-show="deviceListShow">
            <Tabs active-key="deviceListStorage">
                <Tab-pane label="设备列表" key="deviceListStorage" class="mypadding">
                    <Tag type="border" 
                    closable    
                    v-for="(item,index) in deviceListStorage"
                    :key='item.id'
                    @on-close='handleClose(item.id)'
                    color="blue" 
                    v-if='item.show'
                    >{{item.vin}}</Tag>
                </Tab-pane>
            </Tabs>
        </i-col>
        <i-col span="24">
            <Tabs active-key="processOperate">
                <Tab-pane label="指令执行过程" class="mypadding">
                    <Steps :current="processCurrent" size="small" :status="processStatus">
                        <Step title="待发送"></Step>
                        <Step title="已发送"></Step>
                        <Step title="等待回复"></Step>
                        <Step title="完成"></Step>
                    </Steps>
                </Tab-pane>
            </Tabs>
        </i-col>
        <i-col span="24">
            <Tabs active-key="processOperate">
                <Tab-pane label="执行结果" class="mypadding">
                    <i-table border :columns="operateResultColumns" :data="operateResultDatas"></i-table>
                </Tab-pane>
            </Tabs>
        </i-col>
    </Row>
</template>
<style scoped>
    .mypadding {
        padding: 20px;
    }
    .vinInput{
        color:#000;
        margin-left: 10px;
        border-radius: 5px;
        border:1px #eee solid;

    }
    #searchButton{
        display: inline-block;
        border-radius: 3px;
        color: #666;
        width: 30px;
        background: #fff;
    }
    .bd-danger{
        border:1px red solid;
    }
    .remote-name{
        text-align:center;
        margin-top: 0;
    }
    .alertMessage{
        text-align:center;
        margin-bottom: 5px;
        line-height: 24px;
        color: red;
        opacity: 0;
    }
    .alertVisble{
        opacity: 1;
    }
</style>
<script>
    import {modal} from 'vue-strap';
    import Vue from 'vue';
    export default{
        data(){
            return {
                processCurrent:0,/*指令码*/
                controlList: [
                    {
                        value: 1,
                        label: '远程升级'
                    },
                    {
                        value: 2,
                        label: '车载终端关机'
                    },
                    {
                        value: 3,
                        label: '车载终端复位'
                    },
                    {
                        value: 4,
                        label: '车载终端恢复出厂设置'
                    },
                    {
                        value: 5,
                        label: '限制车辆启动/行驶'
                    }
                ],/*指令命令类型显示*/
                currentSearchId:0, /*当前指令码*/
                controlModel: '',
                operateResultColumns: [
                    {
                        title: 'VIN',
                        key: 'vin'
                    },
                    {
                        title: '指令详情',
                        key: 'instruction'
                    },
                    {
                        title: '结果',
                        key: 'result'
                    }
                ],/*执行结果表头*/
                operateResultDatas: [],/*执行结果*/
                deviceListShow: false,/*设备列表*/
                deviceList:[], /*设备数据-vin码*/
                deviceListLength:0,/*被选中的vin码个数*/
                deviceListStorage:[],/*存储选中的vin码*/
                deviceListBackup:[],/*vin码备份*/
                upgradeData:[
                    {
                        name:'拨号点名称',
                        value:'dialName',
                        flag:false,
                        class:false,
                        message:'拨号点名称不能为空'
                    },
                    {
                        name:'拨号用户名',
                        value:'userName',
                        flag:false,
                        class:false,
                        message:'拨号用户名不能为空'
                    },
                    {
                        name:'拨号密码',
                        value:'passwd',
                        flag:false,
                        class:false,
                        message:'拨号密码不能为空'
                    },
                    {
                        name:'地址',
                        value:'ipAddress',
                        flag:false,
                        class:false,
                        message:'地址不能为空'
                    },
                    {
                        name:'车载终端制造商ID',
                        value:'manufactorId',
                        flag:false,
                        class:false,
                        message:'长度只能是4位'
                    },
                    {
                        name:'硬件版本',
                        value:'hardwareVersion',
                        flag:false,
                        class:false,
                        message:'长度只能是5位'
                    },
                    {
                        name:'固件版本',
                        value:'firmwareVersion',
                        flag:false,
                        class:false,
                        message:'长度只能是5位'
                    },
                    {
                        name:'升级url地址',
                        value:'upateUrlAddress',
                        flag:false,
                        class:false,
                        message:'url地址不能为空'
                    },
                    {
                        name:'端口',
                        warn:'(0 ~ 65531)',
                        value:'port',
                        flag:false,
                        class:false,
                        message:'请填写正确的端口'
                    },
                    {
                        name:'连接到升级服务时限',
                        warn:'(0min ~ 60000min)',
                        value:'connectionTimeOut',
                        flag:false,
                        class:false,
                        message:'时限输入有误'
                    },
                ],/*远程升级*/
                upgradeParameter:{                    
                    dialName:'',
                    userName:'',
                    passwd:'',
                    ipAddress:'',
                    port:'',
                    manufactorId:'',
                    hardwareVersion:'',
                    firmwareVersion:'',
                    upateUrlAddress:'',
                    connectionTimeOut:'',
                    vin:''
                },                
                upgradeShow:false,/*远程升级模块显示*/
                getLocationVehicleListFlag:true,/*点击加载，加载一次就关闭，防止多次请求*/
                modalShow:false,/*弹出层显示*/
                checkAll:false,/*是否全选*/
                vehiclePage:{},/*搜索页码*/
                deviceSearchParmas:{
                    provinceCode:"",
                    cityCode: "",
                    type: "vin",
                    keyword: "",
                    status: "",
                    pageIndex: 1,
                    pageSize: 10,
                    totalCount: 0
                },/*搜索参数*/
                processShow:false,
                vinSearch:'',
                processStatus:''
            }
        },
        watch:{
            currentSearchId(newValue,oldValue){
                /*监听当前的指令码*/
                if( newValue==1 ){
                    this.upgradeShow=true
                }else{
                    this.upgradeShow=false
                }
            },
            deviceListLength(newValue,oldValue){
                /*监听被选中的vin-码个数*/
                if( newValue==0 ){
                    this.deviceListShow=false;
                }
            }
        },
        methods: {
            selectVin(){
                /*弹出层-确定*/
                this.modalShow=false;
                /*选中vin*/
                this.deviceList.forEach( ( item,index )=>{
                    let flag = false
                    if( item.show ){
                        this.deviceListStorage.forEach( (content,count)=>{
                            if( item.id==content.id ){
                                flag=true;
                            }
                        } );
                        if( flag ) return ;
                        this.deviceListLength++;
                        this.deviceListStorage.push(item) 
                    }else{
                        this.deviceListStorage.forEach( (content,count)=>{
                            if( item.id==content.id ){
                                this.deviceListLength--;
                                this.deviceListStorage.splice(count,1)
                            }  ;  
                        } );
                    };
                })
                if( this.deviceListStorage.length!=0 ) this.deviceListShow=true;
            },
            search(){
                /*远程升级-添加终端-搜索*/
                let _this = this;
                _this.deviceList=[];
                _this.$http.get('api/getLocationVehicleList', {params:_this.deviceSearchParmas}).then(function(res){
                    if(res.body.status){
                        let arr = res.body.data
                        if( res.body.data ){
                           arr.forEach( (item,index)=>{ 
                                _this.deviceList.push({
                                            id:item.simId,
                                            vin:item.vin,
                                            brandName:item.brandName,
                                            ownerName:item.ownerName,
                                            deviceSN:item.deviceSN,
                                            show:false
                                        });
                                _this.deviceListStorage.forEach((content,count)=>{
                                    if( item.simId==content.id ){
                                        _this.deviceList[index].show=true;   
                                    }
                                })                   
                            } );
                        };
                        _this.vehiclePage={
                            pageCount:res.body.pageCount,
                            pageIndex:res.body.pageIndex,
                            pageSize:res.body.pageSize,
                            totalCount:res.body.totalCount
                        }
                    }
                });
            },
            addDevice(){
                /*添加终端*/
                this.deviceSearchParmas.keyword='';
                if( this.currentSearchId==0 ){
                    this.$Notice.warning({
                        title:'提醒',
                        desc:'请选择指令类型'
                    });
                    return ;
                };
                this.modalShow=true; /*弹出层开*/
                let _this = this;
                if(this.currentSearchId==1){
                    /*远程升级添加终端*/
                    _this.search();
                };
            },
            sendOperate(){ 
                /*发送指令*/
                this.processStatus='';
                let _this = this ;
                let url = null;
                let params = {};
                if( this.currentSearchId==0 ){
                    this.$Notice.warning({
                        title:'提醒',
                        desc:'请选择指令类型'
                    });
                    return;
                };
                if(this.currentSearchId==1){
                    let sendFlag = true;
                    if( this.deviceListLength==0 ){
                        this.$Notice.warning({
                            title:'提醒',
                            desc:'请添加终端'
                        });
                        return;
                    }
                    this.upgradeData.map( (item,index)=>{
                        if( !item.flag ){
                            sendFlag = false;
                        }
                    } )
                    if( !sendFlag ){
                        this.$Notice.warning({
                            title: '提醒',
                            desc: '请将升级信息填写完整'
                        });
                        return ;
                    }
                    url = 'api/remoteUpdating';
                    params=_this.upgradeParameter;
                    params.post=parseInt( params.post );
                    params.connectionTimeOut=parseInt( params.connectionTimeOut );
                    params.vin='';
                    
                    let storageArr = [];
                    this.deviceListStorage.forEach( (item,index)=>{
                        storageArr.push(item.vin)
                    } )
                    params.vin=storageArr.join(",")
                };
                /*发送*/      
                this.postOperate(url,params,_this.currentSearchId);  

                this.processCurrent=1;
                this.$Notice.success({
                    title: '提示',
                    desc: '发送指令成功！'
                });
            },
            handleClose(id){
                /*关闭设备列表里的标签*/
                var _this = this ;
                this.deviceListStorage.forEach( (item,index)=>{
                    if( item.id==id ){
                        item.show=false;
                        this.deviceListLength--;
                        this.deviceListStorage.splice(index,1);
                    };
                } );
                this.deviceList.forEach( (item,index)=>{
                     if( item.id==id ){
                        item.show=false;
                    };
                } );
            },
            returnValue(value){
                /*返回当前选择的控制命令类型*/
                this.currentSearchId=value;
            },
            checkAllBox(value,flag){
                /*全选*/
                if( flag ){
                    this.checkAll=!this.checkAll;
                }
                this.deviceList.forEach( ( item,index )=>{
                    item.show=!value;
                } );
            },
            checkSingleBox(id){
                /*点击td 选中checkbox*/
                this.deviceList.forEach( ( item,index )=>{
                    if( item.id==id ){
                        item.show=!item.show;                   
                    };
                } );
            },
            vehiclePageHandler(page){
                /*添加终端-搜索-页码*/
                this.deviceSearchParmas.pageIndex=page;
                this.search();
            },
            upgradeBlur(index,value){
                /*失焦验证*/
                switch(index){
                    case 0 : ;
                    case 1 : ; 
                    case 2 : ; 
                    case 3 : ;
                    case 7 : 
                        if(this.upgradeParameter[value]!=''){
                            this.upgradeData[index].class=false;
                            this.upgradeData[index].flag=true;
                        }else{
                            this.upgradeData[index].class=true;
                            this.upgradeData[index].flag=false;
                        };
                        break;
                    case 4 : 
                        if(this.upgradeParameter[value].length==4){
                            this.upgradeData[index].class=false;
                            this.upgradeData[index].flag=true;
                        }else{
                            this.upgradeData[index].class=true;
                            this.upgradeData[index].flag=false;
                        };
                        break;
                    case 5 : ;
                    case 6 :
                        if(this.upgradeParameter[value].length==5){
                            this.upgradeData[index].class=false;
                            this.upgradeData[index].flag=true;
                        }else{
                            this.upgradeData[index].class=true;
                            this.upgradeData[index].flag=false;
                        };  
                        break;
                    case 8 :
                            let reg = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
                            if( reg.test( this.upgradeParameter[value] ) ){
                                this.upgradeData[index].class=false;
                                this.upgradeData[index].flag=true;
                            }else{
                                this.upgradeData[index].class=true;
                                this.upgradeData[index].flag=false;
                            }
                        break;
                    case 9 :
                            let regNum = /^[0-9]+.?[0-9]*$/
                            if( regNum.test( this.upgradeParameter[value] )&&this.upgradeParameter[value].length<=5 ){
                                this.upgradeData[index].class=false;
                                this.upgradeData[index].flag=true;
                            }else{
                                this.upgradeData[index].class=true;
                                this.upgradeData[index].flag=false;
                            }
                        break;    
                    default : return ;
                }
            },
            postOperate(url,params,id){
                this.processCurrent=2;
                this.$http.post(url,params).then( (res)=>{
                    if( res.body.status ){
                        this.operateResultDatas=[];
                        switch( id ){
                            case 1 :
                                res.body.data.forEach( (item,index)=>{
                                    this.operateResultDatas.push({
                                        vin:item.vin,
                                        instruction:'远程升级',
                                        result:item.status=='CMD_SUCCEED'?'成功':'失败'
                                    });
                                } );
                                this.processCurrent=3;
                                break;
                            default : return ;    
                        };
                    }else{
                        this.processStatus='error'
                    };
                } );
            },
            socketGetMsg(){
                /*socket.onopen = function(event) { 
                    // 发送一个初始化消息
                    socket.send(''); 
                    // 监听消息
                    socket.onmessage = function(event) { 
                        console.log('从服务器接收信息',event.data); 
                    };
                    //执行指令过程完成
                    this.processCurrent=3;
                    // 监听Socket的关闭
                    socket.onclose = function(event) { 
                        console.log('关闭socket',event); 
                    }; 
                    // 关闭Socket.... 
                    socket.close();
                };*/
            }
        },
        components:{
            modal
        },
        created(){            
            /*let socket = new WebSocket("");*/
            
        }
    }
</script>