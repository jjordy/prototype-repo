import React, { useCallback, useMemo, useRef } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, useSlate, Slate, ReactEditor } from "slate-react";
import {
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement,
  BaseEditor,
} from "slate";
import { withHistory, HistoryEditor } from "slate-history";
import cn from "classnames";

import {
  BiBold,
  BiItalic,
  BiUnderline,
  BiCode,
  BiHeading,
  BiListOl,
  BiListUl,
  BiAlignJustify,
  BiAlignMiddle,
  BiAlignRight,
  BiAlignLeft,
  BiChat,
} from "react-icons/bi";

const HOTKEYS: Record<string, string> = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const Button = ({ active, children, ...rest }: any) => {
  return (
    <button
      type="button"
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded text-slate-500",
        active && "!bg-slate-900 text-slate-100"
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

type CustomElement = { type: string; children: CustomText[]; align?: string };
type CustomText = {
  text: string;
  bold?: true;
  italic?: true;
  code?: true;
  underline?: true;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

export const RichTextEditor = ({
  initialValue = defaultInitialValue,
  onChange,
}: {
  initialValue: Descendant[];
  onChange: (value: Descendant[]) => void;
}) => {
  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <Slate editor={editor} value={initialValue} onChange={onChange}>
      <div className="flex items-center rounded-t-2xl border border-slate-200 bg-slate-100 p-1">
        <MarkButton format="bold" children={<BiBold />} />
        <MarkButton format="italic" children={<BiItalic />} />
        <MarkButton format="underline" children={<BiUnderline />} />
        <MarkButton format="code" children={<BiCode />} />
        <BlockButton
          format="heading-one"
          children={
            <div className="flex items-center text-xs">
              <BiHeading />1
            </div>
          }
        />
        <BlockButton
          format="heading-two"
          children={
            <div className="flex items-center text-xs">
              <BiHeading />2
            </div>
          }
        />
        <BlockButton format="block-quote" children={<BiChat />} />
        <BlockButton format="numbered-list" children={<BiListOl />} />
        <BlockButton format="bulleted-list" children={<BiListUl />} />
        <BlockButton format="left" children={<BiAlignLeft />} />
        <BlockButton format="center" children={<BiAlignMiddle />} />
        <BlockButton format="right" children={<BiAlignRight />} />
        <BlockButton format="justify" children={<BiAlignJustify />} />
      </div>
      <div className="mb-2 rounded-b-2xl border-b border-r border-l border-slate-300 bg-white py-2 px-4">
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some rich text…"
          spellCheck
          className="prose prose-slate container mx-auto min-h-[150px] max-w-[1150px]"
          autoFocus
          onKeyDown={(event) => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event as any)) {
                event.preventDefault();
                const mark = HOTKEYS[hotkey];
                toggleMark(editor, mark);
              }
            }
          }}
        />
      </div>
    </Slate>
  );
};

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: Editor, format: string, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        //@ts-expect-error
        n[blockType] === format,
    })
  );

  return !!match;
};

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  //@ts-expect-error
  return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }: any) => {
  const style = { textAlign: element.align };
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    case "code":
      return (
        <div>
          <pre style={style} {...attributes}>
            <code>{children}</code>
          </pre>
        </div>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, children }: any) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
      )}
      onMouseDown={(event: any) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <span>{children}</span>
    </Button>
  );
};

const MarkButton = ({ format, children }: any) => {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event: any) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <span>{children}</span>
    </Button>
  );
};

const defaultInitialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];
