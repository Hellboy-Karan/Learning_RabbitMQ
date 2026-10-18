import amqp from 'amqplib';

const consumeIT = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();

        const queue = "prority_queue";

        await channel.assertQueue(queue, {
            durable: true,
            arguments: { "x-max-priority": 10 }
        });

        console.log(`Waiting for messages in queue: ${queue}. To exit press CTRL+C`);

        channel.consume(queue, (message) => {
            if (message !== null) {
                const content = JSON.parse(message.content.toString());
                console.log(`Received message: ${content.message}, priority: ${content.priority}`);
                channel.ack(message);
            }
        });
    } catch (error) {
        console.log(error)
    }
}

consumeIT();