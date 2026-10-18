import amqp from 'amqplib';

const consumerNewVideoNotification = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const exchangeName = 'header_exchange';
        const exchangeType = 'headers';

        await channel.assertExchange(exchangeName, exchangeType, { durable: false });
        console.log(`Exchange '${exchangeName}' of type '${exchangeType}' created successfully.`);

        const queue = await channel.assertQueue("", { exclusive: true });
        console.log(`Queue '${queue.queue}' created successfully.`);


        await channel.bindQueue(queue.queue, exchangeName, "", {
            "x-match": 'any',
            "notification-type-comment": 'comment',
            "notification-type-like": 'like',
        });

        channel.consume(queue.queue, (message) => {
            if (message !== null) {
                console.log(`Received message: ${message.content.toString()}, ${message}`);
                channel.ack(message);
            }
        });

    } catch (error) {
        console.error('Error in HeaderExchangeFunction:', error);
    }
}

consumerNewVideoNotification()