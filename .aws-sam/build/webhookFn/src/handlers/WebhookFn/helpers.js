const dynamodb = new AWS.DynamoDB.DocumentClient();

async function handlePendingSignature(key, payload) {
    // Perform actions for a pending signature
    // Example: Send an email to the subject requesting authorization
    console.log('Consultation authorization is pending');
}

async function handleConsulted(key, payload) {
    // Perform actions with the retrieved data
    // Example: Send an email with the result document to the subject
    console.log('Consultation was successful');
}

async function handleRejected(key, payload) {
    // Perform actions for a rejected consultation
    // Example: Log the rejection details
    console.log('Consultation was rejected');
}

module.exports ={
    handlePendingSignature,
    handleConsulted,
    handleRejected
}
