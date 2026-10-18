import amqp from 'amqplib';

const sendMessage = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();

        const exchanges = "prority_exchange";
        const queue = "prority_queue";
        const routingKey = "prority_key";

        await channel.assertExchange(exchanges, "direct", { durable: true }); // use topic also
        await channel.assertQueue(queue, {
            durable: true,
            arguments: { "x-max-priority": 10 }
        });
        await channel.bindQueue(queue, exchanges, routingKey);

        const data = [
            { message: "Low priority message", priority: 1 },  // - fourth to be consumed
            { message: "Low priority message", priority: 8 }, // - second to be consumed
            { message: "Medium priority message", priority: 5 }, // - third to be consumed
            { message: "High priority message", priority: 10 } // - first to be consumed
        ]

        data.sort((a, b) => b.priority - a.priority).map(async ( message) => {
            channel.publish(exchanges, routingKey, Buffer.from(JSON.stringify(message)), { persistent: true, priority: message.priority });
        })

        console.log(`All messages sent`);

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.log(error)
    }
}

sendMessage();