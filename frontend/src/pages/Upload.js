import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Upload, 
  message,
  Progress,
  Row,
  Col
} from 'antd';
import { 
  InboxOutlined, 
  UploadOutlined,
  VideoCameraOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const { Title, Text } = Typography;
const { Dragger } = Upload;
const { TextArea } = Input;

const UploadContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const UploadCard = styled(Card)`
  background: white;
  border: 1px solid #e0e0e0;
  
  .ant-card-head {
    border-bottom: 1px solid #e0e0e0;
  }
  
  .ant-card-head-title {
    color: #333;
  }
  
  .ant-card-body {
    background: white;
  }
`;

const StyledDragger = styled(Dragger)`
  background: #f8f9fa;
  border: 2px dashed #d0d0d0;
  border-radius: 12px;
  
  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }
  
  .ant-upload-drag-icon {
    color: rgba(0, 0, 0, 0.4);
  }
  
  .ant-upload-text {
    color: #333;
  }
  
  .ant-upload-hint {
    color: rgba(0, 0, 0, 0.5);
  }
`;

const FormItem = styled(Form.Item)`
  .ant-form-item-label > label {
    color: rgba(0, 0, 0, 0.7);
  }
  
  .ant-input, .ant-input:focus, .ant-input-focused {
    background: white;
    border: 1px solid #e0e0e0;
    color: #333;
  }
  
  .ant-input::placeholder {
    color: rgba(0, 0, 0, 0.4);
  }
  
  .ant-form-item-explain-error {
    color: #ff4d4f;
  }
`;

const UploadPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async (values) => {
    if (fileList.length === 0) {
      message.error('请选择要上传的视频文件');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileList[0].originFileObj);
    formData.append('title', values.title);
    formData.append('description', values.description || '');

    setUploading(true);
    setUploadProgress(0);

    try {
      const response = await api.post('/api/v1/movies/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      message.success('电影上传成功！');
      form.resetFields();
      setFileList([]);
      setUploadProgress(0);
      
      // 跳转到电影详情页
      setTimeout(() => {
        navigate(`/movie/${response.data.movie_id}`);
      }, 1000);
      
    } catch (error) {
      console.error('上传失败:', error);
      message.error('上传失败: ' + (error.response?.data?.detail || '未知错误'));
    } finally {
      setUploading(false);
    }
  };

  const beforeUpload = (file) => {
    const isVideo = file.type.startsWith('video/');
    if (!isVideo) {
      message.error('只能上传视频文件！');
      return false;
    }

    const isLt2G = file.size / 1024 / 1024 / 1024 < 2;
    if (!isLt2G) {
      message.error('视频文件大小不能超过 2GB！');
      return false;
    }

    setFileList([file]);
    return false; // 阻止自动上传
  };

  const onRemove = () => {
    setFileList([]);
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    fileList,
    beforeUpload,
    onRemove,
    accept: 'video/*',
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', color: '#333' }}>
        <Title level={3}>请先登录</Title>
        <Button type="primary" onClick={() => navigate('/login')}>
          去登录
        </Button>
      </div>
    );
  }

  return (
    <UploadContainer>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: '20px' }}
      >
        返回
      </Button>

      <UploadCard title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <VideoCameraOutlined />
          上传电影
        </div>
      }>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpload}
          size="large"
        >
          <FormItem
            name="title"
            label="电影标题"
            rules={[{ required: true, message: '请输入电影标题!' }]}
          >
            <Input placeholder="请输入电影标题" />
          </FormItem>

          <FormItem
            name="description"
            label="电影简介"
          >
            <TextArea
              rows={4}
              placeholder="请输入电影简介（选填）"
              showCount
              maxLength={500}
            />
          </FormItem>

          <FormItem label="视频文件" required>
            <StyledDragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                点击或拖拽视频文件到此区域上传
              </p>
              <p className="ant-upload-hint">
                支持 MP4、AVI、MKV 等常见视频格式，文件大小不超过 2GB
              </p>
            </StyledDragger>
          </FormItem>

          {uploading && (
            <FormItem>
              <Progress
                percent={uploadProgress}
                status={uploadProgress === 100 ? 'success' : 'active'}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
              <Text style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                正在上传，请勿关闭页面...
              </Text>
            </FormItem>
          )}

          <FormItem>
            <Row gutter={16}>
              <Col span={12}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={uploading}
                  block
                  icon={<UploadOutlined />}
                  disabled={fileList.length === 0}
                >
                  {uploading ? '上传中...' : '开始上传'}
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  onClick={() => navigate(-1)}
                  block
                >
                  取消
                </Button>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </UploadCard>

      <div style={{ marginTop: '40px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
        <Title level={4} style={{ color: '#333', marginBottom: '15px' }}>
          上传说明
        </Title>
        <ul style={{ color: 'rgba(0, 0, 0, 0.6)', lineHeight: '1.8' }}>
          <li>支持的视频格式：MP4、AVI、MKV、MOV、WMV、FLV</li>
          <li>文件大小限制：单个文件不超过 2GB</li>
          <li>上传完成后，电影将自动保存到您的个人库中</li>
          <li>请确保您拥有该视频的合法版权</li>
          <li>上传的视频可以进行在线播放和投屏</li>
        </ul>
      </div>
    </UploadContainer>
  );
};

export default UploadPage;