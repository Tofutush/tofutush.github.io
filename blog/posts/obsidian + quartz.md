---
title: Guide to making a website from your Obsidian vault with Quartz.
tags:
  - site-doc
  - webmastery
date: 2025-12-16
draft: true
---

Here's how to turn your Obsidian vault into a website with Quartz and Github Pages. Note that Obsidian has a paid "publish" feature that, if you can afford, could choose instead.

What Quartz can do: folder tree, table of contents, backlinks, graph view, full-text search, page-preview hover.

What Quartz cannot do: plugins like Dataview, import your CSS snippets (you'll have to do it yourself).

[[toc]]

## Prerequisites

- Obsidian, duh.
- A [Github](https://github.com/) account.
- If you don't know what "git" is, had just created a Github account, etc., then [Github Desktop](https://desktop.github.com/download/).
	- Otherwise, do whatever Git workflow you're most comfortable in.
- A text editor of your choice. Cannot be rich-text editors like Word; cannot be fucking Obsidian itself; could just be Notepad, or even Github's online editor itself. I recommend VSCode but that would be an overkill if you don't already do programming.

## Content structure

Your vault *needs* an `index.md` at the very root. That's the only file you *have* to have. Optionally, `index.md`s inside each folder can add content to the folder's page.

## Getting the code

Go to https://github.com/jackyzha0/quartz and note the "Use as template" button.
