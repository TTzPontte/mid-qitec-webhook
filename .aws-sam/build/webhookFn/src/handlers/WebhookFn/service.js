const dynamodb = new AWS.DynamoDB.DocumentClient();

async function storeWebhookEvent(eventId, status, payload) {
    const tableName = process.env.EVENT_TABLE;

    const params = {
        TableName: tableName, Item: {
            eventId, status, payload: JSON.stringify(payload),
        },
    };

    try {
        await dynamodb.put(params).promise();
    } catch (error) {
        console.error('Error storing webhook event:', error);
        throw new Error('Failed to store webhook event');
    }
}

module.exports = {
    storeWebhookEvent
}
