module.exports = {
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "The Happy Body Tracker";
      return args;
    });
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/scss/_global-variables.scss";
        `,
      },
    },
  },
};
