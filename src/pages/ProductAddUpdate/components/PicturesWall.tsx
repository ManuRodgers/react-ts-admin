import React, { useEffect, useState } from 'react';
import { Upload, Icon, Modal, message } from 'antd';
import { UploadChangeParam, UploadFile, UploadFileStatus } from 'antd/lib/upload/interface';
import { deleteImg } from '@/api';
import { BASE_IMG_URL } from '@/utils/constant';

interface IPicturesWallProps {
  getImgs: (imgs: string[]) => void;
  imgNames: string[];
}

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const PicturesWall: React.FunctionComponent<IPicturesWallProps> = ({ getImgs, imgNames }) => {
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (imgNames && imgNames.length > 0) {
      console.log(`imgNames`, imgNames);
      const existingFileList = imgNames.map((name, index) => ({
        uid: `-${index}`,
        size: 123,
        name: name,
        url: BASE_IMG_URL + name,
        percent: 100,
        type: `IMG`,
        status: 'done' as UploadFileStatus,
      }));
      setFileList(existingFileList);
    }
  }, [imgNames]);
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const handleChange = async ({ fileList, file }: UploadChangeParam) => {
    // upload img
    if (file.status === 'done') {
      const currentFile = fileList[fileList.length - 1];
      const result = currentFile.response;
      if (result.status === 0) {
        const { name, url } = result.data;
        currentFile.name = name;
        currentFile.url = url;
        message.success(`upload image successfully`);
        const imgs = fileList.map(file => file.name);
        console.log(`imgs`, imgs);
        getImgs(imgs);
      } else {
        message.error(`upload image unsuccessfully`);
      }
    } else if (file.status === 'removed') {
      const res = await deleteImg({ name: file.name });
      if (res.status === 0) {
        message.success(`delete image successfully`);
      } else {
        message.error(`delete image unsuccessfully`);
      }
    }
    console.log(`fileList`, fileList);
    setFileList(fileList);
  };
  const handleCancel = () => setPreviewVisible(false);
  return (
    <div>
      <Upload
        action="/api/manage/img/upload"
        accept={`image/*`}
        listType="picture-card"
        name={`image`}
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default PicturesWall;
