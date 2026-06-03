'use client';

import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer, type ReactNodeViewProps } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Node, mergeAttributes } from '@tiptap/core';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/lib/supabase';

// ─── CTA CUSTOM EXTENSION ───
// ─── CTA CUSTOM EXTENSION ───
const CTANodeView = (props: ReactNodeViewProps) => {
  const { type, phone } = props.node.attrs as { type: string; phone?: string };
  const isCall = type === 'call';
  const title = "Gérez votre prochain événement avec Eventzone";
  const desc = "La plateforme tout-en-un pour organiser, gérer et analyser vos événements professionnels.";
  const btnText = isCall ? `Appeler : ${phone}` : 'Demander une démo';

  return (
    <NodeViewWrapper className="cta-node-view my-10 group relative">
      <div
        contentEditable={false}
        className="p-8 rounded-2xl bg-[#0a0f1d] border border-primary/20 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32" />
        <div className="relative">
          <p className="font-heading font-bold text-heading-sm text-white mb-2 leading-tight">
            {title}
          </p>
          <p className="text-body-sm text-text-muted mb-6 max-w-xl">
            {desc}
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-caption font-bold rounded-xl shadow-glow hover:scale-105 transition-all">
            {btnText}
            {!isCall && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            )}
          </div>
        </div>
        {/* Selection overlay */}
        <div className="absolute inset-0 rounded-2xl border-2 border-primary/0 group-[.base-node-selected]:border-primary/100 pointer-events-none transition-all" />
      </div>
    </NodeViewWrapper>
  );
};

const CTAExtension = Node.create({
  name: 'cta',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      type: {
        default: 'demo',
        parseHTML: element => element.getAttribute('data-type') || 'demo',
        renderHTML: attributes => ({ 'data-type': attributes.type }),
      },
      phone: {
        default: '',
        parseHTML: element => element.getAttribute('data-phone') || '',
        renderHTML: attributes => ({ 'data-phone': attributes.phone }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-cta="true"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    const isCall = HTMLAttributes.type === 'call';
    const title = "Gérez votre prochain événement avec Eventzone";
    const desc = "La plateforme tout-en-un pour organiser, gérer et analyser vos événements professionnels.";
    const btnText = isCall ? `Appeler : ${HTMLAttributes.phone}` : 'Demander une démo';
    const href = isCall ? `tel:${HTMLAttributes.phone}` : 'https://calendly.com/eventzone114/eventzone-demo-meeting-all-in-one-event-management';

    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-cta': 'true',
        class: 'my-10 p-8 rounded-2xl bg-[#0a0f1d] border border-primary/20 relative overflow-hidden text-left'
      }),
      ['div', { class: 'absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32' }],
      ['div', { class: 'relative' },
        ['p', { class: 'font-heading font-bold text-heading-sm text-white mb-2 leading-tight', style: 'color: white; font-size: 24px; margin-bottom: 8px;' }, title],
        ['p', { class: 'text-body-sm text-text-muted mb-6 max-w-xl', style: 'color: #94a3b8; font-size: 14px; margin-bottom: 24px;' }, desc],
        ['a', {
          href,
          target: isCall ? undefined : '_blank',
          class: 'inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-caption font-bold rounded-xl shadow-glow no-underline',
          style: 'background-color: #3b82f6; color: white; padding: 10px 24px; border-radius: 12px; font-weight: bold; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;'
        }, btnText,
          !isCall ? ['span', { style: 'font-size: 16px' }, '→'] : '']
      ]
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CTANodeView)
  },
})

// ─── UI COMPONENTS ───

const ToolbarButton = ({
  onClick,
  active,
  title,
  children,
  disabled = false,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    disabled={disabled}
    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30 ${active
        ? 'bg-primary text-white'
        : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
      }`}
  >
    {children}
  </button>
);

interface RichEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function RichEditor({ content, onChange }: RichEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showCTAInput, setShowCTAInput] = useState(false);
  const [ctaPhone, setCtaPhone] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        codeBlock: false,
      }),
      Image.configure({
        HTMLAttributes: { class: 'rounded-xl max-w-full my-4 mx-auto block' },
        allowBase64: true
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-primary underline cursor-pointer' },
        validate: href => !!href,
      }),
      Placeholder.configure({ placeholder: 'Racontez votre histoire...' }),
      CTAExtension,
    ],
    content: content || '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose-eventzone min-h-[500px] outline-none px-4 py-2',
      },
    },
    onUpdate: ({ editor }) => {
      // Don't call onChange if the content is functionally identical
      // This prevents infinite loop issues in React
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Handle external content updates (like loading from DB)
  // We only update if the editor is NOT focused, to avoid cursor jumping while typing
  useEffect(() => {
    if (editor && content !== undefined && !editor.isFocused) {
      const currentHTML = editor.getHTML();
      if (content !== currentHTML) {
        editor.commands.setContent(content, false);
      }
    }
  }, [content, editor]);

  // LINK HANDLING
  const openLinkModal = () => {
    if (editor?.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const previousUrl = editor?.getAttributes('link').href;
    setLinkUrl(previousUrl || '');
    setShowLinkInput(true);
  };

  const applyLink = () => {
    if (linkUrl) {
      editor?.chain().focus().setLink({ href: linkUrl }).run();
    }
    setShowLinkInput(false);
    setLinkUrl('');
  };

  // CTA HANDLING
  const insertCTA = (type: 'call' | 'demo') => {
    if (type === 'call') {
      setShowCTAInput(true);
    } else {
      editor?.chain().focus().insertContent({ type: 'cta', attrs: { type: 'demo' } }).run();
      setShowCTAInput(false);
    }
  };

  const applyCallCTA = () => {
    if (ctaPhone) {
      editor?.chain().focus().insertContent({ type: 'cta', attrs: { type: 'call', phone: ctaPhone } }).run();
    }
    setShowCTAInput(false);
    setCtaPhone('');
  };

  // IMAGE HANDLING
  const addImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !editor) return;

      try {
        const fileName = `blog/editor-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const { error } = await supabase.storage.from('blog-assets').upload(fileName, file);
        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage.from('blog-assets').getPublicUrl(fileName);
        editor.chain().focus().setImage({ src: publicUrl }).run();
      } catch (err: any) {
        alert('Erreur upload : ' + (err as Error).message);
      }
    };
    input.click();
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!editor) return null;

  const toolbarAndModals = (
    <>
      {/* --- FLOATING TOOLBAR MODALS --- */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-2xl px-4 pointer-events-none">
        {(showLinkInput || showCTAInput) && (
          <div className="pointer-events-auto">
            {showLinkInput && (
              <div className="p-3 bg-surface border border-primary shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl animate-fade-in-up flex gap-2 items-center mb-4 backdrop-blur-xl">
                <input
                  autoFocus
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyLink()}
                  placeholder="Entrez l'URL du lien..."
                  className="input py-2 text-sm flex-1"
                />
                <button type="button" onClick={applyLink} className="btn-primary py-2 px-4 shadow-glow">OK</button>
                <button type="button" onClick={() => setShowLinkInput(false)} className="btn-secondary py-2 px-4">Annuler</button>
              </div>
            )}

            {showCTAInput && (
              <div className="p-3 bg-surface border border-primary shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl animate-fade-in-up flex gap-2 items-center mb-4 backdrop-blur-xl">
                <input
                  autoFocus
                  type="text"
                  value={ctaPhone}
                  onChange={(e) => setCtaPhone(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyCallCTA()}
                  placeholder="Numéro de téléphone (ex: +33...)"
                  className="input py-2 text-sm flex-1"
                />
                <button type="button" onClick={applyCallCTA} className="btn-primary py-2 px-4 shadow-glow">Insérer</button>
                <button type="button" onClick={() => setShowCTAInput(false)} className="btn-secondary py-2 px-4">Annuler</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- MAIN FLOATING TOOLBAR (Figma Style) --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-1 p-2 bg-[#0d1117]/90 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_25px_60px_rgba(0,0,0,0.6)] animate-fade-in-up hover:border-primary/40 transition-all group ring-1 ring-white/5">
        <div className="flex items-center gap-1 px-1">
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Titre H2">
            <span className="font-bold text-[11px] uppercase">H2</span>
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Titre H3">
            <span className="font-bold text-[11px] uppercase">H3</span>
          </ToolbarButton>
        </div>

        <div className="w-px h-6 bg-white/10 mx-1" />

        <div className="flex items-center gap-1">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Gras">
            <span className="font-extrabold text-sm">B</span>
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italique">
            <span className="italic font-serif text-sm">I</span>
          </ToolbarButton>
        </div>

        <div className="w-px h-6 bg-white/10 mx-1" />

        <div className="flex items-center gap-1">
          <ToolbarButton onClick={openLinkModal} active={editor.isActive('link')} title="Ajouter un lien">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
          </ToolbarButton>

          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Liste">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
          </ToolbarButton>

          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Citation">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" /></svg>
          </ToolbarButton>
        </div>

        <div className="w-px h-6 bg-white/10 mx-1" />

        <div className="flex items-center gap-1 mr-1">
          <ToolbarButton onClick={addImage} active={false} title="Ajouter une image">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
          </ToolbarButton>

          <button
            type="button"
            onClick={() => insertCTA('demo')}
            className="flex items-center gap-1.5 text-[9px] font-bold px-3 py-1.5 rounded-full bg-primary/20 text-text-primary hover:bg-primary transition-all uppercase tracking-tight ml-2"
          >
            <span className="text-primary group-hover:text-white transition-colors">✦</span>
            CTA Démo
          </button>
          <button
            type="button"
            onClick={() => insertCTA('call')}
            className="flex items-center gap-1.5 text-[9px] font-bold px-3 py-1.5 rounded-full bg-secondary/20 text-text-primary hover:bg-secondary transition-all uppercase tracking-tight"
          >
            <span className="text-secondary group-hover:text-white transition-colors">📞</span>
            CTA Appel
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="card overflow-visible relative">
      {mounted && createPortal(toolbarAndModals, document.body)}

      {/* --- EDITOR CONTENT AREA --- */}
      <div className="p-2 bg-surface min-h-[500px]">
        <EditorContent editor={editor} />
      </div>

      {/* Help info */}
      <div className="p-2 border-t border-border flex justify-between items-center text-[10px] text-text-muted bg-surface-hover/20">
        <span>Appuyez sur Entrée pour un nouveau paragraphe</span>
        <span>Moderna Eventzone Blog v1.2</span>
      </div>
    </div>
  );
}
