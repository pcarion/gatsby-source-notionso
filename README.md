[![npm version](https://badge.fury.io/js/gatsby-source-notionso.svg)](https://badge.fury.io/js/gatsby-source-notionso)

# gatsby-source-notionso

A Gatsby source plugin for sourcing data into your [Gatsby](https://www.gatsbyjs.org/) application using [Notion.so](https://www.notion.so) as a backend.

There is not yet an official API to retrieve data for your pages, so this plugin reverse engineered the current API to get access to the content of a page.

You can find a detailed description about this plugin at: http://www.gatsbyplugins.com

## Screenshot

![notion.so web side by side](/images/notionso-web-sidebyside.png)

## Demo site

[![Netlify Status](https://api.netlify.com/api/v1/badges/dfab5a71-603a-4065-88fd-cf5a24194bc6/deploy-status)](https://app.netlify.com/sites/gatsbyplugins/deploys)

A demo site is available at: http://www.gatsbyplugins.com

This demo site contain detailed information about how to use the plugin.

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
  rootPageUrl: string; // the notion page URL of the root page
  name: string; // name of your data set to identify the data for the instance of this plugin
  tokenv2?: string; // not used yet (the page needs to be public)
  debug?: boolean; // set to true to enable debugging information
}
```

The plugin will load the page identified by the `rootPageUrl` but this page will not be rendered: the root page is supposed to contain
references to all the pages you want to retrieve data for.

## How to use?

In your `gatsby-config.js` file:

```
  plugins: [
    {
      resolve: 'gatsby-source-notionso',
      options: {
        name: "<name of your data set>",
        rootPageUrl: "<your page url>",
        debug: false,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages`,
      },
    },
  ],

```

## How to query

### Get all posts

If the name of your data set is `blog`, the following request will allow you to retrieve your data.

```
query {
  allNotionPageBlog(
    filter: { isDraft: { eq: false } }
    sort: { fields: [indexPage], order: DESC }
  ) {
    edges {
      node {
        title
        slug
        excerpt
        pageIcon
      }
    }
  }
}
```

# References

## gatsby source plugin development

* [Pixabay Image Source Plugin Tutorial](https://www.gatsbyjs.org/docs/pixabay-source-plugin-tutorial/)
* [Customizing the GraphQL Schema](https://www.gatsbyjs.org/docs/schema-customization)

## Notion API

* [How I reverse engineered Notion API](https://blog.kowalczyk.info/article/88aee8f43620471aa9dbcad28368174c/how-i-reverse-engineered-notion-api.html)

Various Notion API implementations:
 * in [Go](https://github.com/kjk/notionapi)
 * in [Python](https://github.com/jamalex/notion-py)
 * in [Kotlin](https://github.com/petersamokhin/knotion-api)

