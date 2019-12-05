import * as React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useState } from 'react';

interface IFullTextEditorProps {
  getDetail: (detail: string) => void;
  detail: string;
}

const FullTextEditor: React.FunctionComponent<IFullTextEditorProps> = ({ getDetail, detail }) => {
  let editorInitState = EditorState.createEmpty();
  if (detail && detail.length > 0) {
    const contentBlock = htmlToDraft(detail);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      editorInitState = EditorState.createWithContent(contentState);
    }
  }
  const [editorState, setEditorState] = useState<EditorState>(editorInitState);

  const onEditorStateChange = (editorState: EditorState) => {
    console.log(`editorState`, editorState);
    getDetail(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    setEditorState(editorState);
  };
  const uploadImageCallBack = (file: any) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/manage/img/upload');
      xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
      const data = new FormData();
      data.append('image', file);
      xhr.send(data);
      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);
        resolve({
          data: {
            link: response.data.url,
          },
        });
      });
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    });
  };
  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      editorStyle={{ border: '1px solid black', minHeight: 200, paddingLeft: 10 }}
      toolbar={{
        inline: { inDropdown: true },
        list: { inDropdown: true },
        textAlign: { inDropdown: true },
        link: { inDropdown: true },
        history: { inDropdown: true },
        image: { uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: true } },
      }}
    />
  );
};

export default FullTextEditor;
