import amqp from 'amqplib';

const announceNewProducts = async (product) => {
    try{
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchange = "new_products_lunch";
        const exchangeType = "fanout";

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        await channel.publish(exchange, "", Buffer.from(JSON.stringify(product)));
        console.log(`Announced new product: ${product}`);
        setTimeout(() => {
            connection.close();
        }, 500);

    } catch (error) {
        console.error("Error announcing new products:", error);
    }
}

announceNewProducts({ id:9988, name: "Product A", price: 10.99 });
announceNewProducts({ id:9989, name: "Product B", price: 15.99 });