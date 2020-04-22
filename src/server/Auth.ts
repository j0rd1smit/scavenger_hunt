const basicAuth = require('express-basic-auth');


export const userAuth = basicAuth({
    users: {
        'jordi': '78965412',
/*        'jack': 'strandman#70',
        'els': 'strandman#70',
        'merel': 'verjaardag',*/
    },
    unauthorizedResponse: {
        error: "Unauthorized",
        message: "You are not authorized for this.",
    }
});