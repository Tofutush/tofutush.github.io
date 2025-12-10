---
title: "Site doc: Relationships graph"
date: 2025-12-10
tags:
  - site-doc
  - webmastery
---

Out of boredom I'm going to write about how I did some of the stuff I did on my site. You can reference this and I hope this can help you, but remember that not everyone's use case is exactly the same, so always make sure you know what a code is doing before copying!

[[toc]]

---

I have a pretty fun [relationships graph](https://tofutush.github.io/The-Iron-Ragdoll/characters/relationships/), and I recently added the feature to focus on a single character and the relationships surrounding them. Here's how I did it.

Inspiration taken a lot from Obsidian's graph view, though I don't know how Obsidian did theirs. I used [D3.js](https://d3js.org/), the industry standard for JavaScript data visualization. Now, D3 is still a mystery to me but at least I did what I did.

## D3.js

I used the [force-directed graph](https://observablehq.com/@d3/disjoint-force-directed-graph/2) example. There's already a bunch of code for you to copy there, hooray! You can try it out yourself a bit first! Note that the example gives its code wrapped inside a `chart = { … }`, which is I suppose something required in that specific environment, and won't work in a plain browser; and the line with `invalidation` on it will throw an error, so just remove it (the comment also says it doesn't matter so yeah).

There is some starter code [here](https://d3js.org/getting-started#d3-in-vanilla-html) — click the "UMD + CDN" tab, copy that, and replace the script with the one from the example. Keep the last line, `container.append(svg.node());` though.

For the data, you can download it from the paper clip icon on the top-right. It gives you `graph.json`, though I like to rename it `graph.js`, add a `const data = ` at the beginning, and include it in a script tag before the main script, because I'm a lazy ass who doesn't wanna deal with `json` files. What matters is that you can get the data into the `data` variable that the code can use. If you see a bunch of blue and orange dots you can drag around, then hooray!

Looking at the code, you can see that it's quite easy to read. Like, what do you think —

```js
const svg = d3.create("svg")
	.attr("width", width)
	.attr("height", height)
	.attr("viewBox", [-width / 2, -height / 2, width, height])
	.attr("style", "max-width: 100%; height: auto;");
```

— this does? It sets attributes for the `svg` element. Change some of those numbers around and see how the graph changes.

You might be wondering, what's all them dots before `attr` about? Well, that's something called "function chaining." It's made possible by the people who wrote D3.js, where they put a return statement after every single function that was supposed to return `void`, and made it return the object itself instead.

```js
// Possibly what this function looked like
function attr(name, value) {
	// stuff
	return this;
}
```

This means that whenever you run the `attr` function, the object you're running it on — `svg` — is also the output. And this makes it so that you can immediately put a `.attr` right after to set another attribute. This enables you to write the code above, instead of —

```js
const svg = d3.create("svg");
svg.attr("width", width);
svg.attr("height", height);
svg.attr("viewBox", [-width / 2, -height / 2, width, height]);
svg.attr("style", "max-width: 100%; height: auto;");
```

— this.

Most functions in D3.js are all chainable, as you can see from the example code.

## Forces

Look at the part where it says:

```js
// Create a simulation with several forces.
const simulation = d3.forceSimulation(nodes)
	.force("link", d3.forceLink(links).id(d => d.id))
	.force("charge", d3.forceManyBody())
	.force("x", d3.forceX())
	.force("y", d3.forceY());
```

This is where the physics stuff is happening. The "link" force pulls linked nodes together, the "charge" force makes all nodes repel each other, the "x" and "y" force both pull all nodes towards a certain x and y position.

Here, the example is using all default values, which is fine, especially for the "x" and "y" forces, because they default to half the container's width and height — the center, which is exactly what we want.

What we *can* change, however, is the distance of the "link" force and strength of the "charge" force. Simply chain a `strength()` and `distance()` function after it.

```js
d3.forceLink(links).id(d => d.id).distance(200)
d3.forceManyBody().strength(-400)
```

The strength for this is negative because we're making them repel.

You don't need to change anything yet, because the graph looks perfectly nice at this point! But if you change stuff about the nodes, like adding pictures and labels, you're gonna need to set their distance apart so they don't get mushed together.

Also, you might have noticed the `.id(d => d.id)` function. This is because in D3's "set" functions, it can take a value or a function that evaluates a value. The latter case is there for when you need to calculate the value based on the node's data, which is why the specific node that's being acted on is passed in as a parameter, in this case `d`. The code above sets the ids of the link force to the ids of each node, respectively.

You can also see this on `.attr("stroke-width", d => Math.sqrt(d.value))` and `.attr("fill", d => color(d.group))` too, as well as in the `simulation.on("tick")` function, where it is important.

## Data structure

The code requires two parts of data: nodes, and links. Every node needs a unique id, and every link requires a source and a target, whose values need to reference a node's id. So the bare minimum for a data file is this:

```js
const data = {
	nodes: [
		{
			id: "1"
		},
		{
			id: "2"
		},
	],
	links: [
		{
			source: "1",
			target: "2"
		}
	]
};
```

In the example, the nodes also had a "group" property, which determined their color. It's not necessary, but if you add it, you can reference it in a function.

For me, I needed the following data: characters' names (which are ids since all my characters have different names), soul colors (can't do without!), and a thumbnail picture for nodes, and description of the relationship (e.g. "mom," "friend") for links. So my data looked like this:

```js
const data = {
	ch: [
		{
			id: "Sparky",
			color: "#0cf",
			img: "/The-Iron-Ragdoll/img/gallery/MXoErqmXYg-200.webp"
		},
		{
			id: "Amber",
			color: "#e15f19",
			img: "/The-Iron-Ragdoll/img/gallery/6hDpgFeaJ5-200.webp"
		},
		// ...
	],
	rel: [
		{
			source: "Sparky",
			target: "Amber",
			rel1: "daughter",
			rel2: "mother"
		},
		{
			source: "Sparky",
			target: "Peacock",
			rel1: "stepdaughter",
			rel2: "stepfather"
		}
		// ...
		]
};
```

They're named differently, `ch` and `rel` instead of `nodes` and `links`, but that's okay, just remember to change the code too.

Of course, my lazy-ass would never write and maintain such a file by hand. I automate it by generating it with a Liquid template. In 11ty, you can set the permalink for a file to be of any filetype — so I made it a `.js` file!

```yml
permalink: "characters/relationships/data.js"
```

In this Liquid file, I loop through my existing characters and relationships data to get what I want. It's `.js` not only because that's easier to import than `.json`, but also `.json` is stricter about commas after the last element and all, and would be more of a hassle to generate.

## Labels

Now we got our data ready, it's time to show them on the screen!

### Names

Referencing the example code and googling, adding text works like this.

```js
const nodeLabel = svg.append("g")
	.selectAll("text")
	.data(nodes)
	.join("text")
	.attr("text-anchor", "middle")
	.attr('font-size', 16)
	.attr('font-weight', 'bold')
	.attr("dy", 32)
	.text(d => d.id)
	.attr("fill", "var(--text)")
	.attr('opacity', 0.5)
	.style('user-select', 'none');
```

This code appends a "g" to our `svg`, selects all the "text" elements (even though there are no text elements yet? I don't know girl, the example wrote it like that too), gives them the nodes data to work off of, join "text" yeah that I don't really know either but I just know that these three lines adds a text element for each node we have. And then it's just style setting stuff. `.attr("dy", 32)` is the key, it pushes the text underneath by 32px so it doesn't overlap with the circles.

Oh, no! All our names are in the middle (lowered by 32px)! How come? This is because we didn't update their positions in the tick function.

Find `simulation.on("tick", () => {`. This is the function that updates stuff every frame. Add this in there:

```js
nodeLabel.attr("x", d => d.x)
	.attr("y", d => d.y);
```

Yeeaaah, it's literally just "set x to x, set y to y." I actually have no fucking idea how this works but it does.

Another important thing is to make sure `nodeLabel`'s definition in *front* of `node`'s. This way, `node` comes last and is always layered at the top, so you can actually drag them without other stuff blocking your mouse input.

### Relationships

Copy-catting code again, we can add labels onto the link lines.

```js
const linkLabel1 = svg.append("g")
	.selectAll("text")
	.data(links)
	.join("text")
	.attr("text-anchor", "middle")
	.attr("fill", d => d.source.color)
	.attr("font-size", 12)
	.attr('opacity', 0.3)
	.style('user-select', 'none')
	.text(d => d.rel1);
```

This is for the first relationship. The second relationship features the same code, just with `d.target.color` and `d.rel2` instead.

Now, in the tick function this time, simply setting x to x and y to y doesn't work anymore for some fucking reason. So I just set it to halfway between the two nodes.

```js
linkLabel1.attr("x", d => (d.source.x + d.target.x) / 2)
	.attr("y", d => (d.source.y + d.target.y) / 2 - ((d.rel1 === d.rel2) ? 0 : 5));
```

The important thing to note here is that here, it's obvious that the `links` data array had been mutated by D3. `d.source` used to be merely a string, but it's been turned into an object. The mutation happened right on your original data. This will come up later.

I also played a little trick. If the two relationships are the same, like friend and friend, I make them overlap. Otherwise, there's a little bit of a vertical offset between them so people can actually see the text.

## Nodes

### Links

It would be great if

### Pictures

Character thumbnails! Instead of boring circles, let's do pictures. This is easy because SVG allows rendering bitmap images in the middle of them. Find the `node` constant, and replace the lines drawing the circle with adding an image instead.

```js
// ...
	.selectAll("image")
	.data(nodes)
	.join("svg:image")
	.attr('width', 40)
	.attr('height', 40)
	.attr("xlink:href", d => d.img)
```

You only need one `data(nodes)` in there, so delete any redundancies.

Oh, now the pictures are crammed in the middle again! In the tick function, change `cx` and `cy` to `x` and `y`. I suppose this is because `cx` stands for "center x"? So it only works on circles. But now the point where the links meet are also visible. This is because the image's anchor is on the top-left, so you need to offset it by half its width and height to make it centered. I don't know how to dynamically compute the image's width and height from here, so I had to hard-code it, which is 20px.

```js
node.attr('x', d => d.x - 20)
	.attr('y', d => d.y - 20);
```

## Hover effects

Cool hover effects! Made with the event functions (similar to "tick") `pointerover` and `pointerout`. Both of these functions have 2 arguments, `event` (which I never used, but can be helpful if you want to get the current mouse position) and `data`. Chain it to `node` because that's where you want the hover event to trigger.

```js
.on("pointerover", function (e, d) {
	// ...
}
```

It's a matter of finding which element the mouse is hovering over, and adjusting parameters accordingly. To find myself, simply do `d3.select(this)`. This is the node you're acting on.

```js
d3.select(this)
	.style('z-index', 9);
```

This brings the image currently being hovered to the very front.

To highlight related things, like the character's name and their relationships, we need to find them first, with a filter.

```js
nodeLabel.filter(l => l === d)
```

If `nodeLabel`'s data (which we assigned through the function `.data(nodes)`) matches this one, then we know it's the right one. We can make changes to it just like how we did above, but can't we do some transition animation?

```js
nodeLabel.filter(l => l === d)
	.transition()
	.ease(d3.easeCubicInOut)
	.duration(200)
	.attr('opacity', 1)
	.attr('font-size', 20)
	.style('z-index', 9)
	.attr('dy', 36);
```

After calling `transition()`, you can set an ease method, and [here](https://d3js.org/d3-ease)'s a list of them. I like cubic-in-out the best. Duration's in milliseconds. The stuff that's chained afterwards will be transitioned into during that time period.

For the link labels, the filtering method should look for their source and target instead.

```js
linkLabel1.filter(l => l.source === d)
	// ...
linkLabel2.filter(l => l.target === d)
	// ...
```

And finally, for links, matching either source or target is fine.

And then add a nearly-identical `pointerout` function that simply reverses any changes made in `pointerover`!

## Zooming

The following two sections, zooming and changing data, would require a bit of a structure rework, but is complete avoidable if you don't want to do them.

For zooming, all you need is a simple function call on `svg`. However, stuff gets funny so you need a wrapper. I called it, `bigG`.

```js
const bigG = svg.append('g');
```

After that, change everything to be appended to `bigG` instead of `svg`. If you search the file, you should only come across 3 instances of `svg` now, at initialization, `bigG`'s initialization, and the final `svg.node()`.

And then, chain this function call to `svg`.

```js
.call(d3.zoom()
	.on("zoom", (event) => {
		bigG.attr("transform", event.transform);
	}));
```

Hooray, now you can zoom and pan!

### Font sizes

But hey, now the font sizes are also increasing as you zoom, but I don't want that, because when I zoom in it's because I want to see the jumbled text more clearly. How do we prevent that?

The zoom function provides an `event` variable, which has an `event.transform.k`. That's the ratio of how much you've been zooming. Using that, we can set dynamic font sizes. Dividing the font size by `event.transform.k`, we can make them smaller as we zoom. This also entails replacing every hard-coded font size with variables. I have three of them, `font12`, `font16`, and `font20`, for different sizes. They're set to 12, 16, and 20 initially, but divided by `event.transform.k` on every zoom function call.

## Changing data

Here comes the new part that I did recently, which was changing your data in real time.

It's actually kinda simple now that I look back. Basically, remember how we defined every single element group with `const`? Don't. Define them as `let`s at the top of the script, and of course remember to remove the `const`s that came later.

And then, wrap all your rendering code in a big function called `updateGraph(data)`, or whatever you like, really. It should contain everything except `bigG`'s and `svg`'s initializations, all the way until the end of the tick function (which also goes in there). Basically, everything that has a reference to data, either `nodes` or `links`, should be changeable and shoved into the function.

And then, near the top of `updateGraph`, get rid of everything inside `bigG`.

```js
if (bigG) bigG.selectAll('*').remove();
```

Every time you get some new data, call `updateGraph` with the new data, and a new graph will appear in place of the old one!

As for filtering the data itself, that's pretty much another topic, but one thing to note is to not include links that link to non-existent nodes. I'll talk about my specific approach below.

### Filtering data

Now, this is messy. It's a mess. There are too many loops. I tried logging some stuff in a loop once and apparently it was called more than *10 thousand* times. This is why if you drag the slider too often it lags.

The `setFocus(ch, d)` function is called every time the focus character or the depth changes. If "none" is selected, then all characters are shown and the depth slider is disabled. Otherwise, filter out relationships with `ch` and `d`.

The main `for` loop will run for `depth` times, and each run of the loop will add to the new characters array characters that have immediate links to the ones already in the list. So the convoluted statement in the loop states:

- Filter out the original character array (`data.ch`), finding characters that satisfying condition A.
- Condition A is: the character doesn't already exist in the new array (`chNew`), and condition B.
- Condition B is: for the current character, there exists a relationship that satisfies condition C.
- Condition C is: for the both sides of the relationship, `source` and `target`, one of them is the current character, and the other is a character that exists in `chNew`).

On condition C was where I got stuck, because of the aforementioned link list mutation that D3 does behind my back. So originally where `r.target` was a string containing the target's id, it's now an object, and to get the id you have to write `r.target.id`.

There is probably a way more efficient way to write this, but I'm too lazy to think right now.

Now that we have our list of characters, just filter out the relationships where both sides are characters in `chNew`. And call `updateGraph` with the new data!

---

[Here](https://github.com/Tofutush/The-Iron-Ragdoll/blob/main/js/graph.js) is my code for you to look at. It's a little different from what I presented here, some places are tidier and some are messier. It's still up to you to decide how your graph will look like!
