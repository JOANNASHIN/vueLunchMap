module.exports= {
    // lintOnSave: process.env.NODE_ENV !== 'production', //"warning"
    
    css: {
        loaderOptions: {
            scss: {
                additionalData: `@import "~@/styles/app.scss";`
            }
        }
    }
}