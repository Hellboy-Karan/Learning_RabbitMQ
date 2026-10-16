import amqp from 'amqplib';

async function recvMail(){
    try{
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();

        console.log("Waiting for messages in Normal User queue...");
        const queue_str = "rahul@yopmail.com_xyz"; // here supposed to be a queue name

        await channel.assertQueue(queue_str, { durable: true });
        await channel.consume(queue_str, (message) => {
            if(message !== null) {
                console.log("Message received from Normal User queue:", JSON.parse(message.content.toString()));
                channel.ack(message);
            }
        });
    } catch(error){
        console.log(error)
    }
}

recvMail()