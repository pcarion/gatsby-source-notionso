module.exports = {
  siteMetadata: {
    title: 'gatsby-plugin-notionso example site',
    description: 'how to use gatsby-plugin-notionso',
    basePath: '/',
  },
  plugins: [
    {
      resolve: 'gatsby-source-notionso',
      options: {
        name: 'Blog',
        rootPageUrl:
          'https://www.notion.so/gatsby-source-notionso-80562eadd8334396a905c372791cbf1b',
        debug: false,
      },
    },
  ],
};
