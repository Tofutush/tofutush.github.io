---
title: "Site doc: Using Github to deploy a site made with 11ty to Neocities"
---

Out of boredom I'm going to write about how I did some of the stuff I did on my site. You can reference this and I hope this can help you, but remember that not everyone's use case is exactly the same, so always make sure you know what a code is doing before copying!

---

I have not clicked open the "edit site" button on Neocities in ages; I only open it when I want to check how much space I'm using. Whenever I make an edit to my site, I just push the commit to the main branch and Github handles the rest. Here's how I did that.

[[toc]]

## Git

PetraPixel had made wonderfully-explained tutorials on a lot of these things already, so I recommend checking out their [Git tutorial](https://petrapixel.neocities.org/coding/git-tutorial), [NPM tutorial](https://petrapixel.neocities.org/coding/npm-tutorial), and [11ty tutorial](https://petrapixel.neocities.org/coding/eleventy-tutorial)!

I also have Github Desktop downloaded, which is a GUI that makes things easier. This is back when I was in China and pushing and pulling took ages and I didn't know how to configure proxies (still don't). My VPN proxies all desktop applications automatically so it made things way faster. Now I won't be needing it since VSCode has a GUI for Git too and it's not as slow as before.

## 11ty

11ty is a static site generator (SSG), meaning it takes a bunch of template files, fills in the templates, and outputs a bunch of HTML files for the browser to read.

Static site generators are great for bigger sites. Suppose I want the same header and footer on every page. I can copy / paste stuff, but what if I want to update the header? I'd have to update everything! And don't even bring up iframes in front of me. They're like loading one page for the price of two. They're only good for embedding *another* website in yours, like Youtube videos, guestbooks, etc.

I've also recently learned about JavaScript custom elements (components), which could be worth checking out if you don't mind a lot of client-side JS and don't want to go all SSG. But SSGs still offer greater flexibility than simply components. With 11ty, you can

- Make a layout so you have the same header and footer in every page, as well as all the `<meta>` tags
	- Wrap a layout inside another layout for specific categories of pages that have their own shared sections
- Do pagination with data, which is how I made my character pages
- Use data for literally anything, which is how I made many little games with the same character data file
- Automatically convert all your images to a certain size and format
- Use any templating language you want

When I started out I made my site with the Liquid templating language, but it's quite stupid to work with and now my site's too big for me to switch to something else. If I were to make a new site, I would use [Vento](https://vento.js.org/).

Why yes, I am shilling for 11ty. I also haven't used literally any other SSG because I DON'T NEED TO WHEN I HAVE 11TY —

## Github actions

## HTML base
