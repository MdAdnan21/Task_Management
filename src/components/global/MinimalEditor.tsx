// import {
//   MDXEditor,
//   MDXEditorMethods,
//   UndoRedo,
//   BoldItalicUnderlineToggles,
//   toolbarPlugin,
//   imagePlugin,
//   InsertImage,
//   linkPlugin,
//   linkDialogPlugin,
//   listsPlugin,
//   diffSourcePlugin,
//   DiffSourceToggleWrapper,
//   ListsToggle,
//   CreateLink,
//   headingsPlugin,
//   quotePlugin,
//   directivesPlugin,
//   AdmonitionDirectiveDescriptor,
//   BlockTypeSelect,
//   InsertTable,
//   tablePlugin,
//   thematicBreakPlugin,
//   InsertThematicBreak,
//   InsertAdmonition,
//   frontmatterPlugin,
//   InsertFrontmatter,
//   MDXEditorProps,
// } from '@mdxeditor/editor';
// import { FC, MutableRefObject } from 'react';

// interface EditorProps extends MDXEditorProps {
//   markdown: string;
//   editorRef?: MutableRefObject<MDXEditorMethods | null>;
// }

// const Editor: FC<EditorProps> = ({ markdown, editorRef, ...props }) => {
//   return (
//     <MDXEditor
//       placeholder='Write Answer in English'
//       ref={editorRef}
//       markdown={markdown}
//       plugins={[
//         listsPlugin(),
//         diffSourcePlugin({
//           diffMarkdown: 'An older version',
//           viewMode: 'rich-text',
//         }),
//         imagePlugin({
//           imageUploadHandler: () =>
//             Promise.resolve('https://picsum.photos/200/300'),
//           imageAutocompleteSuggestions: [
//             'https://picsum.photos/200/300',
//             'https://picsum.photos/200',
//           ],
//         }),
//         linkPlugin(),
//         linkDialogPlugin({
//           linkAutocompleteSuggestions: [
//             'https://virtuoso.dev',
//             'https://mdxeditor.dev',
//             'https://msn.com/',
//           ],
//         }),
//         headingsPlugin(),
//         quotePlugin(),
//         tablePlugin(),
//         thematicBreakPlugin(),
//         directivesPlugin({
//           directiveDescriptors: [AdmonitionDirectiveDescriptor],
//         }),
//         frontmatterPlugin(),
//         toolbarPlugin({
//           toolbarContents: () => (
//             <>
//               <UndoRedo />
//               <BoldItalicUnderlineToggles />
//               <ListsToggle />
//               <BlockTypeSelect />
//               <CreateLink />
//               <InsertImage />
//               <InsertTable />
//               <InsertThematicBreak />
//               <InsertAdmonition />
//               <InsertFrontmatter />
//               <DiffSourceToggleWrapper />
//             </>
//           ),
//         }),
//       ]}
//       {...props}
//     />
//   );
// };

// export default Editor;
