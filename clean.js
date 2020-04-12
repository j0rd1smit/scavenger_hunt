const fsExtra = require('fs-extra')

const directories = ["build", "dist"];

directories.forEach(directory => {
    fsExtra.emptyDirSync(directory);
});

