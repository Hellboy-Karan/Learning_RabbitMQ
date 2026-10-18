import amqp from 'amqplib';

const smsNotification = async () => {
    try{
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchange = "new_products_lunch";
        const exchangeType = "fanout";

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        const queue = await channel.assertQueue("", {exclusive: true});
        console.log(`Waiting for messages in queue:`, queue);

        await channel.bindQueue(queue.queue, exchange, "");

        await channel.consume(queue.queue, (msg) => {
            if(msg !== null) {
                const product = JSON.parse(msg.content.toString());
                console.log(`PUSH Notification: New product announced - ${product.name} at $${product.price}`);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("Error announcing new products:", error);
    }
}

smsNotification();