//                     .::::.
//                   .::::::::.
//                  :::::::::::
//               ..:::::::::::'
//            '::::::::::::'
//              .::::::::::
//         '::::::::::::::..
//              ..::::::::::::.
//            ``::::::::::::::::
//             ::::``:::::::::'        .:::.
//            ::::'   ':::::'       .::::::::.
//          .::::'      ::::     .:::::::'::::.
//         .:::'       :::::  .:::::::::' ':::::.
//        .::'        :::::.:::::::::'      ':::::.
//       .::'         ::::::::::::::'         ``::::.
//   ...:::           ::::::::::::'              ``::.
//  ````':.          ':::::::::'                  ::::..
//                     '.:::::'                    ':'````..

//                  女神保佑 代码无bug

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // 关闭语法检查
  lintOnSave: false,
  devServer: {
    port: 8080,
    host: '127.0.0.1',
    https: false,
    open: false,
    allowedHosts: 'all'
  },
  transpileDependencies: true,
  // 其他webpack配置
  chainWebpack: (config) => {

  },
  configureWebpack: {
    externals: {
      qc: 'QC'
    }
  },
})