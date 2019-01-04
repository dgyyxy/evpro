<template>
    <Row>
        <i-col span="24">
            <ul class="breadcrumb">
                <li>MNO管理</li>
                <li>流量池管理</li>
            </ul>
        </i-col>
        <i-col span="24">
            <Tabs active-key="poolDataListKey">
                <Tab-pane key="poolDataListKey" label="流量池列表" style="padding: 20px;">
                    <div class="data-table table-responsive">
                        <table class="table table-bordered">
                            <thead>
                            <tr>
                                <th>流量池ID</th>
                                <th>总流量</th>
                                <th>已用流量</th>
                                <th>剩余流量</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><i-button type="ghost" icon="search" size="small">查询</i-button></td>
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
