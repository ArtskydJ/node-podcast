# Podcast RSS for Node [![Build Status](https://travis-ci.org/ArtskydJ/podcast2.svg?branch=master)](https://travis-ci.org/ArtskydJ/podcast2)

Fast and simple Podcast RSS generator/builder for Node projects. Supports enclosures and GeoRSS.

An updated version of [`node-podcast`](https://github.com/maxnowack/node-podcast).

## Install

```sh
npm install podcast2
```

## Usage

### Create a new feed

```js
const podcast = require('podcast2')

const feedXml = podcast(feedOptions, feedItems)
```

#### `feedOptions`

* `title` **string** Title of your site or feed
* `description` _optional_ **string** A short description of the feed.
* `generator` _optional_  **string** Feed generator.
* `feed_url` **url string** Url to the rss feed.
* `site_url` **url string** Url to the site that the feed is for.
* `image_url` _optional_  **url string* Small image for feed readers to use.
* `docs` _optional_ **url string** Url to documentation on this feed.
* `author` **string** Who owns this feed.
* `managingEditor` _optional_ **string** Who manages content in this feed.
* `webMaster` _optional_ **string** Who manages feed availability and technical support.
* `copyright` _optional_ **string** Copyright information for this feed.
* `language` _optional_ **string**  The language of the content of this feed.
* `categories` _optional_ **array of strings**  One or more categories this feed belongs to.
* `pubDate` _optional_ **Date object or date string** The publication date for content in the feed
* `ttl` _optional_ **integer** Number of minutes feed can be cached before refreshing from source.
* `itunesAuthor` _optional_  **string** (iTunes specific) author of the podcast
* `itunesSubtitle` _optional_  **string** (iTunes specific) subtitle for iTunes listing
* `itunesSummary` _optional_  **string** (iTunes specific) summary for iTunes listing
* `itunesOwner` _optional_ **object** (iTunes specific) owner of the podcast
    * `name` **string**
    * `email` **string**
* `itunesExplicit` _optional_ **boolean** (iTunes specific) specifies if the podcast contains explicit content
* `itunesCategory` _optional_ **array of objects** (iTunes specific) Categories for iTunes
    * `text` **string**
    * `subcats` **array of objects** A recursive array of these category objects
* `itunesImage` _optional_ **string** (iTunes specific) link to an image for the podcast
* `indent` _optional_ **boolean** Whether or not the output should be indented with a tab

#### `feedItems`

An array of any number of item objects.

Item object properties:

* `title` **string** Title of this particular item.
* `description` **string** Content for the item.  Can contain html but link and image urls must be absolute path including hostname.
* `url` **url string** Url to the item. This could be a blog entry.
* `guid` **unique string** A unique string feed readers use to know if an item is new or has already been seen.
If you use a guid never change it.  If you don't provide a guid then your item urls must
be unique.
* `categories` _optional_ **array of strings** If provided, each array item will be added as a category element
* `author` _optional_  **string**  If included it is the name of the item's creator.
If not provided the item author will be the same as the feed author.  This is typical
except on multi-author blogs.
* `date` **Date object or date string** The date and time of when the item was created.  Feed
readers use this to determine the sort order. Some readers will also use it to determine
if the content should be presented as unread.
* `lat` _optional_ **number** The latitude coordinate of the item.
* `long` _optional_ **number** The longitude coordinate of the item.
* `enclosure` _optional_ **object** Attach a multimedia file to this item.
    * `url` **string** Url to the related file.
    * `file` _optional_ **string** Path to the related file on the filesystem. Used to fill out size and mime
    information.
    * `size` _optional_ **number** Number of bytes in the file. The length field will default to 0 if the
    `size` or `file` fields have not been set.
    * `mime` _optional_ **string** Mime type of the file. Will be guessed from the url if this parameter is
    not set.
* `itunesAuthor` _optional_  **string** (iTunes specific) author of the podcast
* `itunesExplicit` _optional_ **boolean** (iTunes specific) specifies if the podcast contains explicit content
* `itunesSubtitle` _optional_  **string** (iTunes specific) subtitle for iTunes listing
* `itunesSummary` _optional_  **string** (iTunes specific) summary for iTunes listing
* `itunesDuration` _optional_ **number** (iTunes specific) duration of the podcast item in seconds
* `itunesKeywords` _optional_ **array of string** (iTunes specific) keywords of the podcast
* `itunesImage` _optional_ **string** (iTunes specific) link to an image for the item

## Example Usage

```js
const podcast = require('podcast2')

const xml = podcast({
    title: 'title',
    description: 'description',
    feed_url: 'http://example.com/rss.xml',
    site_url: 'http://example.com',
    image_url: 'http://example.com/icon.png',
    docs: 'http://example.com/rss/docs.html',
    author: 'Joseph Dykstra',
    managingEditor: 'Joseph Dykstra',
    webMaster: 'Joseph Dykstra',
    copyright: '2013 Joseph Dykstra',
    language: 'en',
    categories: ['Category 1','Category 2','Category 3'],
    pubDate: 'May 20, 2012 04:00:00 GMT',
    ttl: '60',
    itunesAuthor: 'Joseph Dykstra',
    itunesSubtitle: 'I am a sub title',
    itunesSummary: 'I am a summary',
    itunesOwner: { name: 'Joseph Dykstra', email:'example@example.com' },
    itunesExplicit: false,
    itunesCategory: {
        "text": "Entertainment",
        "subcats": [{
            "text": "Television"
        }]
    },
    itunesImage: 'http://link.to/image.png'
}, [{
    title:  'item title',
    description: 'use this for the content. It can include html.',
    url: 'http://example.com/article4?this&that', // link to the item
    guid: '1123', // optional - defaults to url
    categories: ['Category 1','Category 2','Category 3','Category 4'], // optional - array of item categories
    author: 'Guest Author', // optional - defaults to feed author property
    date: 'May 27, 2012', // any format that js Date can parse.
    lat: 33.417974, //optional latitude field for GeoRSS
    long: -111.933231, //optional longitude field for GeoRSS
    enclosure : {url:'...', file:'path-to-file'}, // optional enclosure
    itunesAuthor: 'Joseph Dykstra',
    itunesExplicit: false,
    itunesSubtitle: 'I am a sub title',
    itunesSummary: 'I am a summary',
    itunesDuration: 12345,
    itunesKeywords: ['javascript','podcast']
}])

```

## Tests

Tests included use Tape. Use `npm test` to run the tests.

```sh
npm test
```

## Credit / License

I forked the `node-podcast` module, because it wasn't passing its tests, and the install was failing.

[Original Repository License](https://github.com/maxnowack/node-podcast#license)

[MIT](https://choosealicense.com/licenses/mit)
