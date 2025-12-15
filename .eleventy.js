import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import pinyin from "chinese-to-pinyin";
import { VentoPlugin } from "eleventy-plugin-vento";
import { DateTime } from "luxon";
import markdownIt from "markdown-it";
import markdownItAnchor from 'markdown-it-anchor';
import markdownItExternalLinks from "markdown-it-external-links";
import markdownItFootnote from "markdown-it-footnote";
import markdownItKatex from "markdown-it-katex";
import markdownItTableOfContents from "markdown-it-table-of-contents";
import markdownItTaskLists from 'markdown-it-task-lists';

export default function (eleventyConfig) {
	eleventyConfig.setQuietMode(true);
	const slug = s => pinyin(s.toString().trim().toLowerCase(), { removeTone: true, keepRest: true }).replace(/ /g, '-').replace(/[-]+/g, '-').replace(/[^\w-]+/g, '');

	// copies
	eleventyConfig.addPassthroughCopy('style.css');
	eleventyConfig.addPassthroughCopy('icon.ico');
	eleventyConfig.addPassthroughCopy('fonts');
	eleventyConfig.addPassthroughCopy({ "blog/img": "img" });

	// plugins
	eleventyConfig.addPlugin(syntaxHighlight);
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
	}).use(markdownItFootnote).use(markdownItKatex, {
		"throwOnError": false,
		"errorColor": " #cc0000"
	}).use(markdownItAnchor, {
		slugify: slug
	}).use(markdownItTableOfContents, {
		includeLevel: [2, 3, 4],
		transformContainerOpen: () => {
			return '<details open><summary>Contents</summary>';
		},
		transformContainerClose: () => {
			return '</details>';
		}
	}).use(markdownItExternalLinks, {
		externalTarget: '_blank'
	}).use(markdownItTaskLists));

	// filters
	eleventyConfig.addFilter('slug', slug);
	eleventyConfig.addFilter('formatDate', date => {
		return DateTime.fromJSDate(date, { zone: 'UTC' }).toISODate();
	});
	eleventyConfig.addFilter('sortPosts', arr => {
		return arr.sort((a, b) => {
			return b.data.date - a.data.date;
		})
	});

	// vento
	eleventyConfig.addPlugin(VentoPlugin);

	// drafts
	eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
		if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
			return false;
		}
	});

	return {
		markdownTemplateEngine: 'vto',
		htmlTemplateEngine: 'vto'
	}
};