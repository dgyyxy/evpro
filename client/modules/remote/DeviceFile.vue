<template>
    <div>
        <ul class="breadcrumb">
            <li>设备管理</li>
            <li>设备升级文件管理</li>
        </ul>
        <div class="smart-widget">
            <div class="smart-widget-inner">
                <div class="smart-widget-body">
                    <form class="form-inline" onsubmit="return false">
                        <div class="form-group">
                            <label class="control-label label-name">版本号：</label>
                            <input type="text" class="form-control input-sm" v-model="findDeviceFileParam.keyword" placeholder="关键字"/>
                        </div>
                        <button type="button" class="btn btn-sm btn-success" @click="findDeviceFile">搜索</button>
                        <button type="button" class="btn btn-sm btn-success fr" @click="addDeviceFile">新增</button>
                    </form>
                </div>
            </div>
        </div>
        <div class="data-table table-responsive">
            <table class="table table-bordered">
                <thead>
                <tr>
                    <th>版本号</th>
                    <th>版本描述</th>
                    <th>创建时间</th>
                    <th>版本文件</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="deviceFile in deviceFileList">
                    <td>{{deviceFile.version}}</td>
                    <td>{{deviceFile.description}}</td>
                    <td>{{deviceFile.createTime | DateFilter}}</td>
                    <td>{{deviceFile.deviceFile}}</td>
                    <td>
                        <a href="javascript:void(0)" v-on:click="">编辑</a>
                        <a href="javascript:void(0)" v-on:click="">删除</a>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination-row clearfix">
            <div class="pull-right pull-left-sm">
                <zpagenav :page="findDeviceFileParam.pageIndex" :page-size="findDeviceFileParam.pageSize" :total="totalCount" :max-link="maxLink" :page-handler="pageHandler"></zpagenav>
            </div>
        </div>
        <alert v-model="alert.isShow" placement="top" duration="3000" :type="alert.type" width="400px" dismissable
               class="prompt-alert-box">
            <span class="icon-info-circled alert-icon-float-left"></span>
            <p v-text="alert.content"></p>
        </alert>
    </div>
</template>
<script>
    import {modal,alert} from 'vue-strap';
    export default {
        data () {
            return {
                alert: {
                    isShow: false
                },
                maxLink: 5,
                totalCount: 0,
                findDeviceFileParam: {
                    keyword: "",
                    pageIndex:1,
                    pageSize:10
                },
                deviceFileList: [
                    {
                        version: "v1.0.1",
                        description: "终端1.0.1版本",
                        createTime: "1497945173991",
                        deviceFile: "版本文件.zip",
                    },
                    {
                        version: "v1.0.5",
                        description: "终端1.0.5版本",
                        createTime: "1497945173991",
                        deviceFile: "版本文件.zip",
                    },
                    {
                        version: "v1.0.12",
                        description: "终端1.0.12版本",
                        createTime: "1497945173991",
                        deviceFile: "版本文件.zip",
                    }
                ]
            }
        },
        components: {
            modal,
            alert
        },
        methods: {
            findDeviceFile(){

            },
            addDeviceFile(){

            },
            pageHandler(pageIndex){

            }
        }
    }
</script>