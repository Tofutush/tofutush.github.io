import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const raw = fs.readFileSync(path.join(__dirname, '../blog/pages/microblog.md'), 'utf-8');

// split on entry separators
const blocks = raw.split('---').map(b => b.trim()).filter(Boolean);

const entries = [];

// start from 1 bc we need to skip the frontmatter
for (let i = 1; i < blocks.length; i++) {
	const block = blocks[i];

	const lines = block.split("\n").map(l => l.trim());
	const entry = {
		date: null,
		tags: [],
		content: ""
	};

	let inContent = false;
	const contentLines = [];

	for (const line of lines) {
		if (line.startsWith("date:")) {
			entry.date = line.replace("date:", "").trim();
		} else if (line.startsWith("tags:")) {
			entry.tags = line
				.replace("tags:", "")
				.split(",")
				.map(t => t.trim())
				.filter(Boolean);
		} else if (line.startsWith("content:")) {
			inContent = true;
		} else if (inContent) {
			contentLines.push(line);
		}
	}
	entry.content = contentLines.join("\n\n").trim();
	entries.push(entry);
}

export default {
	entries: entries.sort((a, b) => b.date.localeCompare(a.date)),
	tags: [...new Set(entries.flatMap(p => p.tags))].sort()
};
