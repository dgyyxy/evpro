<template>
    <div>
        <ul class="breadcrumb">
            <li>首页</li>
            <li>车辆位置监控</li>
            <li>电子围栏</li>
        </ul>
        <div class="smart-widget">
            <div class="smart-widget-inner">
                <div class="smart-widget-body">
                    <form class="form-inline no-margin">
                        <div class="form-group">
                            <label class="sr-only">type</label>
                            <select class="form-control" v-model="type">
                                <option v-for="type in typeList" v-bind:value="type.value">{{type.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="sr-only">关键字</label>
                            <input type="text" class="form-control" placeholder="关键字" v-model="keyword" />
                        </div>
                        <span>&nbsp;&nbsp;行政区域：</span>
                        <div class="form-group">
                            <label class="sr-only">province</label>
                            <select class="form-control" v-model="province">
                                <option v-for="province in provinceList" v-bind:value="province.value">{{province.name}}</option>
                            </select>
                        </div>
                        &nbsp;&nbsp;
                        <div class="form-group">
                            <label class="sr-only">city</label>
                            <select class="form-control" v-model="city">
                                <option v-for="city in cityList" v-bind:value="city.value">{{city.name}}</option>
                            </select>
                        </div>
                        &nbsp;&nbsp;
                        <div class="form-group">
                            <label class="sr-only">district</label>
                            <select class="form-control" v-model="district">
                                <option v-for="district in districtList" v-bind:value="district.value">{{district.name}}</option>
                            </select>
                        </div>
                        &nbsp;&nbsp;
                        <button type="button" class="btn btn-sm btn-success float-r" v-on:click="addFence">新增围栏</button>
                        <button type="button" class="btn btn-sm btn-success float-r margin-r10" v-on:click="search">搜索</button>
                    </form>
                </div>
            </div>
        </div>
        <div class="data-table table-responsive">
            <table class="table table-condensed table-hover table-bordered" id="dataTable">
                <thead>
                <tr>
                    <th>vin</th>
                    <th>车牌号</th>
                    <th>车主姓名</th>
                    <th>行政区围栏</th>
                    <th>围栏类型</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="account in accountRe.data">
                    <td>{{account.vin}}</td>
                    <td>{{account.loanVehicleLicense}}</td>
                    <td>{{account.loanVehicleOwner}}</td>
                    <td>北京-北京市-朝阳区</td>
                    <td>出围栏报警</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination-row clearfix">
            <div class="pull-right pull-left-sm">
                <zpagenav :page="pageIndex", :page-size="pageSize", :total="totalCount", :max-link="maxLink" :page-handler="pageHandler"></zpagenav>
            </div>
        </div>

        <modal v-model="accountModalShow" large cancel-text="取消" ok-text="下一步" :callback="chooseAccount">
            <div slot="modal-header" class="modal-header">
                <h4 class="modal-title">新增围栏 / 选择账号</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form class="form-inline no-margin">
                    <div class="form-group">
                        <label class="sr-only">type</label>
                        <select class="form-control" v-model="typeVehicle">
                            <option v-for="type in typeList" v-bind:value="type.value">{{type.name}}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="sr-only">关键字</label>
                        <input type="text" class="form-control" placeholder="关键字" v-model="keywordVehicle" />
                    </div>
                    &nbsp;&nbsp;
                    <button type="button" class="btn btn-sm btn-success" v-on:click="searchVehicle">搜索</button>
                </form>
                <br/>
                <div class="data-table table-responsive">
                    <table class="table table-condensed table-hover table-bordered">
                        <thead>
                        <tr>
                            <th></th>
                            <th>VIN</th>
                            <th>车牌号</th>
                            <th>车主姓名</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="vehicle in vehicleRe.data" v-on:click="checkVin(vehicle.contractSN)" style="cursor: pointer;">
                            <td><input type="radio" name="vehicleVin" v-model="vehicleVin" value="{{vehicle.contractSN}}"></td>
                            <td>{{vehicle.vin}}</td>
                            <td>{{vehicle.licensePlate}}</td>
                            <td>{{vehicle.ownerName}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="pagination-row clearfix">
                    <div class="pull-right pull-left-sm">
                        <zpagenav :page="pageIndexVehicle", :page-size="pageSizeVehicle", :total="totalCountVehicle", :max-link="maxLinkVehicle" :page-handler="pageHandlerVehicle"></zpagenav>
                    </div>
                </div>
            </div>
        </modal>
        <modal v-model="districtModalShow" large cancel-text="取消" ok-text="上一步" :callback="chooseAccount">
            <div slot="modal-header" class="modal-header">
                <h4 class="modal-title">新增围栏 / 选择行政区域</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <div>选择行政区域的内容</div>
                <!--<form class="form-inline no-margin">-->
                    <!--<div class="form-group">-->
                        <!--<label class="sr-only">type</label>-->
                        <!--<select class="form-control" v-model="typeVehicle">-->
                            <!--<option v-for="type in typeList" v-bind:value="type.value">{{type.name}}</option>-->
                        <!--</select>-->
                    <!--</div>-->
                    <!--<div class="form-group">-->
                        <!--<label class="sr-only">关键字</label>-->
                        <!--<input type="text" class="form-control" placeholder="关键字" v-model="keywordVehicle" />-->
                    <!--</div>-->
                    <!--&nbsp;&nbsp;-->
                    <!--<button type="button" class="btn btn-sm btn-success" v-on:click="searchVehicle">搜索</button>-->
                <!--</form>-->
                <!--<br/>-->
                <!--<div class="data-table table-responsive">-->
                    <!--<table class="table table-condensed table-hover table-bordered">-->
                        <!--<thead>-->
                        <!--<tr>-->
                            <!--<th></th>-->
                            <!--<th>VIN</th>-->
                            <!--<th>车牌号</th>-->
                            <!--<th>车主姓名</th>-->
                        <!--</tr>-->
                        <!--</thead>-->
                        <!--<tbody>-->
                        <!--<tr v-for="position in vehicleRe.data" v-on:click="checkVin(position.contractSN)" style="cursor: pointer;">-->
                            <!--<td><input type="radio" name="vehicleVin" v-model="vehicleVin" value="{{position.contractSN}}"></td>-->
                            <!--<td>{{position.vin}}</td>-->
                            <!--<td>{{position.licensePlate}}</td>-->
                            <!--<td>{{position.ownerName}}</td>-->
                        <!--</tr>-->
                        <!--</tbody>-->
                    <!--</table>-->
                <!--</div>-->
                <!--<div class="pagination-row clearfix">-->
                    <!--<div class="pull-right pull-left-sm">-->
                        <!--<zpagenav :page="pageIndexVehicle", :page-size="pageSizeVehicle", :total="totalCountVehicle", :max-link="maxLinkVehicle" :page-handler="pageHandlerVehicle"></zpagenav>-->
                    <!--</div>-->
                <!--</div>-->
            </div>
        </modal>
    </div>
</template>
<style>
</style>
<script>
    import { modal } from 'vue-strap';
    function getAccount(param){
        return this.$http.post('api/getAccount', {
            pageIndex: param.pageIndex,
            pageSize: param.pageSize,
            type: param.type||"",
            companyId: param.companyId||"",
            keyword: param.keyword||""
        }).then(function(response){
            let result = response.body;
            let re = {};
            if(result.status){
                re = {
                    accountRe: result
                };
                this.pageIndex = result.pageIndex;
                this.totalCount = result.totalCount;
            }
            return re;
        });
    }
    function getLoanVehicle(param){
        return this.$http.post('api/getLoanVehicle', {
            pageIndex: param.pageIndex,
            pageSize: param.pageSize,
            type: param.type||"",
            keyword: param.keyword||""
        }).then(function(response){
            let result = response.body;
            let re = {};
            if(result.status){
                re = {
                    vehicleRe: result
                };
                this.pageIndexVehicle = result.pageIndex;
                this.totalCountVehicle = result.totalCount;
            }
            return re;
        });
    }
    export default{
        data(){
            return {
                accountRe: {},
                vehicleRe: {},
                companyList: [],
                pageIndex: 1 ,
                pageIndexVehicle: 1 ,
                pageSize: 10,
                pageSizeVehicle: 4,
                totalCount: 0,
                totalCountVehicle: 0,
                maxLink: 5,
                maxLinkVehicle: 5,
                type: "vin",
                typeVehicle: "vin",
                keyword: "",
                keywordVehicle: "",
                companyId: "",
                province: "sc",
                city: "cd",
                district: "jj",
                typeList: [
                    {
                        name: "Vin",
                        value: "vin"
                    },
                    {
                        name: "车牌号",
                        value: "licensePlate"
                    },
                    {
                        name: "车主姓名",
                        value: ""
                    }
                ],
                provinceList: [
                    {
                        name: "四川省",
                        value: "sc"
                    },
                    {
                        name: "北京市",
                        value: ""
                    },
                    {
                        name: "上海市",
                        value: ""
                    }
                ],
                cityList: [
                    {
                        name: "成都市",
                        value: "cd"
                    },
                    {
                        name: "绵阳市",
                        value: ""
                    },
                    {
                        name: "南充市",
                        value: ""
                    }
                ],
                districtList: [
                    {
                        name: "锦江区",
                        value: "jj"
                    },
                    {
                        name: "武侯区",
                        value: ""
                    },
                    {
                        name: "高新区",
                        value: ""
                    }
                ],
                accountModalShow: false,
                districtModalShow: false,
                vehicleVin: ""
            }
        },
        components: {
            modal
        },
        route: {
            data() {
            }
        },
        methods: {
            pageHandler: function(page) {
                let promise = getAccount.apply(this, [{pageIndex: page, pageSize: this.pageSize}]);
                promise.then(function(data){
                    this.accountRe = data.accountRe;
                });
            },
            pageHandlerVehicle(page){
                let promise = getLoanVehicle.apply(this, [{
                    pageIndex: page,
                    pageSize: this.pageSizeVehicle,
                    type: this.typeVehicle,
                    keyword: this.keywordVehicle
                }]);
                promise.then(function(data){
                    this.vehicleRe = data.vehicleRe;
                });
            },
            search(){
            },
            addFence(){
                this.accountModalShow = true;
            },
            searchVehicle(){

            },
            chooseAccount(){
                if(this.accountModalShow){
                    this.accountModalShow = false;
                    this.districtModalShow = true;
                } else{
                    this.accountModalShow = true;
                    this.districtModalShow = false;
                }
            },
            checkVin(vin){
                this.vehicleVin = vin;
            }
        }
    }
</script>
