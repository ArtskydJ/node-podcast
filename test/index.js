const fs = require('fs')
const path = require('path')
const test = require('tape')
const makePodcast = require('..')

const expectedOutputDefault = getExpectedOutput('default')
const expectedOutputDefaultOneItem = getExpectedOutput('defaultOneItem')
const expectedOutputPodcast = getExpectedOutput('podcast')

// Dates in XML files will always be this value.
require('mockdate').set('Wed, 10 Dec 2014 19:04:57 GMT')

test('empty feed', function(t) {
	t.plan(1)
	const xml = makePodcast()
	t.equal(xml, expectedOutputDefault)
})

test('feed with one item', t => {
	t.plan(1)
	const xml = makePodcast({}, [{}])
	t.equal(xml, expectedOutputDefaultOneItem)
})

test('podcast', function(t) {
	t.plan(1)

	const xml = makePodcast({
		indent: true,
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
			email: 'john.doe@example.com',
		},
		itunesImage: 'http://example.com/podcasts/everything/AllAboutEverything.jpg',
		itunesCategory: [{
			text: 'Technology',
			subcats: [{
				text: 'Software',
				subcats: [{
					text: 'node.js',
				}],
			}],
		}],
	}, [{
		title: 'item 1',
		description: 'description 1',
		url: 'http://example.com/article1',
		date: 'May 24, 2012 04:00:00 GMT',
		itunesAuthor: 'John Doe',
		itunesSubtitle: 'A short primer on table spices',
		itunesImage: 'http://example.com/podcasts/everything/AllAboutEverything/Episode1.jpg',
		itunesDuration: '7:04',
	}])

	t.equal(xml, expectedOutputPodcast)
})

function getExpectedOutput(fileBaseName) {
	const filePath = path.join(__dirname, 'expectedOutput', fileBaseName + '.xml')
	return fs.readFileSync(filePath, 'utf-8').trim()
}
