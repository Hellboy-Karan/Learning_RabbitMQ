import amqp from 'amqplib';

const sendMessage = async (routingKey, message) => {
    try{
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();
        const exchanges = "notification_exchange";
        const exchangeType = "topic";
        const queue = "order_queue"

        await channel.assertExchange(exchanges, exchangeType, { durable: true });
        // we dont required queue and binding here because we are using topic exchange and the consumer will create queue and binding with the exchange

        await channel.assertQueue(queue, {durable: true});
        await channel.bindQueue(queue, exchanges, "order.*") // Make to use either * or # for makeing proper connection with producer

    
        await channel.consume(queue, (messages) => {
            if(messages !== null ){
                console.log(`[Order Nofication] Message consumed from order queue:`, JSON.parse(messages.content.toString()));
                channel.ack(messages)
            }
        })
    } catch(error){
        console.log(error)
    }
}

sendMessage("order.placed", { orderId: 123, status: "placed" });