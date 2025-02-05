import React, { PropsWithChildren, Ref, useCallback, useEffect, useMemo } from 'react'
import { Form, Icon } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { Editor, Transforms, createEditor, Element as SlateElement } from 'slate'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import { withHistory } from 'slate-history'
import isHotkey from 'is-hotkey'
import clsx from 'clsx'

import { convertToSlate } from '../../../lib/utils/slateMdConversion'
import CustomTooltip from '../../common/CustomTooltip'

interface Props {
  activeVersion: number
  disabled?: boolean
  error?: any
  onChange: any
  touched: any
  value: any
  versions?: any
}

const defaultProps = {
  disabled: false,
  error: '',
  versions: undefined,
}

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+`': 'code',
}
const LIST_TYPES = ['numbered-list', 'bulleted-list']
type OrNull<T> = T | null

function ContentInput({
  value,
  versions,
  onChange,
  error,
  touched,
  disabled,
  activeVersion,
}: Props): React.ReactElement {
  const renderElement = useCallback((props) => <Element {...props} />, [])
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  useEffect(() => {
    if (versions) {
      if (activeVersion < versions.length) {
        // @ts-ignore
        editor.children = convertToSlate(versions[activeVersion].content)
      } else {
        // @ts-ignore
        editor.children = convertToSlate(versions[versions.length - 1].content)
      }
    }
  }, [activeVersion, versions])

  return (
    <div className={clsx(disabled && 'pointer-events-none opacity-70')}>
      <Form.Field required error={touched && error}>
        <div className="mt-2 border border-solid rounded">
          {/* eslint-disable-next-line react/no-children-prop */}
          <Slate editor={editor} value={value} onChange={onChange}>
            <div className="flex flex-row w-full p-1.5 mb-2 mr-10 h-10 bg-grey-20">
              <div className="flex flex-row flex-1 gap-2">
                <CustomTooltip
                  className={clsx(isMarkActive(editor, 'bold') && '!bg-grey-40')}
                  content={
                    <FormattedMessage
                      defaultMessage="Select this for bold text. The same can be achieved by using the standard keyboard combination cmd/ctrl+b."
                      id="slateEditor.formatContent.bold"
                    />
                  }
                  iconObject={
                    <a data-tip>
                      <MarkButton className="" format="bold" icon="bold" />
                    </a>
                  }
                />
                <CustomTooltip
                  className={clsx(isMarkActive(editor, 'italic') && '!bg-grey-40')}
                  content={
                    <FormattedMessage
                      defaultMessage="Select this for italic text. The same can be achieved by using the standard keyboard combination cmd/ctrl+i."
                      id="slateEditor.formatContent.italic"
                    />
                  }
                  iconObject={
                    <a data-tip>
                      <MarkButton className="" format="italic" icon="italic" />
                    </a>
                  }
                />
                <CustomTooltip
                  className={clsx(isMarkActive(editor, 'code') && '!bg-grey-40')}
                  content={
                    <FormattedMessage
                      defaultMessage="Select this for code style."
                      id="slateEditor.formatContent.code"
                    />
                  }
                  iconObject={
                    <a data-tip>
                      <MarkButton className="" format="code" icon="code" />
                    </a>
                  }
                />
                <CustomTooltip
                  className={clsx(isBlockActive(editor, 'block-quote') && '!bg-grey-40')}
                  content={
                    <FormattedMessage
                      defaultMessage="Select this to display a block quote. Be advised that a new paragraph (by pressing enter) will be represented as a new quote"
                      id="slateEditor.formatContent.quote"
                    />
                  }
                  iconObject={
                    <a data-tip>
                      <BlockButton className="" format="block-quote" icon="quote right" />
                    </a>
                  }
                />
                <CustomTooltip
                  className={clsx(isBlockActive(editor, 'numbered-list') && '!bg-grey-40')}
                  content={
                    <FormattedMessage
                      defaultMessage="Use this option to create numbered lists. To add elements, simply insert new lines after one of the current elements. To stop adding elements to the list, press this button again."
                      id="slateEditor.formatContent.numberedList"
                    />
                  }
                  iconObject={
                    <a data-tip>
                      <BlockButton className="" format="numbered-list" icon="list ol" />
                    </a>
                  }
                />
                <CustomTooltip
                  className={clsx(isBlockActive(editor, 'bulleted-list') && '!bg-grey-40')}
                  content={
                    <FormattedMessage
                      defaultMessage="Use this option to create bulleted lists. To add elements, simply insert new lines after one of the current elements. To stop adding elements to the list, press this button again."
                      id="slateEditor.formatContent.bulletedList"
                    />
                  }
                  iconObject={
                    <a data-tip>
                      <BlockButton className="" format="bulleted-list" icon="list ul" />
                    </a>
                  }
                />
                <CustomTooltip
                  content={
                    <FormattedMessage
                      defaultMessage="Use this option to insert an inline LaTeX formula. Use the same format to enter formulas inside answer options."
                      id="slateEditor.formatContent.latexInline"
                    />
                  }
                  iconObject={
                    <a data-tip>
                      <Button
                        active={false}
                        editor={editor}
                        format="paragraph"
                        onMouseDown={() => {
                          Transforms.insertText(editor, '$$1 + 2$$')
                        }}
                      >
                        <div className="ml-1 mt-0.5">
                          <Icon color="grey" name="superscript" />
                        </div>
                      </Button>
                    </a>
                  }
                />
                <CustomTooltip
                  content={
                    <FormattedMessage
                      defaultMessage="Use this option to insert a centered LaTeX formula (i.e., on a separate line)."
                      id="slateEditor.formatContent.latexCentered"
                    />
                  }
                  iconObject={
                    <a data-tip>
                      <Button
                        active={false}
                        editor={editor}
                        format="paragraph"
                        onMouseDown={() => {
                          Transforms.insertNodes(editor, {
                            type: 'paragraph',
                            children: [{ text: '$$' }],
                          })
                          Transforms.insertNodes(editor, {
                            type: 'paragraph',
                            children: [{ text: '1 + 2' }],
                          })
                          Transforms.insertNodes(editor, {
                            type: 'paragraph',
                            children: [{ text: '$$' }],
                          })
                        }}
                      >
                        <div className="ml-1 mt-0.5">
                          <Icon color="grey" name="superscript" />
                        </div>
                      </Button>
                    </a>
                  }
                />
              </div>
              <Button active={false} editor={editor} format="paragraph" onMouseDown={() => editor.undo()}>
                <div className="ml-1 mt-0.5">
                  <Icon color={'grey'} name={'undo'} />
                </div>
              </Button>
              <Button active={false} editor={editor} format="paragraph" onMouseDown={() => editor.redo()}>
                <div className="ml-1 mt-0.5">
                  <Icon color={'grey'} name={'redo'} />
                </div>
              </Button>
            </div>
            <div className="p-3">
              <Editable
                autoFocus
                spellCheck
                placeholder="Enter your question here…"
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                onKeyDown={(event) => {
                  // eslint-disable-next-line no-restricted-syntax
                  for (const hotkey in HOTKEYS) {
                    if (isHotkey(hotkey, event as any)) {
                      event.preventDefault()
                      const mark = HOTKEYS[hotkey]
                      toggleMark(editor, mark)
                    }
                  }
                }}
              />
            </div>
          </Slate>
        </div>
      </Form.Field>
    </div>
  )
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && LIST_TYPES.includes(n.type),
    split: true,
  })
  const newProperties: Partial<SlateElement> = {
    // eslint-disable-next-line no-nested-ternary
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  }
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor, format) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  )

  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const Element = ({ attributes, children, element }: any) => {
  switch (element.type) {
    case 'block-quote':
      return (
        <>
          <blockquote className="text-gray-500" {...attributes}>
            <strong className="mr-2">|</strong>
            {children}
          </blockquote>
        </>
      )
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    default:
      return <p {...attributes}>{children}</p>
  }
}

const Leaf = ({ attributes, children, leaf }: any) => {
  let formattedChildren = children
  if (leaf.bold) {
    formattedChildren = <strong>{formattedChildren}</strong>
  }

  if (leaf.code) {
    formattedChildren = <code className="bg-grey-40 opacity-80">{formattedChildren}</code>
  }

  if (leaf.italic) {
    formattedChildren = <em>{formattedChildren}</em>
  }

  return <span {...attributes}>{formattedChildren}</span>
}

const BlockButton = ({ format, icon, className }: any) => {
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(editor, format)}
      editor={editor}
      format={format}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <div className={clsx('ml-1 mt-0.5', className)}>
        <Icon color={isBlockActive(editor, format) ? 'black' : 'grey'} name={icon} />
      </div>
    </Button>
  )
}

const MarkButton = ({ format, icon, className }: any) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <div className={clsx('ml-[0.3rem] mt-0.5', className)}>
        <Icon color={isMarkActive(editor, format) ? 'black' : 'grey'} name={icon} />
      </div>
    </Button>
  )
}

export const Button = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      ...props
    }: PropsWithChildren<{
      active: boolean
      reversed: boolean
      className: string
      [key: string]: unknown
    }>,
    ref: Ref<OrNull<HTMLSpanElement>>
  ) => (
    <span
      {...props}
      className={clsx(
        className,
        'cursor-pointer h-7 w-7 mr-2 rounded',
        active && !reversed && 'bg-grey-40',
        !active && reversed && 'bg-grey-40'
      )}
      ref={ref}
    />
  )
)
Button.displayName = 'Button'

ContentInput.defaultProps = defaultProps

export default ContentInput
