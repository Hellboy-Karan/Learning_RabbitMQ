import amqp from 'amqplib';

const HeaderExchangeFunction = async (header, message) => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const exchangeName = 'header_exchange';
        const exchangeType = 'headers';

        await channel.assertExchange(exchangeName, exchangeType, { durable: false });
        console.log(`Exchange '${exchangeName}' of type '${exchangeType}' created successfully.`);

        channel.publish(exchangeName, "", Buffer.from(message), {
            persistent: true, // if server crashes, then it will update into local server disk.
            headers: header
        })

        console.log(`Message sent to exchange '${exchangeName}': ${message}`);

        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error('Error in HeaderExchangeFunction:', error);
    }
}

HeaderExchangeFunction({ "x-match": 'all', "notification-type": 'new_video', "content-type": 'video' }, '1111 New Music video uploaded.');
HeaderExchangeFunction({ "x-match": 'all', "notification-type": 'live_stream', "content-type": 'gaming' }, '2222 Gaming live stream started.');
HeaderExchangeFunction({ "x-match": 'any', "notification-type-comment": 'comment', "content-type": 'vlog' }, '3333 New Comment on your blog post.');
HeaderExchangeFunction({ "x-match": 'any', "notification-type-like": 'like', "content-type": 'vlog' }, '4444 New Comment Likes on your blog');
