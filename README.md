# gatsby-source-notionso

A Gatsby source plugin for sourcing data into your [Gatsby](https://www.gatsbyjs.org/) application using [Notion.so](https://www.notion.so) as a backend.

There is not yet an official API to retrieve data for your pages, so this plugin reverse engineered the current API to get access to the content of a page.

## Installation
```sh
$ npm install --save gatsby-source-notionso
```

or

```sh
$ yarn add gatsby-source-notionso
```

## Options
```ts
export interface NotionsoPluginOptions extends PluginOptions {
  rootPageId: string; // the id of the root page
  name: string; // name of your data set to identify the data for the instance of this plugin
  tokenv2?: string; // not used yet (the page needs to be public)
  debug?: boolean; // set to true to enable debugging information
}
```

The plugin will load the page identified by the `rootPageId` but this page will not be rendered: the root page is supposed to contain
references to all the pages you want to retrieve data for.

## How to use?

In your `gatsby-config.js` file:

```
  plugins: [
    {
      resolve: 'gatsby-source-notionso',
      options: {
        name: "<name of your data set>",
        rootPageId: "<your page id>",
        debug: false,
      },
    },
  ],

```

## How to query

### Get all posts

If the name of your data set is `blog`, the following request will allow you to retrieve your data.

```
allNotionPageBlog(filter: {isDraft: {eq: false}}, sort: { fields: [indexPage], order: DESC }) {
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
    }
  }
}
```

### get a single posts

You need 2 requests to get the data required for a page:
- the content of the page itself
- the pugin will download the images in the page and make them available through the `publicURL` attribute

The requests to retrieve a given page is:

```
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
  createdAt
  pageId
  slug
  title
  isDraft
  id
  indexPage
}
allNotionPageAssetBlog(filter: { pageId: { eq: $pageId } }) {
  nodes {
    localFile {
      publicURL
    }
    pageId
    notionUrl
  }
}
}

```


# References

## gatsby source development

* [Pixabay Image Source Plugin Tutorial](https://www.gatsbyjs.org/docs/pixabay-source-plugin-tutorial/)
* [Customizing the GraphQL Schema](https://www.gatsbyjs.org/docs/schema-customization)

## Notion API

* [How I reverse engineered Notion API](https://blog.kowalczyk.info/article/88aee8f43620471aa9dbcad28368174c/how-i-reverse-engineered-notion-api.html)

Various Notion API implementations:
 * in [Go](https://github.com/kjk/notionapi)
 * in [Python](https://github.com/jamalex/notion-py)
 * in [Kotlin](https://github.com/petersamokhin/knotion-api)

## Other source plugin for Gatsby

* [rich-text-react-renderer for contentful source](https://github.com/contentful/rich-text/tree/master/packages/rich-text-react-renderer)
