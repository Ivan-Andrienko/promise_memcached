/**
 * Created by ivan on 31.01.17.
 */
"use strict";

const Memcached = require('memcached');
let memcached = new Memcached('127.0.0.1:11211');

module.exports = {
    //curl -v -X POST "http://127.0.0.1:3000/users/2/purchases" -d '{"count":10}' -H "Content-Type: application/json"
    add: (userId, value) => {
        console.log(value.count);
        return new Promise((resolve, reject) => {

            memcached.set(userId, value.count, 0, (err) => {
                if(err){
                    console.log("Can not add data");
                    reject(err);
                }else{
                    console.log("OK, data add");
                    resolve(value);
                }
            });
        });
    },
    //curl -v -X GET "http://127.0.0.1:3000/users/2/purchases"
    getById: (userId) => {
        return new Promise((resolve, reject) => {
            memcached.get(userId, (err, data) => {
                if (err) {
                    reject(new Error("Can not read data"));
                } else {
                    console.log(data);

                    if(typeof data === "undefined"){
                        console.log("Can not read data (empty)");
                        reject();
                    } else{
                        console.log(data);
                        console.log("Ok. Data showed");
                        resolve();
                    }
                }
            });
        });
    },
    //curl -v -X DELETE "http://127.0.0.1:3000/users/2/purchases"
    remove: (userId) => {
        return new Promise((resolve, reject) => {
            memcached.del(userId, (err) => {
                if(err){
                    console.log("Can not delete key");
                    reject(err);
                }else{
                    console.log("Ok. Key deleted");
                    resolve();
                }
            });
        });
    }
};
