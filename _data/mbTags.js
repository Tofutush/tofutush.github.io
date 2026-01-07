import mb from './microblog.json' with {type: 'json'};
export default [...new Set(mb.flatMap(p => p.tags))].sort();
