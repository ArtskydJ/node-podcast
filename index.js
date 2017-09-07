const RSS = require('rss')

module.exports = function makePodcast(inputOptions = {}, inputItems = []) {
	const options = makeOptionsObjectFromInput(inputOptions)

	const items = inputItems.map(transformItem)

	return new RSS(options, items).xml({
		indent: inputOptions.indent ? '\t' : false,
	})
}

const inputFeedOptionsToPassToRss = [ 'title', 'description', 'generator', 'feed_url', 'site_url', 'image_url', 'author', 'categories', 'pubDate', 'docs', 'copyright', 'language', 'managingEditor', 'webMaster', 'ttl', 'geoRSS' ]
const inputItemOptionsToPassToRss = [ 'title', 'description', 'url', 'guid', 'categories', 'author', 'date', 'lat', 'long', 'enclosure' ]

function makeOptionsObjectFromInput(inputOptions) {
	const options = Object.assign({
		title: 'Untitled Podcast Feed',
		description: '',
		generator: 'Podcast for Node',
		geoRSS: false,
		custom_namespaces: {
			itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd',
		},
		custom_elements: feedCustomElementsFromInput(inputOptions),
	}, copyJust(inputOptions, inputFeedOptionsToPassToRss))

	return options
}

function feedCustomElementsFromInput(inputOptions) {
	const itunesOwner = inputOptions.itunesOwner || { name: inputOptions.author || '', email: '' }

	const customElements = []

	if (inputOptions.itunesAuthor || inputOptions.author) {
		customElements.push({ 'itunes:author': inputOptions.itunesAuthor || inputOptions.author })
	}
	if (inputOptions.itunesSubtitle) {
		customElements.push({ 'itunes:subtitle': inputOptions.itunesSubtitle })
	}
	if (inputOptions.itunesSummary || inputOptions.description) {
		customElements.push({ 'itunes:summary': inputOptions.itunesSummary || inputOptions.description })
	}

	customElements.push({ 'itunes:owner': [{ 'itunes:name': itunesOwner.name }, { 'itunes:email': itunesOwner.email }] })

	customElements.push({ 'itunes:explicit': (inputOptions.itunesExplicit || false) ? 'Yes' : 'No' })

	if (inputOptions.itunesCategory) {
		customElements.push(...buildiTunesCategories(inputOptions.itunesCategory))
	}

	if (inputOptions.itunesImage || inputOptions.image_url) {
		customElements.push({
			'itunes:image': {
				_attr: {
					href: inputOptions.itunesImage || inputOptions.image_url,
				},
			},
		})
	}

	return customElements
}

function buildiTunesCategories(categories) {
	if (!Array.isArray(categories)) {
		return []
	}

	return categories.map(function(category) {
		if (category.subcats) {
			return {
				'itunes:category': [
					{ _attr: { text: category.text } },
					...buildiTunesCategories(category.subcats),
				],
			}
		} else {
			return {
				'itunes:category': {
					_attr: { text: category.text },
				},
			}
		}
	})
}

function transformItem(inputItem) {
	return Object.assign({
		title: 'No title',
		description: '',
		categories: [],
		enclosure: false,
		custom_elements: itemCustomElementsFromInput(inputItem),
	}, copyJust(inputItem, inputItemOptionsToPassToRss))
}

function itemCustomElementsFromInput(inputItem) {
	const customElements = []

	if (inputItem.itunesAuthor || inputItem.author) {
		customElements.push({ 'itunes:author': inputItem.itunesAuthor || inputItem.author })
	}
	if (inputItem.itunesSubtitle) {
		customElements.push({ 'itunes:subtitle': inputItem.itunesSubtitle })
	}
	if (inputItem.itunesSummary || inputItem.description) {
		customElements.push({ 'itunes:summary': inputItem.itunesSummary || inputItem.description })
	}

	customElements.push({ 'itunes:explicit': (inputItem.itunesExplicit || false) ? 'Yes' : 'No' })

	if (inputItem.itunesDuration) {
		customElements.push({ 'itunes:duration': inputItem.itunesDuration })
	}
	if (inputItem.itunesKeywords) {
		customElements.push({ 'itunes:keywords': [ inputItem.itunesKeywords.join(',') ] })
	}
	if (inputItem.itunesImage || inputItem.image_url) {
		customElements.push({
			'itunes:image': {
				_attr: {
					href: inputItem.itunesImage || inputItem.image_url,
				},
			},
		})
	}

	return customElements
}

function copyJust(object = {}, keys) {
	const output = {}
	keys
		.filter(key => typeof object[key] !== 'undefined')
		.forEach(key => {
			output[key] = object[key]
		})

	return output
}
