import aiohttp
import asyncio
import json
from bs4 import BeautifulSoup
from typing import List, Dict, Any
import re
from urllib.parse import urljoin, urlparse

class MovieSearchService:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
    async def search_movies(self, query: str, page: int = 1) -> Dict[str, Any]:
        """搜索电影，整合多个数据源"""
        results = []
        
        # 并行搜索多个数据源
        tasks = [
            self._search_source1(query, page),
            self._search_source2(query, page),
            self._search_source3(query, page)
        ]
        
        search_results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # 合并结果
        for result in search_results:
            if isinstance(result, list):
                results.extend(result)
        
        # 去重并排序
        unique_results = self._deduplicate_results(results)
        
        return {
            "results": unique_results[:20],  # 返回前20个结果
            "total": len(unique_results),
            "page": page,
            "query": query
        }
    
    async def _search_source1(self, query: str, page: int) -> List[Dict]:
        """数据源1：豆瓣电影"""
        try:
            url = f"https://movie.douban.com/j/subject_suggest?q={query}"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers=self.headers) as response:
                    if response.status == 200:
                        data = await response.json()
                        results = []
                        
                        for item in data:
                            movie = {
                                "title": item.get("title", ""),
                                "poster_url": item.get("img", ""),
                                "rating": item.get("rate", None),
                                "year": self._extract_year(item.get("year", "")),
                                "description": item.get("sub_title", ""),
                                "source": "douban"
                            }
                            results.append(movie)
                        
                        return results
        except Exception as e:
            print(f"豆瓣搜索错误: {e}")
        
        return []
    
    async def _search_source2(self, query: str, page: int) -> List[Dict]:
        """数据源2：模拟在线影视网站"""
        try:
            # 这里可以替换为真实的影视网站API
            # 由于版权问题，这里提供一个模拟实现
            mock_results = [
                {
                    "title": f"{query} - 高清版",
                    "poster_url": "https://via.placeholder.com/300x450",
                    "rating": 8.5,
                    "year": 2023,
                    "genre": "动作/科幻",
                    "duration": 120,
                    "description": f"关于{query}的精彩电影",
                    "stream_url": f"https://example.com/stream/{query}",
                    "source": "online_movie"
                }
            ]
            return mock_results
        except Exception as e:
            print(f"在线影视搜索错误: {e}")
        
        return []
    
    async def _search_source3(self, query: str, page: int) -> List[Dict]:
        """数据源3：YouTube电影预告片"""
        try:
            search_url = f"https://www.youtube.com/results?search_query={query}+trailer"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(search_url, headers=self.headers) as response:
                    if response.status == 200:
                        html = await response.text()
                        soup = BeautifulSoup(html, 'html.parser')
                        results = []
                        
                        # 解析YouTube搜索结果
                        video_elements = soup.find_all('a', {'id': 'video-title'})
                        
                        for video in video_elements[:5]:  # 取前5个结果
                            title = video.get('title', '')
                            if 'trailer' in title.lower() or query.lower() in title.lower():
                                movie = {
                                    "title": title,
                                    "poster_url": "https://via.placeholder.com/300x450",
                                    "rating": None,
                                    "year": None,
                                    "description": "YouTube预告片",
                                    "stream_url": f"https://www.youtube.com{video.get('href', '')}",
                                    "source": "youtube"
                                }
                                results.append(movie)
                        
                        return results
        except Exception as e:
            print(f"YouTube搜索错误: {e}")
        
        return []
    
    def _extract_year(self, year_str: str) -> int:
        """从字符串中提取年份"""
        match = re.search(r'\b(19|20)\d{2}\b', year_str)
        if match:
            return int(match.group())
        return None
    
    def _deduplicate_results(self, results: List[Dict]) -> List[Dict]:
        """去重结果"""
        seen = set()
        unique_results = []
        
        for result in results:
            title = result.get('title', '').lower()
            if title and title not in seen:
                seen.add(title)
                unique_results.append(result)
        
        return unique_results