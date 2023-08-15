module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/demo/' // 為 repo 名稱
    : '/'
}
