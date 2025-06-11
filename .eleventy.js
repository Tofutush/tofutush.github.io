import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import { DateTime } from "luxon";
import markdownItFootnote from "markdown-it-footnote";
import markdownItKatex from "markdown-it-katex";
import markdownIt from "markdown-it";
import pinyin from "chinese-to-pinyin";
import { VentoPlugin } from "eleventy-plugin-vento";

export default function (eleventyConfig) {
	eleventyConfig.setQuietMode(true);

	// copies
	eleventyConfig.addPassthroughCopy('style.css');
	eleventyConfig.addPassthroughCopy('fonts');
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

	// mdit
	eleventyConfig.setLibrary("md", markdownIt({
		html: true,
		breaks: true,
		linkify: true
	}).use(markdownItFootnote).use(markdownItKatex, { "throwOnError": false, "errorColor": " #cc0000" }));

	// filters
	const slug = s => pinyin(s.toString().trim().toLowerCase(), { removeTone: true, keepRest: true }).replace(/ /g, '-').replace(/[-]+/g, '-').replace(/[^\w-]+/g, '');
	eleventyConfig.addFilter('slug', slug);
	eleventyConfig.addFilter('formatDate', date => {
		return DateTime.fromJSDate(date).toISODate();
	});
	eleventyConfig.addFilter('sortPosts', arr => {
		return arr.sort((a, b) => {
			const dateA = a.edited || a.date;
			const dateB = b.edited || b.date;
			return dateB - dateA;
		})
	});

	// vento
	eleventyConfig.addPlugin(VentoPlugin);
};