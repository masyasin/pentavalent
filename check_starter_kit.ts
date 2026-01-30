
import StarterKit from '@tiptap/starter-kit';

console.log('Checking StarterKit extensions...');
const extensions = StarterKit.configure().extensions;
const names = extensions.map(e => e.name);
console.log('Extension names in StarterKit:', JSON.stringify(names, null, 2));
