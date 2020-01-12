/* eslint-disable */
import React from 'react';
import Layout from '../components/Layout';
import ArticleBlockLink from '../components/ArticleBlockLink';
import { graphql } from 'gatsby';

const IndexPage = ({ data }) => {
  return (
    <Layout>
      {data.allNotionPageBlog.edges.map(edge => (
        <ArticleBlockLink
          title={edge.node.title}
          link={`/article/${edge.node.slug}`}
          excerpt={edge.node.excerpt}
          icon={edge.node.pageIcon}
        />
      ))}
    </Layout>
  );
};

export default IndexPage;

export const query = graphql`
  query {
    allNotionPageBlog(
      filter: { isDraft: { eq: false } }
      sort: { fields: [indexPage], order: DESC }
    ) {
      edges {
        node {
          linkedPages {
            pageId
            title
          }
          pageId
          title
          indexPage
          isDraft
          createdAt
          slug
          excerpt
          pageIcon
        }
      }
    }
  }
`;
