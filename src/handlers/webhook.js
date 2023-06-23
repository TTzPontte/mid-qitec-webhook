const dynamodb = require('aws-sdk/clients/dynamodb');
const uuid = require("uuid");

const docClient = new dynamodb.DocumentClient();
const tableName = process.env.SAMPLE_TABLE;

exports.webhookHandler = async (event) => {
    const { body, httpMethod, path } = event;
    if (httpMethod !== 'PUT') {
        throw new Error(`postMethod only accepts POST method, you tried: ${httpMethod} method.`);
    }
    console.log('received:', JSON.stringify(event));

    const {  webhook_type , event_datetime, key, status} = JSON.parse(body);

    const params = {
        TableName: tableName,
        Item: {
            id: uuid.v4(),
            webhook_type,
            event_datetime,
            status,
            key
        },
    };
    await docClient.put(params).promise();

    const response = {
        statusCode: 200,
        body,
    };

    console.log(`response from: ${path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
