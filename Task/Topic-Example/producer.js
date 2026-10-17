import amqp from 'amqplib';

const sendMessage = async (routingKey, message) => {
    try{
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();
        const exchanges = "notification_exchange";
        const exchangeType = "topic";

        await channel.assertExchange(exchanges, exchangeType, { durable: true });
        // we dont required queue and binding here because we are using topic exchange and the consumer will create queue and binding with the exchange

        channel.publish(exchanges, routingKey, Buffer.from(JSON.stringify(message)), { persistent: true });
        console.log(`Message sent to routing key: ${routingKey}, message: ${JSON.stringify(message)}`);
        console.log(`Message sent to exchange: ${exchanges}, routing key: ${routingKey}, message: ${JSON.stringify(message)}`);

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch(error){
        console.log(error)
    }
}

sendMessage("order.placed", { orderId: 123, status: "placed" });
sendMessage("payment.placed", { paymentId: 123, status: "paid", amount: 1000 });