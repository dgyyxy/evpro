<template>
    <Row>
        <i-col span="24" class="mypadding">
            车辆VIN：数据采集时间：{{new Date(uploadTime).toLocaleString()}}
        </i-col>
        <i-col span="24">
            <Tabs active-key="vehicleDatas">
                <Tab-pane label="全部数据" key="vehicleDatas" class="mypadding">
                   <div class='vehicle-container'>
                        <div :class='(index+1)%2==0?"col-lg-6 col-md-12 col-sm-12 col-xs-12 tableCellTxtBrn":"col-lg-6 col-md-12 col-sm-12 col-xs-12 tableCellTxt"'
                        v-for='(item,index) in vehicleDatas' :key='index'>
                            {{item.code | VehicleCodeFilter(item.code)}}:
                            {{item.value | VehicleDataFilter( item.code , item.data )}}
                        </div>
                    </div> 
                    <!-- <table class="table table-bordered">
                        <tbody>
                            <tr v-for='(item,index) in vehicleDatas' :key='index'>
                                <td>
                                    {{item.code | VehicleCodeFilter(item.code)}}:{{item.value | VehicleDataFilter( item.code , item.data )}}
                                </td>
                            </tr>
                        </tbody>
                    </table> -->
                </Tab-pane>
            </Tabs>
        </i-col>
    </Row>
</template>
<style scoped>
    .mypadding{
        padding: 20px;
    }
    .vehicle-container{
        overflow: hidden;
        border:1px #aaa solid;
    }
    
    .tableCellTxt{
    text-align: center;
    line-height: 35px;
    border-bottom:1px #aaa solid;
    border-right: 1px #aaa solid;
    }
    .tableCellTxtBrn{
        text-align: center;
        line-height: 35px;
        border-bottom:1px #aaa solid;
    }
    
</style>
<script>
    import Vue from 'vue';
    import {mapGetters} from 'vuex'
    export default{
        data(){
            return {
                allDataColumns: [
                    {
                        title: '参数名称',
                        key: 'paramName'
                    },
                    {
                        title: '参数值',
                        key: 'paramValue'
                    }
                ],
                allDatas:[],
                vehicleDatas:{},
                uploadTime:0,
                upLoadParams:{
                    uploadContent:''
                }
            }
        },
        methods: {
            
        },
        computed:{
            ...mapGetters(['uploadContentValue'])
        },
        beforeMount(){
            let _this = this;
            _this.$http.get('api/findVehicleDetectionData', {params: _this.upLoadParams}).then((res) => {
                _this.uploadTime = res.body.data.uploadTime;
                _this.vehicleDatas=res.body.data.items;
            });
            for( var i = 0;i<_this.vehicleDatas.length;i++ ){
                _this.vehicleDatas[i].value
            }
        },
        created(){
            this.upLoadParams.uploadContent=this.uploadContentValue
        },
        components:{
        }   
    }
</script>