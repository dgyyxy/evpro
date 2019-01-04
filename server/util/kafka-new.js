const Kafka = require('node-rdkafka');
let consumer = new Kafka.KafkaConsumer({
    'group.id': 'kafka',
    'metadata.broker.list': '10.42.201.161:9092',
    'rebalance_cb': function(err, assignment) {
        if (err.code === Kafka.CODES.ERRORS.ERR__ASSIGN_PARTITIONS) {
            // Note: this can throw when you are disconnected. Take care and wrap it in
            // a try catch if that matters to you
            this.assign(assignment);
        } else if (err.code == Kafka.CODES.ERRORS.ERR__REVOKE_PARTITIONS){
            // Same as above
            this.unassign();
        } else {
            // We had a real error
            console.error(err);
        }
    },
    'offset_commit_cb': function(err, topicPartitions) {

        if (err) {
            // There was an error committing
            console.error(err);
        } else {
            // Commit went through. Let's log the topic partitions
            console.log(topicPartitions);
        }

    }
});

// Non-flowing mode
consumer.connect();

consumer
    .on('ready', function() {
        // Subscribe to the librdtesting-01 topic
        // This makes subsequent consumes read from that topic.
        consumer.subscribe(['test']);

        // Read one message every 1000 milliseconds
        setInterval(function() {
            consumer.consume(1);
        }, 1000);
    })
    .on('data', function(data) {
        console.log('Message found!  Contents below.');
        console.log(data.message.toString());
    });