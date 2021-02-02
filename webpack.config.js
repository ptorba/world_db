const path = require('path');

module.exports = {
    entry: './js_src/app.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'world_db', 'static'),
    },
    resolve: {
        alias: {
            "react": "preact/compat",
            "react-dom/test-utils": "preact/test-utils",
            "react-dom": "preact/compat",
            // Must be below test-utils
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            }
        ],
    }
};