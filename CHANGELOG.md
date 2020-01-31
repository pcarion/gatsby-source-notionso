# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## 1.1.0 - 2020-01-30
- meta information can now be set as text, with the !key syntax

## 1.0.5 - 2020-01-26

## Added
- `tags: [String!]` added : this file is read from the tags value (comma seperated list of tags) in the meta/quote block
- `createdAt` field is now formatted as a date in UTC zone

## 1.0.4 - 2020-01-14

## Changed
- moved the example to its own repository: https://github.com/pcarion/gatsby-source-notionso-example

## 1.0.0 - 2020-01-14

### Fixed
- restore all the unit tests
- handle (by skipping) the toggle block type

## 1.0.0 - 2020-01-12
### Added
- add an example in `examples` directory
- publish site at http://www.gatsbyplugins.com
- add netlify automation

## 0.0.6 - 2020-01-11
### Changed
- remove extra logs
- force meta information to be all strings

## 0.0.5 - 2020-01-11
### Added
- added a direct relation between a page and the images it contains
- upadet renderer util to work with the new schema

## 0.0.4 - 2020-01-09
### Added
- add `excerpt` property to the page. This is the first non blank text block of the page
- add `pageIcon` property to the page. This is the emoji you can associate to a page in notion
- change rendering of notion.so blocks/text (to be documented)
- add `src/renderer/index.ts` to help for rendering

## 0.0.3 - 2020-01-02
### Changed
- replace parameter `rootPageId` by `rootPageUrl` as it is easier for the user to find
- add unit test for extraction of pageId from URL

## 0.0.2 - 2020-01-01
### Added
- House cleaning: `.npmignore` file added to avoid junk in npmjs

## 0.0.1 - 2020-01-01
### Added
- First version of the plugin
- plugin is working but severely lacks documentation.

