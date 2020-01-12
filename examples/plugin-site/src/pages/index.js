import React from 'react';
import Layout from 'theme-common/src/components/layout';
import HpArticleBlockLink from 'theme-common/src/components/hpArticleBlockLink';
import { graphql } from 'gatsby';
import useSiteMetadata from '../hooks/use-site-metadata';

const Page = ({ data }) => {
  const meta = useSiteMetadata();
  return (
    <Layout meta={meta}>
      {data.allNotionPageBlog.edges.map(edge => (
        <HpArticleBlockLink
          title={edge.node.title}
          link={`/article/${edge.node.slug}`}
          excerpt={edge.node.excerpt}
          icon={edge.node.pageIcon}
        />
      ))}
    </Layout>
  );
};

export default Page;

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
