const { feedPlugin } = require("@11ty/eleventy-plugin-rss");
const { DateTime } = require("luxon");
const markdownItFootnote = require("markdown-it-footnote");
const markdownItKatex = require("markdown-it-katex");
const markdownIt = require("markdown-it");

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
	eleventyConfig.setLibrary("md", markdownIt({
		html: true,
		breaks: true,
		linkify: true
	}).use(markdownItFootnote).use(markdownItKatex, { "throwOnError": false, "errorColor": " #cc0000" }));
	eleventyConfig.addPassthroughCopy('style.css');
	eleventyConfig.addPassthroughCopy('fonts');
	eleventyConfig.addFilter('formatDate', date => {
		return DateTime.fromJSDate(date).toISODate();
	});
};