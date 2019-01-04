<template>
    <div id="loading-wrapper">
        <div id="full-screen-loading">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
</template>
<style scoped>
    #loading-wrapper{
        position:fixed;
        width: 100%;
        height:100%;
        background-color: rgba(0,0,0,0.7);
        display: none;
        z-index: 10000;
    }
    #full-screen-loading{
        width: 100px;
        height: 100px;
        position: absolute;
        left:calc(50% - 50px);
        top:calc(50% - 50px);
    }
    #full-screen-loading span{
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #2baab1;
        position: absolute;
        -webkit-animation: load 1.04s ease infinite;
    }
    @-webkit-keyframes load{
        0%{
            -webkit-transform: scale(1.2);
            opacity: 1;
        }
        100%{
            -webkit-transform: scale(.3);
            opacity: 0.5;
        }
    }
    #full-screen-loading span:nth-child(1){
        left: 0;
        top: 50%;
        margin-top:-10px;
        -webkit-animation-delay:0.13s;
    }
    #full-screen-loading span:nth-child(2){
        left: 14px;
        top: 14px;
        -webkit-animation-delay:0.26s;
    }
    #full-screen-loading span:nth-child(3){
        left: 50%;
        top: 0;
        margin-left: -10px;
        -webkit-animation-delay:0.39s;
    }
    #full-screen-loading span:nth-child(4){
        top: 14px;
        right:14px;
        -webkit-animation-delay:0.52s;
    }
    #full-screen-loading span:nth-child(5){
        right: 0;
        top: 50%;
        margin-top:-10px;
        -webkit-animation-delay:0.65s;
    }
    #full-screen-loading span:nth-child(6){
        right: 14px;
        bottom:14px;
        -webkit-animation-delay:0.78s;
    }
    #full-screen-loading span:nth-child(7){
        bottom: 0;
        left: 50%;
        margin-left: -10px;
        -webkit-animation-delay:0.91s;
    }
    #full-screen-loading span:nth-child(8){
        bottom: 14px;
        left: 14px;
        -webkit-animation-delay:1.04s;
    }
</style>
<script>
    export default {
        data () {
            return {}
        },
        created () {

        },
        components: {
        }
    }
</script>