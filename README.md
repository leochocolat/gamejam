# Gleec - Front end

## Environments

| Name           | URL                                                       |
| -------------- | --------------------------------------------------------- |
| **Staging**    | [gleec-2021.imm-g-prod.com](http://gleec-2021.imm-g-prod.com/) |
| **Production** | Coming soon                                               |

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

## CMS

This project is using [Contentful](https://app.contentful.com/).

## Deploy Guide

### Staging

Pushing on main or publishing on Contentful triggers a SSH Deploy to staging with [Github action](https://github.com/immersive-garden/gleec-2021/actions/workflows/deploy-staging.yml).

You can also manually deploy any branch or tag with the [Github action interface](https://github.com/immersive-garden/gleec-2021/actions/workflows/deploy-staging.yml) :

-   Click "Run Workflow" drop down
-   Enter branch or tag if needed (if empty it will use master)
-   Click "Run Workflow"

### Production

Coming soon
