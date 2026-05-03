"use client";

import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  BoldIcon,
  Code2Icon,
  Heading2Icon,
  Heading3Icon,
  ImagePlusIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  PenLineIcon,
  QuoteIcon,
  RedoIcon,
  StrikethroughIcon,
  UnderlineIcon,
  UndoIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { uploadCoverFromForm } from "@/app/admin/_actions/posts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

export function RichTextEditor({ value, onChange, placeholder, className }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [bodyTab, setBodyTab] = useState<"visual" | "html">("visual");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        bulletList: { keepMarks: true, keepAttributes: false },
      }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      Image.configure({ allowBase64: false }),
      Placeholder.configure({
        placeholder: placeholder ?? "Paste from Google Docs, Word, or write here…",
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "tiptap min-h-[320px] max-w-none px-4 py-4 text-sm leading-relaxed focus:outline-none [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-muted [&_blockquote]:pl-4 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:my-1 [&_img]:max-h-[480px] [&_img]:rounded-lg [&_img]:object-contain [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6",
      },
    },
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor || bodyTab !== "visual") return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value, bodyTab]);

  if (!editor) return null;

  return (
    <div className={cn("rounded-2xl border border-border/80 bg-muted/20", className)}>
      <Tabs
        value={bodyTab}
        onValueChange={(v) => setBodyTab(v === "html" ? "html" : "visual")}
        className="gap-0"
      >
        <div className="flex flex-col gap-2 border-b border-border/80 bg-background px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex min-w-0 flex-col gap-1.5">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Editor mode
            </span>
            <TabsList className="h-10 w-full min-w-[min(100%,280px)] rounded-lg bg-muted p-1 sm:w-auto">
              <TabsTrigger value="visual" className="gap-1.5 px-3 text-sm flex-1 sm:flex-none">
                <PenLineIcon className="size-4 shrink-0 opacity-70" aria-hidden />
                Visual
              </TabsTrigger>
              <TabsTrigger value="html" className="gap-1.5 px-3 text-sm flex-1 sm:flex-none">
                <Code2Icon className="size-4 shrink-0 opacity-70" aria-hidden />
                HTML source
              </TabsTrigger>
            </TabsList>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground sm:max-w-[min(100%,420px)] sm:text-right">
            Raw HTML goes in <strong className="font-medium text-foreground">HTML source</strong>. Scripts and unsafe
            tags are removed when you save.
          </p>
        </div>

        <TabsContent value="visual" className="mt-0 flex flex-col">
          <div className="flex flex-wrap gap-1 border-b border-border/80 bg-background px-2 py-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive("bold")}
              label="Bold"
            >
              <BoldIcon className="h-4 w-4" aria-hidden />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive("italic")}
              label="Italic"
            >
              <ItalicIcon className="h-4 w-4" aria-hidden />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              active={editor.isActive("underline")}
              label="Underline"
            >
              <UnderlineIcon className="h-4 w-4" aria-hidden />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              active={editor.isActive("strike")}
              label="Strike"
            >
              <StrikethroughIcon className="h-4 w-4" aria-hidden />
            </ToolbarButton>
            <span className="mx-1 w-px bg-border" aria-hidden />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              active={editor.isActive("heading", { level: 2 })}
              label="Heading 2"
            >
              <Heading2Icon className="h-4 w-4" aria-hidden />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              active={editor.isActive("heading", { level: 3 })}
              label="Heading 3"
            >
              <Heading3Icon className="h-4 w-4" aria-hidden />
            </ToolbarButton>
            <span className="mx-1 w-px bg-border" aria-hidden />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive("bulletList")}
              label="Bulleted list"
            >
              <ListIcon className="h-4 w-4" aria-hidden />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive("orderedList")}
              label="Numbered list"
            >
              <ListOrderedIcon className="h-4 w-4" aria-hidden />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive("blockquote")}
              label="Quote"
            >
              <QuoteIcon className="h-4 w-4" aria-hidden />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => {
                const prev = editor.getAttributes("link").href as string | undefined;
                const url = window.prompt("Link URL", prev ?? "https://");
                if (!url) return;
                editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
              }}
              active={editor.isActive("link")}
              label="Link"
            >
              <LinkIcon className="h-4 w-4" aria-hidden />
            </ToolbarButton>
            <ToolbarButton onClick={() => fileRef.current?.click()} label="Insert image">
              <ImagePlusIcon className="h-4 w-4" aria-hidden />
            </ToolbarButton>
            <span className="mx-1 w-px bg-border" aria-hidden />
            <ToolbarButton onClick={() => editor.chain().focus().undo().run()} label="Undo">
              <UndoIcon className="h-4 w-4" aria-hidden />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().redo().run()} label="Redo">
              <RedoIcon className="h-4 w-4" aria-hidden />
            </ToolbarButton>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              const fd = new FormData();
              fd.set("file", file);
              try {
                const { url } = await uploadCoverFromForm(fd);
                editor.chain().focus().setImage({ src: url }).run();
              } catch {
                window.alert("Upload failed. Check Supabase storage bucket and admin session.");
              }
            }}
          />
          <EditorContent editor={editor} className="rounded-b-2xl bg-background" />
        </TabsContent>

        <TabsContent value="html" className="mt-0 p-3">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            className="min-h-[420px] w-full resize-y rounded-xl border border-input bg-background px-3 py-3 font-mono text-xs leading-relaxed text-foreground shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="HTML source"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  active,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  label: string;
}) {
  return (
    <Button
      type="button"
      size="xs"
      variant={active ? "default" : "ghost"}
      title={label}
      className="rounded-lg px-2"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      <span className="sr-only">{label}</span>
      {children}
    </Button>
  );
}
