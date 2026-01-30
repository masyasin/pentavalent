import React, { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useEditor, EditorContent, Tiptap } from '@tiptap/react';
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
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import FloatingMenuExtension from '@tiptap/extension-floating-menu';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, Quote, Heading1, Heading2, Heading3,
    Link as LinkIcon, Image as ImageIcon, Video, Table as TableIcon,
    Eraser, Undo, Redo, Type, Highlighter, Subscript as SubIcon, Superscript as SuperIcon,
    CheckSquare, Youtube as YoutubeIcon, Maximize, Minus, MoreVertical, Plus,
    Trash2, Columns, Rows, Grid3X3, Palette
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
    title,
    activeColor = 'bg-blue-600 text-white shadow-lg shadow-blue-200'
}: {
    onClick: (e: React.MouseEvent) => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
    activeColor?: string;
}) => (
    <button
        type="button"
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
        disabled={disabled}
        title={title}
        className={`p-2 rounded-xl transition-all ${isActive
            ? activeColor
            : 'text-gray-500 hover:bg-gray-100 hover:text-blue-600'
            } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
    >
        {children}
    </button>
);

const ToolbarDivider = () => <div className="w-px h-6 bg-gray-200 mx-1" />;

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange, placeholder = 'Content goes here...' }) => {
    const extensions = React.useMemo(() => [
        StarterKit.configure({
            bulletList: { keepMarks: true, keepAttributes: false },
            orderedList: { keepMarks: true, keepAttributes: false },
            codeBlock: false,
        }),
        Underline,
        Link.configure({
            openOnClick: false,
            HTMLAttributes: {
                class: 'text-blue-600 underline cursor-pointer',
            },
        }),
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
    ], [placeholder]);

    const editor = useEditor({
        extensions,
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-blue max-w-none min-h-[400px] p-8 focus:outline-none focus:ring-0',
            },
        },
    });

    React.useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) return null;

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `editor/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            editor.chain().focus().setImage({ src: publicUrl }).run();
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const addImage = () => {
        const choice = window.confirm('Pilih metode:\nOK untuk Upload File\nCancel untuk URL Gambar');
        if (choice) {
            fileInputRef.current?.click();
        } else {
            const url = window.prompt('Masukkan URL Gambar:');
            if (url) editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const insertTable = () => {
        const rows = parseInt(window.prompt('Masukkan jumlah Baris (Rows):', '3') || '0');
        const cols = parseInt(window.prompt('Masukkan jumlah Kolom (Cols):', '3') || '0');

        if (rows > 0 && cols > 0) {
            editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
        }
    };

    const addYoutube = () => {
        const url = window.prompt('Enter YouTube URL');
        if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
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
        <div className="w-full border border-gray-200 rounded-[2.5rem] overflow-hidden bg-white shadow-xl shadow-blue-900/5 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-500 relative">

            {/* Main Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-3 bg-gray-50/50 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
                {/* History */}
                <div className="flex items-center gap-0.5">
                    <MenuButton title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                        <Undo size={18} />
                    </MenuButton>
                    <MenuButton title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                        <Redo size={18} />
                    </MenuButton>
                </div>

                <ToolbarDivider />

                {/* Headings */}
                <div className="flex items-center gap-0.5">
                    <MenuButton title="H1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })}>
                        <Heading1 size={18} />
                    </MenuButton>
                    <MenuButton title="H2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })}>
                        <Heading2 size={18} />
                    </MenuButton>
                    <MenuButton title="H3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })}>
                        <Heading3 size={18} />
                    </MenuButton>
                </div>

                <ToolbarDivider />

                {/* Basic Marks */}
                <div className="flex items-center gap-0.5">
                    <MenuButton title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
                        <Bold size={18} />
                    </MenuButton>
                    <MenuButton title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
                        <Italic size={18} />
                    </MenuButton>
                    <MenuButton title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')}>
                        <UnderlineIcon size={18} />
                    </MenuButton>
                    <MenuButton title="Strike" onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')}>
                        <Strikethrough size={18} />
                    </MenuButton>
                </div>

                <ToolbarDivider />

                {/* Colors & Style */}
                <div className="flex items-center gap-0.5">
                    <MenuButton title="Subscript" onClick={() => editor.chain().focus().toggleSubscript().run()} isActive={editor.isActive('subscript')}>
                        <SubIcon size={16} />
                    </MenuButton>
                    <MenuButton title="Superscript" onClick={() => editor.chain().focus().toggleSuperscript().run()} isActive={editor.isActive('superscript')}>
                        <SuperIcon size={16} />
                    </MenuButton>
                    <MenuButton title="Text Color" onClick={() => {
                        const color = window.prompt('Enter hex color (e.g. #FF0000)', editor.getAttributes('textStyle').color || '#000000');
                        if (color) editor.chain().focus().setColor(color).run();
                    }}>
                        <Palette size={18} className={editor.getAttributes('textStyle').color ? 'text-blue-600' : ''} />
                    </MenuButton>
                    <MenuButton title="Highlight" onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')}>
                        <Highlighter size={18} />
                    </MenuButton>
                </div>

                <ToolbarDivider />

                {/* Alignment */}
                <div className="flex items-center gap-0.5">
                    <MenuButton title="Left" onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })}>
                        <AlignLeft size={18} />
                    </MenuButton>
                    <MenuButton title="Center" onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })}>
                        <AlignCenter size={18} />
                    </MenuButton>
                    <MenuButton title="Right" onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })}>
                        <AlignRight size={18} />
                    </MenuButton>
                    <MenuButton title="Justify" onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })}>
                        <AlignJustify size={18} />
                    </MenuButton>
                </div>

                <ToolbarDivider />

                {/* Lists */}
                <div className="flex items-center gap-0.5">
                    <MenuButton title="Bullets" onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>
                        <List size={18} />
                    </MenuButton>
                    <MenuButton title="Ordered" onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}>
                        <ListOrdered size={18} />
                    </MenuButton>
                    <MenuButton title="Tasks" onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')}>
                        <CheckSquare size={18} />
                    </MenuButton>
                </div>

                <ToolbarDivider />

                {/* Insertables */}
                <div className="flex items-center gap-0.5">
                    <MenuButton title="Link" onClick={setLink} isActive={editor.isActive('link')}>
                        <LinkIcon size={18} />
                    </MenuButton>
                    <MenuButton title="Image" onClick={addImage}>
                        <ImageIcon size={18} />
                    </MenuButton>
                    <MenuButton title="YouTube" onClick={addYoutube}>
                        <YoutubeIcon size={18} />
                    </MenuButton>
                    <MenuButton title="Table" onClick={insertTable}>
                        <TableIcon size={18} />
                    </MenuButton>
                </div>

                <div className="flex-1" />

                <div className="flex items-center gap-0.5">
                    <MenuButton title="Clear Format" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
                        <Eraser size={18} />
                    </MenuButton>
                </div>
            </div>

            {/* Tiptap v3 Declarative Editor */}
            <Tiptap instance={editor}>
                {/* 
                  BubbleMenu and FloatingMenu removed as per user request
                */}

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                />

                {/* Editor Content Area */}
                <div className="relative">
                    <Tiptap.Content />

                    {/* Dynamic Table Controls (Only visible when in table) */}
                    {editor.isActive('table') && (
                        <div className="absolute top-4 right-8 flex gap-1 p-2 bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-100 animate-in fade-in slide-in-from-right-4">
                            <MenuButton title="Add Row" onClick={() => editor.chain().focus().addRowAfter().run()}><Rows size={14} /></MenuButton>
                            <MenuButton title="Add Col" onClick={() => editor.chain().focus().addColumnAfter().run()}><Columns size={14} /></MenuButton>
                            <MenuButton title="Delete Table" onClick={() => editor.chain().focus().deleteTable().run()} activeColor="bg-red-500 text-white"><Trash2 size={14} /></MenuButton>
                        </div>
                    )}
                </div>
            </Tiptap>

            {/* Bottom Info Bar */}
            <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2"><Type size={12} className="text-blue-500" /> {editor.storage.characterCount.words()} Words</span>
                    <span className="flex items-center gap-2 font-medium">{editor.storage.characterCount.characters()} Characters</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-500 italic">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Live Syncing
                </div>
            </div>

            <style>{`
                .ProseMirror {
                    min-height: 400px;
                    outline: none;
                }
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #adb5bd;
                    pointer-events: none;
                    height: 0;
                    font-style: italic;
                }
                .ProseMirror table {
                    border-collapse: collapse;
                    table-layout: fixed;
                    width: 100%;
                    margin: 2rem 0;
                    overflow: hidden;
                    border-radius: 1rem;
                    border: 1px solid #e5e7eb;
                }
                .ProseMirror td, .ProseMirror th {
                    min-width: 1em;
                    border: 1px solid #e5e7eb;
                    padding: 12px 16px;
                    vertical-align: top;
                    box-sizing: border-box;
                    position: relative;
                }
                .ProseMirror th {
                    font-weight: 800;
                    text-align: left;
                    background-color: #f9fafb;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    letter-spacing: 0.05em;
                }
                .ProseMirror .selectedCell:after {
                    z-index: 2;
                    content: "";
                    position: absolute;
                    left: 0; right: 0; top: 0; bottom: 0;
                    background: rgba(37, 99, 235, 0.08);
                    pointer-events: none;
                }
                .ProseMirror ul[data-type="taskList"] {
                    list-style: none;
                    padding: 0;
                }
                .ProseMirror ul[data-type="taskList"] li {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                    margin-bottom: 0.5rem;
                }
                .ProseMirror ul[data-type="taskList"] input[type="checkbox"] {
                    margin-top: 0.4rem;
                    cursor: pointer;
                    width: 1rem;
                    height: 1rem;
                    border-radius: 0.25rem;
                    border: 2px solid #3b82f6;
                }
                .ProseMirror iframe {
                    border-radius: 1.5rem;
                    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
                    margin: 2rem auto;
                    display: block;
                    border: 8px solid white;
                }
                .prose pre {
                    background: #1e293b;
                    color: #f8fafc;
                    padding: 1.5rem;
                    border-radius: 1rem;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.9rem;
                    line-height: 1.6;
                }
                .prose blockquote {
                    border-left: 4px solid #3b82f6;
                    background: #eff6ff;
                    padding: 1.5rem;
                    border-radius: 0 1rem 1rem 0;
                    font-style: italic;
                    color: #1e40af;
                }
            `}</style>
        </div>
    );
};

export default RichTextEditor;
