import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import { spoiler } from '@mdit/plugin-spoiler';
import pinyin from "chinese-to-pinyin";
import { VentoPlugin } from "eleventy-plugin-vento";
import beautify from "js-beautify";
import { DateTime } from "luxon";
import markdownIt from "markdown-it";
import markdownItAnchor from 'markdown-it-anchor';
import markdownItExternalLinks from "markdown-it-external-links";
import markdownItFootnote from "markdown-it-footnote";
import markdownItKatex from "markdown-it-katex";
import markdownItTableOfContents from "markdown-it-table-of-contents";

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

	// dir=auto
	function addDirAuto(md) {
		const defaultRender = md.renderer.renderToken.bind(md.renderer);
		md.renderer.renderToken = function (tokens, idx, options) {
			const token = tokens[idx];
			if (token.nesting === 1) { // opening tags only
				token.attrSet("dir", "auto");
			}
			return defaultRender(tokens, idx, options);
		};
	}

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
	}).use(spoiler).use(addDirAuto));

	// filters
	eleventyConfig.addFilter('slug', slug);
	eleventyConfig.addFilter('formatDate', date => DateTime.fromJSDate(date, { zone: 'UTC' }).toISODate());
	eleventyConfig.addFilter('sortPosts', arr => arr.sort((a, b) => b.data.date - a.data.date));
	eleventyConfig.addFilter('sortPages', arr => arr.sort((a, b) => a.data.title - b.data.title));

	const mdRender = new markdownIt({
		html: true,
		breaks: true,
		linkify: true
	}).use(markdownItExternalLinks, {
		externalTarget: '_blank'
	}).use(spoiler).use(addDirAuto);
	eleventyConfig.addFilter('renderMD', function (rawString) {
		return mdRender.render(rawString);
	});

	// vento
	eleventyConfig.addPlugin(VentoPlugin);

	// drafts
	eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
		if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
			return false;
		}
	});

	eleventyConfig.addTransform("htmlmin", async function (content) {
		if ((this.page.outputPath || "").endsWith(".html")) {
			let beautified = beautify.html(content, {
				indent_size: 2,
				preserve_newlines: false
			});
			return beautified;
		}
		// If not an HTML output, return content as-is
		return content;
	});

	return {
		markdownTemplateEngine: 'vto',
		htmlTemplateEngine: 'vto'
	}
};