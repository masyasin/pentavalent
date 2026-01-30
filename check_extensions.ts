
import StarterKit from '@tiptap/starter-kit';
import { Editor } from '@tiptap/core';

const editor = new Editor({
    extensions: [StarterKit],
});

console.log('Extensions in editor:', editor.extensionManager.extensions.map(e => e.name));
