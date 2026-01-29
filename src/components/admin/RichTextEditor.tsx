import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { Link } from '@tiptap/extension-link';
import { TextAlign } from '@tiptap/extension-text-align';
import { Image } from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Youtube } from '@tiptap/extension-youtube';
import { Typography } from '@tiptap/extension-typography';
import { CharacterCount } from '@tiptap/extension-character-count';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, Quote, Heading1, Heading2, Heading3,
    Link as LinkIcon, Image as ImageIcon, Video, Table as TableIcon,
    Eraser, Undo, Redo, Type, Highlighter, Subscript as SubIcon, Superscript as SuperIcon,
    CheckSquare
} from 'lucide-react';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const MenuButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title
}: {
    onClick: (e: React.MouseEvent) => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
}) => (
    <button
        type="button"
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
        disabled={disabled}
        title={title}
        className={`p-2 rounded-lg transition-all ${isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
            } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
    >
        {children}
    </button>
);

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange, placeholder = 'Write something...' }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: { keepMarks: true, keepAttributes: false },
                orderedList: { keepMarks: true, keepAttributes: false },
            }),
            Underline,
            Link.configure({ openOnClick: false }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Image.configure({ allowBase64: true }),
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            Subscript,
            Superscript,
            Typography,
            Placeholder.configure({ placeholder }),
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            TaskList,
            TaskItem.configure({ nested: true }),
            Youtube.configure({ width: 480, height: 320 }),
            CharacterCount,
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) return null;

    const addImage = () => {
        const url = window.prompt('Enter image URL');
        if (url) editor.chain().focus().setImage({ src: url }).run();
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="w-full border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                <div className="flex items-center gap-1 pr-2 border-r border-gray-200 mr-2">
                    <MenuButton
                        title="Undo"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                    >
                        <Undo size={18} />
                    </MenuButton>
                    <MenuButton
                        title="Redo"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                    >
                        <Redo size={18} />
                    </MenuButton>
                </div>

                <div className="flex items-center gap-1 pr-2 border-r border-gray-200 mr-2">
                    <MenuButton
                        title="Heading 1"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                    >
                        <Heading1 size={18} />
                    </MenuButton>
                    <MenuButton
                        title="Heading 2"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                    >
                        <Heading2 size={18} />
                    </MenuButton>
                    <MenuButton
                        title="Heading 3"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        isActive={editor.isActive('heading', { level: 3 })}
                    >
                        <Heading3 size={18} />
                    </MenuButton>
                </div>

                <div className="flex items-center gap-1 pr-2 border-r border-gray-200 mr-2">
                    <MenuButton
                        title="Bold"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                    >
                        <Bold size={18} />
                    </MenuButton>
                    <MenuButton
                        title="Italic"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                    >
                        <Italic size={18} />
                    </MenuButton>
                    <MenuButton
                        title="Underline"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive('underline')}
                    >
                        <UnderlineIcon size={18} />
                    </MenuButton>
                    <MenuButton
                        title="Strikethrough"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive('strike')}
                    >
                        <Strikethrough size={18} />
                    </MenuButton>
                    <MenuButton
                        title="Highlight"
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                        isActive={editor.isActive('highlight')}
                    >
                        <Highlighter size={18} />
                    </MenuButton>
                </div>

                <div className="flex items-center gap-1 pr-2 border-r border-gray-200 mr-2">
                    <MenuButton
                        title="Align Left"
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        isActive={editor.isActive({ textAlign: 'left' })}
                    >
                        <AlignLeft size={18} />
                    </MenuButton>
                    <MenuButton
                        title="Align Center"
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        isActive={editor.isActive({ textAlign: 'center' })}
                    >
                        <AlignCenter size={18} />
                    </MenuButton>
                    <MenuButton
                        title="Align Right"
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        isActive={editor.isActive({ textAlign: 'right' })}
                    >
                        <AlignRight size={18} />
                    </MenuButton>
                    <MenuButton
                        title="Align Justify"
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        isActive={editor.isActive({ textAlign: 'justify' })}
                    >
                        <AlignJustify size={18} />
                    </MenuButton>
                </div>

                <div className="flex items-center gap-1 pr-2 border-r border-gray-200 mr-2">
                    <MenuButton
                        title="Bullet List"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                    >
                        <List size={18} />
                    </MenuButton>
                    <MenuButton
                        title="Ordered List"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                    >
                        <ListOrdered size={18} />
                    </MenuButton>
                    <MenuButton
                        title="Task List"
                        onClick={() => editor.chain().focus().toggleTaskList().run()}
                        isActive={editor.isActive('taskList')}
                    >
                        <CheckSquare size={18} />
                    </MenuButton>
                </div>

                <div className="flex items-center gap-1">
                    <MenuButton title="Link" onClick={setLink} isActive={editor.isActive('link')}>
                        <LinkIcon size={18} />
                    </MenuButton>
                    <MenuButton title="Image" onClick={addImage}>
                        <ImageIcon size={18} />
                    </MenuButton>
                    <MenuButton title="Table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
                        <TableIcon size={18} />
                    </MenuButton>
                    <MenuButton title="Code Block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')}>
                        <Code size={18} />
                    </MenuButton>
                    <MenuButton title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')}>
                        <Quote size={18} />
                    </MenuButton>
                    <MenuButton title="Clear Format" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
                        <Eraser size={18} />
                    </MenuButton>
                </div>
            </div>

            {/* Editor Content */}
            <div className="prose prose-blue max-w-none min-h-[300px] p-6 focus:outline-none">
                <EditorContent editor={editor} />
            </div>

            {/* Word Count / Stats */}
            {editor.storage.characterCount && (
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {editor.storage.characterCount.words()} Words
                    </div>
                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
                        Ready to save
                    </div>
                </div>
            )}

            <style>{`
        .ProseMirror {
          min-height: 300px;
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 1rem 0;
          overflow: hidden;
        }
        .ProseMirror td, .ProseMirror th {
          min-width: 1em;
          border: 1px solid #ced4da;
          padding: 8px 12px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        .ProseMirror th {
          font-weight: bold;
          text-align: left;
          background-color: #f8f9fa;
        }
        .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
        }
        .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: center;
        }
        .ProseMirror ul[data-type="taskList"] input[type="checkbox"] {
          margin-right: 0.5rem;
        }
      `}</style>
        </div>
    );
};

export default RichTextEditor;
