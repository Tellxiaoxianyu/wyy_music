module.exports = {
    devServer: {
        port: 8888,
        proxy: {
            'api': {
                target: 'http://10.64.190.75:3000',
                changeOrigin: true,
                pathRewrite: {'^/api': ''}
            }
        }
    }
}