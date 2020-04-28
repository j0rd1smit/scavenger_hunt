const basicAuth = require('express-basic-auth');


export const userAuth = basicAuth({
    users: {
        'jordi': '78965412',
        'jack': 'strandman#70',
        'els': 'strandman#70',
        'merel': 'verjaardag',
        'user1': 'user1',
        'user2': 'user2',
        'user3': 'user3',
        'user4': 'user4',
        'user5': 'user5',
        'user6': 'user6',
        'user7': 'user7',
        'user8': 'user8',
        'user9': 'user9',
        'user10': 'user10',
    },
    unauthorizedResponse: {
        error: "Unauthorized",
        message: "You are not authorized for this.",
    }
});