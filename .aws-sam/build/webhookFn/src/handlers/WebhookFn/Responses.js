

function createSuccessResponse(message) {
    return {
        statusCode: 200,
        body: JSON.stringify({
            status: 'success',
            message,
        }),
    };
}

function createErrorResponse(message) {
    return {
        statusCode: 400,
        body: JSON.stringify({
            status: 'error',
            message,
        }),
    };
}
