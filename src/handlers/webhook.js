const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.webhookHandler = async (event, context) => {
    try {
        const requestBody = JSON.parse(event.body);

        // Extract relevant data from the request body
        const eventId = requestBody.event_id;
        const eventStatus = requestBody.status;

        // Store the event and status in DynamoDB
        await dynamodb
            .put({
                TableName: 'MyEventTable', // Replace with your table name
                Item: {
                    event_id: eventId,
                    status: eventStatus,
                },
            })
            .promise();

        // Return a success response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Event stored successfully' }),
        };
    } catch (error) {
        // Return an error response
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error storing event', error }),
        };
    }
};
