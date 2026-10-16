
// This is for Single Producer and Multiple Consumer
// const amqp = require('amqplib');
import amqp from 'amqplib';

async function sendMail(data) {
    try {
        // connecting to the rabbitmq server
        const connection = await amqp.connect("amqp://localhost:5672")

        // creating a channel
        const channel = await connection.createChannel();

        // creating a queue
        const exchanges = "mail_exchange_1";
        const message = {
            to: "rahul1@yopmail.com",
            from: "sender1@yopmail.com",
            subject: "Test Email 1111 vvv",
            body: "This is mmmmmm testing phase for con consumer .js."
        }

        const queue_str = `${message.to}_xyz`;
        const routingKey = `${message.to}_send`;
        // const sendEmailToSubscriberUser = "send_mail_to_subscriber_user";
        // const sendEmailToNormalUser = "send_mail_to_user";

        // # we created exchanges here
        await channel.assertExchange(exchanges, 'direct', { durable: true });

        // Now we are creating queue here
        await channel.assertQueue(queue_str, { durable: true });
        
        // await channel.assertQueue("subscriber_user_mail_queue", { durable: true });
        // await channel.assertQueue("user_mail_queue", { durable: true });

        // Now we are binding the queue to the exchange with a routing key    
        await channel.bindQueue(queue_str, exchanges, routingKey);

        // await channel.bindQueue("subscriber_user_mail_queue", exchanges, sendEmailToSubscriberUser);
        // await channel.bindQueue("user_mail_queue", exchanges, sendEmailToNormalUser);

        // Now we are publishing the message to the exchange with a routing key
        channel.publish(exchanges, routingKey, Buffer.from(JSON.stringify(message)), { persistent: true });
        // channel.publish(exchanges, sendEmailToSubscriberUser, Buffer.from(JSON.stringify(message)), { persistent: true });
        // channel.publish(exchanges, sendEmailToNormalUser, Buffer.from(JSON.stringify(message)), { persistent: true });

        console.log(`Message sent to routing key: ${routingKey}, message: ${JSON.stringify(message)}`);

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.log(error)
    }
}

await sendMail()


// This is for Single Producer and Single Consumer
//  const amqp = require('amqplib'); 
// import amqp from 'amqplib';

// async function sendMail(data) {
//     try {
//         // connecting to the rabbitmq server
//         const connection = await amqp.connect("amqp://localhost:5672")

//         // creating a channel
//         const channel = await connection.createChannel();

//         // creating a queue
//         const exchanges = "mail_exchange_1";
//         const routingKey = "send_mail";
//         const queue_str = "mail_queue";

//         const message = {
//             to: "rahul1@yopmail.com",
//             from: "sender1@yopmail.com",
//             subject: "Test Email 1111 vvv",
//             body: "This is a test email111 nnnnn."
//         }

//         // # we created exchanges here
//         await channel.assertExchange(exchanges, 'direct', { durable: true });

//         // Now we are creating queue here
//         await channel.assertQueue(queue_str, { durable: true });

//         // Now we are binding the queue to the exchange with a routing key    
//         await channel.bindQueue(queue_str, exchanges, routingKey);

//         // Now we are publishing the message to the exchange with a routing key
//         channel.publish(exchanges, routingKey, Buffer.from(JSON.stringify(message)), { persistent: true });
//         console.log(`Message sent to queue: ${queue_str} with routing key: ${routingKey}, message: ${JSON.stringify(message)}`);

//         setTimeout(() => {
//             connection.close();
//         }, 500);
//     } catch (error) {
//         console.log(error)
//     }
// }

// await sendMail()