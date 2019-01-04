<template>
    <Row>
        <i-col span="24">
            <ul class="breadcrumb">
                <li>售后管理</li>
                <li>TBox更换</li>
            </ul>
        </i-col>
        <i-col span="24" style="padding: 20px;">
            请输入VIN：<i-input style="width: 200px;"/>&nbsp;
            请输入TBox编号：<i-input style="width: 200px;"/>&nbsp;
            上报周期：<i-input style="width: 50px;"/>&nbsp;天&nbsp;&nbsp;&nbsp;
            <i-button type="primary" icon="search">查询</i-button>
        </i-col>
        <i-col span="24">
            <Tabs active-key="tboxReplaceKey">
                <Tab-pane key="tboxReplaceKey" label="TBox更换" style="padding: 20px;">
                    <div class="col-md-12" style="margin-top:5px;">
                        <div class="data-table table-responsive">
                            <table class="table table-bordered">
                                <thead>
                                <tr>
                                    <th>车辆VIN</th>
                                    <th>设备编号</th>
                                    <th>SIM卡号</th>
                                    <th>ICCID</th>
                                    <th>操作</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr 
                                    v-for='(item,index) in deviceInfoList' 
                                    :key='index'>
                                    <td>{{item.vin}}</td>
                                    <td>{{item.sn}}</td>
                                    <td>{{item.simNumber}}</td>
                                    <td>{{item.iccid}}</td>
                                    <td><i-button type="ghost" icon="arrow-swap" size="small">更换</i-button></td>
                                </tr>
                                </tbody>
                            </table>
                            <div class="pagination-row clearfix">
                                <div class="pull-right pull-left-sm">
                                <zpagenav :page="searchParams.pageIndex" :total="totalCount" :page-size="searchParams.pageSize" :max-link=5 :page-handler="pageChange"></zpagenav>
                                </div>
                            </div>
                        </div>
                    </div>
                </Tab-pane>
            </Tabs>
        </i-col>
    </Row>
</template>
<style>
</style>

<script>
    export default {
        data(){
            return {
                searchParams: {
                    vin:"",
                    sn:"",
                    days:"7",
                    pageIndex:1,
                    pageSize:0
                },
                deviceInfoList:[],
                totalCount:0,
            }
        },
        methods:{
            startLoad(){
                let _this = this ; 
                _this.deviceInfoList=[];
                _this.$http.get( 'api/queryVehDeviceInfoList',{ parmas:_this.searchParams} ).then((res)=>{
                        _this.deviceInfoList=res.body.data;
                        _this.searchParams.pageSize=res.body.pageSize;
                        _this.totalCount=res.body.totalCount;
                });
            },
            pageChange(page){
                this.searchParams.pageIndex=page;
                this.startLoad();
            }
        },
        mounted(){
            this.startLoad();
        }
    }
</script>