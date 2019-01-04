"use strict";
const path          = require("path");
const router        = require("koa-router")();
const config        = require(path.join(process.cwd(), "server/config"));
const brandConfig   = require(path.join(process.cwd(), "server/brand-map.json"));

router.get("/config",async function(ctx,next){
    let _this = ctx;
    _this.body = brandConfig[config.brand];
});

module.exports = router;