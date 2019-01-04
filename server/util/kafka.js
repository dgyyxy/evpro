/**
 * Created by ly_wu on 2017/6/7.
 */
'use strict';
const kafka = require('kafka-node');
const Consumer = kafka.Consumer;
const Client = kafka.Client;
const Offset = kafka.Offset;


function kfk() {
    let client = new Client("139.224.211.163:2181");
    let offset = new Offset(client);
    let consumer = new Consumer(
        client,
        [
            {topic: 'test', partition: 1}, {topic: 'test', partition: 0}
        ],
        {
            autoCommit: true,
            autoCommitMsgCount: 100,
            autoCommitIntervalMs: 1000,
            fetchMaxWaitMs: 100,
            fetchMinBytes: 1,
            fetchMaxBytes: 1024 * 10,
            fromOffset: false,
            fromBeginning: false,
            encoding: 'utf8',
            keyEncoding: 'utf8'
        }
    );
    console.log("kafka连接中");
    consumer.on('message', (message) => {
        console.log(message);
    });
    consumer.on('error', function (err) {
        console.log('error', err);
    });
    /*
     * If consumer get `offsetOutOfRange` event, fetch data from the smallest(oldest) offset
     */
    consumer.on('offsetOutOfRange', function (topic) {
        topic.maxNum = 2;
        offset.fetch([topic], function (err, offsets) {
            var min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
            consumer.setOffset(topic.topic, topic.partition, min);
        });
    });
}

module.exports = kfk;
