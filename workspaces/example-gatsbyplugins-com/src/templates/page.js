/* eslint-disable */

import React from 'react';
import { graphql } from 'gatsby';
import notionRendererFactory from 'gatsby-source-notionso/lib/renderer';
import Layout from '../components/Layout';
import NotionBlockRenderer from '../components/notionBlockRenderer';

const Template = ({ data, pageContext }) => {
  const notionRenderer = notionRendererFactory({
    notionPage: data.notionPageBlog,
  });
  return (
    <Layout meta>
      <NotionBlockRenderer
        data={data}
        renderer={notionRenderer}
        debug={false}
      />
    </Layout>
  );
};

export const query = graphql`
  query($pageId: String!) {
    notionPageBlog(pageId: { eq: $pageId }) {
      blocks {
        blockId
        blockIds
        type
        attributes {
          att
          value
        }
        properties {
          propName
          value {
            text
            atts {
              att
              value
            }
          }
        }
      }
      imageNodes {
        imageUrl
        localFile {
          publicURL
        }
      }
      pageId
      slug
      title
      isDraft
      id
      indexPage
    }
  }
`;

export default Template;
