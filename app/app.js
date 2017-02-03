/**
 * Created by ivan on 02.02.17.
 */
"use strict";

const Koa = require("koa");
const app = new Koa();
const Router = require("koa-router");
const bodyParser = require('koa-bodyparser');
const router = new Router();
const usersModel = require('./models/model');
const config = require("config");


/**
 * @example curl -v -X GET "http://127.0.0.1:3000/users/2/purchases"
 */
router.get("/users/:id/purchases", async(ctx, next) => {
    ctx.body = await usersModel.getById(ctx.params.id);
});

/**
 * @example
 * curl -v -X POST "http://127.0.0.1:3000/users/2/purchases" -d '{"count":10}' -H "Content-Type: application/json"
 */
router.post('/users/:id/purchases', bodyParser(), async(ctx, next) => {
    let userId = await usersModel.add(ctx.params.id, ctx.request.body);
    if (typeof userId === 'number') {
        ctx.status = 200;
        ctx.body = {"id": userId};
    } else {
        ctx.status = 400;
    }
});
/**
 * @example curl -v -X DELETE "http://127.0.0.1:3000/users/2/purchases"
 */
router.del("/users/:id/purchases", async(ctx, next) => {
    try {
        await usersModel.remove(ctx.params.id)
        ctx.status = 200;
    } catch (e) {
        ctx.status = 400
    }
});


app.use(async(ctx, next) => {
    try {
        await next();
    } catch (e) {
        ctx.body = JSON.stringify({message: e.message});
        ctx.status = 500;
    }
});
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.server.port);
