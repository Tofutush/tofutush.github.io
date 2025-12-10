---
title: "Site doc: Image gallery"
date: 2025-10-18
tags:
  - site-doc
  - webmastery
---

Out of boredom I'm going to write about how I did some of the stuff I did on my site. You can reference this and I hope this can help you, but remember that not everyone's use case is exactly the same, so always make sure you know what a code is doing before copying!

---

[[toc]]

## The data

I keep all of my art in one huge-ass folder (all art from others being in another folder) and the data for all of them (including art from others) in a huge-ass `.json` file. Here is what `gallery imgs.json` looks like:

```json
[
	{
		"name": "sky sans cards",
		"type": "png",
		"date": "2025-06-15",
		"ch": [
			"sky"
		]
	},
	// ...
	{
		"name": "sparky nightsun king-lee",
		"type": "png",
		"date": "2025-07-01",
		"author": "king-lee",
		"authorUrl": "https://artfight.net/~king-lee",
		"ch": [
			"nightsun",
			"sparky"
		],
		"comment": "Artfight 2025 defense!"
	},
// ...
]
```

Each picture needs a `name`, `type`, and `date` property. If it doesn't have a `ch` property, then it doesn't contain any of my characters and is therefore fanart. If it's drawn by someone else, it needs `author` and `authorUrl`.

As of this writing, `gallery imgs.json` is 4613 lines long. Man.

But this isn't done yet, because I want to sort the entire file by date before using it in any capacity! 11ty allows you to make `.js` data files, which is why I have another `gallery.js` that returns the array but sorted by date.

```js
import gallery from './gallery imgs.json' with {type: 'json'};
export default gallery.sort((a, b) => b.date.localeCompare(a.date));
```

(I have to include `with {type: 'json'}` or 11ty throws a fit.)

Now in any content file, `gallery` gives access to this sorted array.

## Gallery pages

Now that the data's ready, all there is left is to use it! For the gallery pages, I wrote filters to get all of my own pictures from a specific month of a specific year.

```js
eleventyConfig.addFilter('getOnlyMyArt', function (arr) {
	return arr.filter(a => !a.author);
});
eleventyConfig.addFilter('filterGalleryByDate', function (arr, f) {
	return arr.filter(a => a.date?.includes(f));
});
```

The way you use it is:

```liquid
{% assign myArtInJune2025 = gallery | getOnlyMyArt | filterGalleryByDate: "2025-06" %}
```

The way Liquid's, and most template engines' filtering chain works is basically the value before the filter is passed in as the filter's first argument — in this case `arr`. Any values after the filter, here it's `"2025-06"`, will be passed in as the 2nd, 3rd, etc. arguments. So the thing above is equivalent to this in JS:

```js
let myArtInJune2025 = filterGalleryByDate(getOnlyMyArt(gallery), "2025-06");
```

(The functions `getOnlyMyArt` and `filterGalleryByDate` don't actually exist, since I registered them directly as filters, but we can pretend they do.)

To make the gallery pages, I made a page that has the a years data array in its frontmatter.

```yaml
years:
 - 2023
 - 2024
 - 2025
```

I have to edit this manually each year, but since it's only once a year I won't get tired doing this and attempt to automate it, LMAO.

I then paginated this data, so 11ty would make a page out of each of these years. Inside each year, I cycled through the 12 months, which thankfully is quite easy to do in Liquid.

```liquid
{% for month in (1..12) reversed %}
	// ...
{% endfor %}
```

Inside each month, I filtered for my art in that month, and displayed them on the page if there was a nonzero amount. With 11ty's `pagination.previous` and `pagination.next`, I can also link to the previous and next years on this page.

## Character pages

Another place I need to show the art is in their pages! This is fairly simple as I only need to filter for all art where the `ch` property contains the character's name.

```js
eleventyConfig.addFilter('filterGallery', function (arr, f) {
	return arr.filter(a => a.ch?.includes(f.toLowerCase()));
});
```

(`toLowerCase` because they are all lowercase in the data, but the name I passed in is uppercase.)

```liquid
{% assign filteredGallery = gallery | filterGallery: "Sparky" %}
```

But as some characters' galleries grew (looking at you Sparky), it would be bad to dump all of that on their main page. I could make a gallery subpage for that character if they have more than 10 images. How can I automate that?

Here's a neat thing I found. 11ty's collections feature, especially the part where it lets you make your own collections, doesn't *have* to return an array of pages. You can have it return anything you like! Which is why I made it return a list of characters with more than 10 images.

```js
eleventyConfig.addCollection("charactersMoreThan10", collection => {
	return characters.filter(ch =>
		gallery.filter(img =>
			img.ch &&
			img.ch.includes(ch.name.toLowerCase())
		).length > 10
	);
});
```

The code above filters the `characters` array for characters with more than 10 images. You can see I never used the `collection` variable, which 11ty was supposed to pass in.

The `img.ch &&` part of the code simply ensures that when I did `img.ch.includes()`, `img.ch` wouldn't be undefined so it won't throw an error. If `img.ch` doesn't exist, the statement gets cut off so anything after `&&` doesn't get evaluated. But if `img.ch` *does* exist, the interpreter moves on to the part after `&&` and returns the last part that's true (which is the second part in this case, since there are only two parts).

Now I have a list of whatever characters have more than 10 images, so I can paginate that with a permalink set to be a subpage of that character!

```yaml
pagination:
  data: collections.charactersMoreThan10
  size: 1
  alias: ch
  addAllPagesToCollections: true
permalink: "characters/{{ echo }}{{ ch.name | lowerCase }}{{ /echo }}/gallery/"
```

On the characters' main pages, I also filtered for the first 10 images in their gallery, and linked to the subpage if they had more than 10 pieces. Wonderfully fully-automated big galleries. I love 'em.
