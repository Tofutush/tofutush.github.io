const { feedPlugin } = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {
	eleventyConfig.addPlugin(feedPlugin, {
		type: "atom",
		outputPath: "/feed.xml",
		collection: {
			name: "posts",
			limit: 0
		},
		metadata: {
			language: "en",
			title: "Tofutush's blog",
			subtitle: "Where I write stuff once in a blue moon",
			base: "https://tofutush.github.io/",
			author: {
				name: "Tofutush",
			}
		}
	});
	eleventyConfig.addPassthroughCopy('style.css');
	eleventyConfig.addPassthroughCopy('fonts');
	eleventyConfig.addFilter('fuckyou', arr => {
		for(a of arr) {
			console.log(a.data.title);
		}
		return arr.reverse();
	});
};