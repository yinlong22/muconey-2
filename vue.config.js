// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = {
    lintOnSave: false,
    publicPath: process.env.NODE_ENV === 'production'
        ? '/muconey-1-website/' : '/',
    chainWebpack: config => {
        const dir = path.resolve(__dirname, 'src/assets/icons')
        //config是vue吧webpack的API封装了，暴露给我们的一个对象

        config.module
            .rule('svg-sprite')
            .test(/\.svg$/)//文件是以.svg结尾,就遵循这个（svg-sprite）规则
            .include.add(dir).end()//包含icons的目录
            .use('svg-sprite-loader').loader('svg-sprite-loader').options({extract: false}).end()//满足规则后使用这个loader,不需要解析出来的文件
            .use('svgo-loader').loader('svgo-loader')
            .tap(options => ({...options, plugins: [{removeAttrs: {attrs: 'fill'}}]}))//发现加载了svg，如果里面有fill属性就删除
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        config.plugin('svg-sprite').use(require('svg-sprite-loader/plugin'), [{plainSprite: true}])
        config.module.rule('svg').exclude.add(dir)//其他svg loader排除icons目录
    }
}
