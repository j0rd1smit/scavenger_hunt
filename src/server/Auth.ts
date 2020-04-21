const basicAuth = require('express-basic-auth');


export const userAuth = basicAuth({
    users: {
        'jordi': '78965412'
    },
    unauthorizedResponse: {
        error: "Unauthorized",
        message: "You are not authorized for this.",
    }
});