import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Upload = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    year: '',
    rating: '',
    duration: '',
    poster_url: '',
    stream_url: '',
    file_path: ''
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const genres = [
    '动作', '喜剧', '爱情', '科幻', '悬疑', '恐怖', 
    '动画', '纪录片', '战争', '犯罪', '冒险', '奇幻'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // 检查文件类型
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('请选择有效的视频文件 (MP4, AVI, MOV, WMV, FLV)');
        return;
      }
      
      // 检查文件大小 (限制为2GB)
      if (selectedFile.size > 2 * 1024 * 1024 * 1024) {
        setError('文件大小不能超过2GB');
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const uploadFormData = new FormData();
      
      // 添加文件
      if (file) {
        uploadFormData.append('file', file);
      }
      
      // 添加其他字段
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          uploadFormData.append(key, formData[key]);
        }
      });

      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const response = await api.post('/api/v1/movies', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setSuccess(true);
      
      // 3秒后跳转到电影详情页
      setTimeout(() => {
        navigate(`/movie/${response.data.id}`);
      }, 3000);

    } catch (error) {
      console.error('上传失败:', error);
      setError(error.response?.data?.detail || '上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center glass-card p-8 max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            上传成功！
          </h2>
          <p className="text-gray-600 mb-4">
            您的电影已成功上传，正在跳转到详情页...
          </p>
          <div className="loading-spinner mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container min-h-screen">
      <div className="pt-24 pb-12">
        <div className="content-wrapper">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              上传电影
            </h1>
            <p className="text-white/70 text-lg">
              分享您的精彩影片到电影库
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 文件上传 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    选择视频文件 *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer bg-purple-50 hover:bg-purple-100 transition-colors duration-200"
                    >
                      <div className="text-center">
                        {file ? (
                          <div>

                            <div className="text-sm font-medium text-gray-700">
                              {file.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </div>
                          </div>
                        ) : (
                          <div>

                            <div className="text-sm text-gray-600">
                              点击选择视频文件
                            </div>
                            <div className="text-xs text-gray-400">
                              支持 MP4, AVI, MOV, WMV, FLV 格式
                            </div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                {/* 基本信息 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      电影标题 *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="modern-input w-full"
                      placeholder="请输入电影标题"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      类型 *
                    </label>
                    <select
                      name="genre"
                      value={formData.genre}
                      onChange={handleInputChange}
                      required
                      className="modern-input w-full"
                    >
                      <option value="">请选择类型</option>
                      {genres.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 描述 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    电影简介
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="modern-input w-full resize-none"
                    placeholder="请输入电影简介..."
                  />
                </div>

                {/* 详细信息 */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      上映年份
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      min="1900"
                      max={new Date().getFullYear()}
                      className="modern-input w-full"
                      placeholder="如: 2023"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      评分 (0-10)
                    </label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      min="0"
                      max="10"
                      step="0.1"
                      className="modern-input w-full"
                      placeholder="如: 8.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      时长 (分钟)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      min="1"
                      className="modern-input w-full"
                      placeholder="如: 120"
                    />
                  </div>
                </div>

                {/* 海报和链接 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      海报链接
                    </label>
                    <input
                      type="url"
                      name="poster_url"
                      value={formData.poster_url}
                      onChange={handleInputChange}
                      className="modern-input w-full"
                      placeholder="https://example.com/poster.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      在线播放链接 (可选)
                    </label>
                    <input
                      type="url"
                      name="stream_url"
                      value={formData.stream_url}
                      onChange={handleInputChange}
                      className="modern-input w-full"
                      placeholder="https://example.com/video.mp4"
                    />
                  </div>
                </div>

                {/* 上传进度 */}
                {uploading && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">上传进度</span>
                      <span className="text-sm text-gray-500">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* 提交按钮 */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={uploading || !file || !formData.title || !formData.genre}
                    className="btn-primary flex-1 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <span className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        上传中...
                      </span>
                    ) : (
                      '开始上传'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn-secondary px-8"
                  >
                    取消
                  </button>
                </div>
              </form>

              {/* 上传说明 */}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  📋 上传说明
                </h4>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li>• 支持的视频格式: MP4, AVI, MOV, WMV, FLV</li>
                  <li>• 文件大小限制: 最大2GB</li>
                  <li>• 上传完成后会自动处理和转码</li>
                  <li>• 请确保您拥有该视频的版权或上传权限</li>
                  <li>• 违反社区准则的内容将会被移除</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;