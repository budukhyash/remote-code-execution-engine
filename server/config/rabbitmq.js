import * as amqp from 'amqp-connection-manager';
const QUEUE_NAME = 'judge'

const connection = amqp.connect(['amqp://rabbitmq:5672']);

connection.on('connect', function() {
    console.log('Connected!');
});

connection.on('disconnect', function(err) {
    console.log('Disconnected.', err);
});

const channelWrapper = connection.createChannel({
    json: true,
    setup: function(channel) {
        // `channel` here is a regular amqplib `ConfirmChannel`.
        return channel.assertQueue(QUEUE_NAME, {durable: true});
    }
});

export const sendMessage = async (data) => {
    channelWrapper.sendToQueue(QUEUE_NAME, data)
    .then(function() {
        console.log("Message sent");
    })
    .catch(function(err) {
        console.log("Message was rejected:", err.stack);
        channelWrapper.close();
        connection.close();
    });
};

