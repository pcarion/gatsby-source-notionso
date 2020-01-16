/* eslint-disable */

exports.createPages = async ({ graphql, actions, reporter }, options) => {
  const { createPage } = actions;

  const pageTemplate = require.resolve('./src/templates/page.js');

  const result = await graphql(
    `
      query {
        allNotionPageBlog {
          edges {
            node {
              pageId
              slug
            }
          }
        }
      }
    `,
  );
  if (result.errors) {
    reporter.panic('error loading events', result.errors);
    return;
  }

  result.data.allNotionPageBlog.edges.forEach(({ node }) => {
    const path = `/gatsby-source-notionso/${node.slug}`;
    createPage({
      path,
      component: pageTemplate,
      context: {
        pathSlug: path,
        pageId: node.pageId,
      },
    });
  });
};
