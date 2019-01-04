<template>
    <Row>
        <i-col span="24">
            <ul class="breadcrumb">
                <li>MNO管理</li>
                <li>SIM实时流量查询</li>
            </ul>
        </i-col>
        <i-col span="24" style="padding: 20px;">
            手机号：<i-input style="width: 200px;"/>
            VIN: <i-input style="width: 200px;"/>
            设备编号：<i-input style="width: 200px;"/>
            <i-button type="info" icon="search">查询</i-button>
        </i-col>
        <i-col span="24">
            <Tabs active-key="realDataListKey">
                <Tab-pane key="realDataListKey" label="SIM实时流量信息" style="padding: 20px;">
                    <div class="data-table table-responsive">
                        <table class="table table-bordered">
                            <thead>
                            <tr>
                                <th>SIM号</th>
                                <th>VIN</th>
                                <th>设备编号</th>
                                <th>套餐名称</th>
                                <th>总流量</th>
                                <th>使用流量</th>
                                <th>剩余流量</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </Tab-pane>
            </Tabs>
        </i-col>
    </Row>
</template>
<style scoped>

</style>
<script>

</script>
