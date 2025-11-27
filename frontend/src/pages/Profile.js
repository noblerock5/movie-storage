import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      // 这里可以添加获取用户统计信息的API调用
      // const response = await api.get('/api/v1/users/stats');
      // setStats(response.data);
      
      // 模拟数据
      setStats({
        favoritesCount: 12,
        uploadsCount: 5,
        watchTime: 120, // 小时
        joinDate: '2024-01-15'
      });
    } catch (error) {
      console.error('获取用户统计失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-white text-lg">加载用户信息中...</p>
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
              个人资料
            </h1>
            <p className="text-white/70 text-lg">
              管理您的账户信息和偏好设置
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 用户信息卡片 */}
            <div className="md:col-span-1">
              <div className="glass-card p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {user?.username || '未知用户'}
                </h2>
                
                <p className="text-gray-600 mb-4">
                  {user?.email || '未设置邮箱'}
                </p>

                <div className="space-y-2 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">用户ID:</span> {user?.id}
                  </div>
                  <div>
                    <span className="font-medium">注册时间:</span> {stats.joinDate || '未知'}
                  </div>
                  <div>
                    <span className="font-medium">账户状态:</span> 
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                      活跃
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 统计信息和设置 */}
            <div className="md:col-span-2 space-y-8">
              {/* 用户统计 */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  📊 观看统计
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {stats.favoritesCount || 0}
                    </div>
                    <div className="text-gray-600 text-sm">收藏电影</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {stats.uploadsCount || 0}
                    </div>
                    <div className="text-gray-600 text-sm">上传电影</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {stats.watchTime || 0}
                    </div>
                    <div className="text-gray-600 text-sm">观看小时</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      ★★★
                    </div>
                    <div className="text-gray-600 text-sm">平均评分</div>
                  </div>
                </div>
              </div>

              {/* 快捷操作 */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  ⚡ 快捷操作
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <a 
                    href="/favorites"
                    className="block p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">♥</span>
                      <div>
                        <div className="font-semibold">我的收藏</div>
                        <div className="text-sm opacity-90">查看收藏的电影</div>
                      </div>
                    </div>
                  </a>

                  <a 
                    href="/upload"
                    className="block p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">↑</span>
                      <div>
                        <div className="font-semibold">上传电影</div>
                        <div className="text-sm opacity-90">分享您的影片</div>
                      </div>
                    </div>
                  </a>

                  <a 
                    href="/search"
                    className="block p-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">⚲</span>
                      <div>
                        <div className="font-semibold">浏览电影</div>
                        <div className="text-sm opacity-90">发现更多精彩</div>
                      </div>
                    </div>
                  </a>

                  <button className="block p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📝</span>
                      <div>
                        <div className="font-semibold">观看历史</div>
                        <div className="text-sm opacity-90">查看播放记录</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 账户设置 */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  账户设置
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <div>
                      <div className="font-medium text-gray-800">邮件通知</div>
                      <div className="text-sm text-gray-600">接收电影推荐和更新</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <div>
                      <div className="font-medium text-gray-800">自动播放</div>
                      <div className="text-sm text-gray-600">自动播放下一个视频</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <div>
                      <div className="font-medium text-gray-800">高清模式</div>
                      <div className="text-sm text-gray-600">优先播放高清版本</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* 危险操作 */}
              <div className="glass-card p-6 border-2 border-red-200">
                <h3 className="text-xl font-bold text-red-600 mb-4">
                  ⚠️ 危险操作
                </h3>
                
                <div className="space-y-4">
                  <button className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200">
                    退出登录
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;