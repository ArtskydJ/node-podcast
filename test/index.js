var fs = require('fs')
var path = require('path')
var test = require('tape')
var Podcast = require('..')

var expectedOutputDefault = getExpectedOutput('default')
var expectedOutputDefaultOneItem = getExpectedOutput('defaultOneItem')
var expectedOutputPodcast = getExpectedOutput('podcast')

// Dates in XML files will always be this value.
require('mockdate').set('Wed, 10 Dec 2014 19:04:57 GMT')

test('empty feed', function(t) {
	t.plan(2)
	var feed = new Podcast()
	t.equal(feed.xml(), expectedOutputDefault)
	feed.item()
	t.equal(feed.xml(), expectedOutputDefaultOneItem)
})

test('podcast', function(t) {
	t.plan(1)

	var feed = new Podcast({
		title: 'title',
		description: 'description',
		feed_url: 'http://example.com/rss.xml',
		site_url: 'http://example.com',
		author: 'Dylan Greene',
		pubDate: 'May 20, 2012 04:00:00 GMT',
		language: 'en',
		ttl: '60',
		itunesSubtitle: 'A show about everything',
		itunesAuthor: 'John Doe',
		itunesSummary: 'All About Everything is a show about everything. Each week we dive into any subject known to man and talk about it as much as we can. Look for our podcast in the Podcasts app or in the iTunes Store',
		itunesOwner: {
			name: 'John Doe',
			email: 'john.doe@example.com'
		},
		itunesImage: 'http://example.com/podcasts/everything/AllAboutEverything.jpg',
		itunesCategory: [{
			text: 'Technology',
			subcats: [{
				text: 'Software',
				subcats: [{
					text: 'node.js'
				}]
			}]
		}],
	})

	feed.item({
		title: 'item 1',
		description: 'description 1',
		url: 'http://example.com/article1',
		date: 'May 24, 2012 04:00:00 GMT',
		itunesAuthor: 'John Doe',
		itunesSubtitle: 'A short primer on table spices',
		itunesImage: 'http://example.com/podcasts/everything/AllAboutEverything/Episode1.jpg',
		itunesDuration: '7:04'
	})

	t.equal(feed.xml({indent: true}), expectedOutputPodcast)
})

function getExpectedOutput(fileBaseName) {
	var filePath = path.join(__dirname, 'expectedOutput', fileBaseName + '.xml')
	return fs.readFileSync(filePath, 'utf-8').trim()
}
