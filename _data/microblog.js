import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const raw = fs.readFileSync(path.join(__dirname, '../blog/pages/microblog.md'), 'utf-8');

// split on entry separators
const blocks = raw.split('---').map(b => b.trim()).filter(Boolean);

const entries = [];

let readPlay = blocks[1].split('\n').map(b => b.trim()).filter(Boolean);
let reading = readPlay[0].split(':')[1].trim();
let playing = readPlay[1].split(':')[1].trim();

// start from 2 bc we need to skip the frontmatter & reading/playing
for (let z = 2; z < blocks.length; z++) {
	let split = blocks[z].split("content:\n");
	let data = split[0].split('\n').filter(Boolean).map(l => l.trim());
	entries.push({
		date: data[0].split(':')[1].trim(),
		tags: data[1].split(':')[1].split(',').filter(Boolean).map(t => t.trim()),
		content: split[1].trim()
	});
}

export default {
	entries: entries.sort((a, b) => b.date.localeCompare(a.date)),
	tags: [...new Set(entries.flatMap(p => p.tags))].sort(),
	reading,
	playing
};
