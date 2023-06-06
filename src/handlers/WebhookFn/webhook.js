const AWS = require('aws-sdk');
const {handlePendingSignature, handleConsulted, handleRejected, storeWebhookEvent} = require("./service");

exports.handler = async (event) => {
    try {
        const payload = JSON.parse(event.body);
        const {status, key, data} = payload;

        switch (status) {
            case 'PENDING_SIGNATURE':
                await handlePendingSignature(key, payload);
                break;
            case 'CONSULTED':
                await handleConsulted(key, payload);
                break;
            case 'REJECTED':
                await handleRejected(key, payload);
                break;
            default:
                throw new Error('Unknown status in the webhook payload');
        }

        await storeWebhookEvent(key, status, payload);

        return createSuccessResponse('Webhook processed successfully');
    } catch (error) {
        console.error('Error processing webhook:', error);
        return createErrorResponse('Error processing webhook');
    }
};

