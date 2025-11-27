"""Movie search service."""

import asyncio
import json
import re
from typing import Any

import aiohttp
from bs4 import BeautifulSoup
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.movie import Movie


class MovieSearchService:
    """Service for searching movies from multiple sources."""

    def __init__(self) -> None:
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }

    async def search_movies(
        self, query: str, page: int = 1, db: AsyncSession | None = None
    ) -> dict[str, Any]:
        """Search movies from multiple sources."""
        results = []

        # Search local database
        if db:
            local_results = await self._search_local_database(query, db)
            results.extend(local_results)

        # Parallel search from multiple sources
        tasks = [
            self._search_douban(query, page),
            self._search_online_movies(query, page),
            self._search_youtube(query, page),
        ]

        search_results = await asyncio.gather(*tasks, return_exceptions=True)

        # Merge results
        for result in search_results:
            if isinstance(result, list):
                results.extend(result)

        # Deduplicate and sort
        unique_results = self._deduplicate_results(results)

        total = len(unique_results)
        start_idx = (page - 1) * 20
        end_idx = start_idx + 20
        paginated_results = unique_results[start_idx:end_idx]

        return {
            "results": paginated_results,
            "total": total,
            "page": page,
            "query": query,
            "has_next": end_idx < total,
            "has_prev": page > 1,
        }

    async def _search_douban(self, query: str, page: int) -> list[dict[str, Any]]:
        """Search from Douban movies."""
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
                                "rating": self._parse_rating(item.get("rate", "")),
                                "year": self._extract_year(item.get("year", "")),
                                "description": item.get("sub_title", ""),
                                "source": "douban",
                            }
                            results.append(movie)

                        return results
        except Exception as e:
            print(f"Douban search error: {e}")

        return []

    async def _search_online_movies(
        self, query: str, page: int
    ) -> list[dict[str, Any]]:
        """Search from online movie sources."""
        try:
            # Mock implementation - replace with real API
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
                    "source": "online_movie",
                }
            ]
            return mock_results
        except Exception as e:
            print(f"Online movie search error: {e}")

        return []

    async def _search_youtube(self, query: str, page: int) -> list[dict[str, Any]]:
        """Search from YouTube for movie trailers."""
        try:
            search_url = f"https://www.youtube.com/results?search_query={query}+trailer"

            async with aiohttp.ClientSession() as session:
                async with session.get(search_url, headers=self.headers) as response:
                    if response.status == 200:
                        html = await response.text()
                        soup = BeautifulSoup(html, "html.parser")
                        results = []

                        # Parse YouTube search results
                        video_elements = soup.find_all("a", {"id": "video-title"})

                        for video in video_elements[:5]:  # Take first 5 results
                            title = video.get("title", "")
                            if (
                                "trailer" in title.lower()
                                or query.lower() in title.lower()
                            ):
                                movie = {
                                    "title": title,
                                    "poster_url": "https://via.placeholder.com/300x450",
                                    "rating": None,
                                    "year": None,
                                    "description": "YouTube预告片",
                                    "stream_url": f"https://www.youtube.com{video.get('href', '')}",
                                    "source": "youtube",
                                }
                                results.append(movie)

                        return results
        except Exception as e:
            print(f"YouTube search error: {e}")

        return []

    async def _search_local_database(
        self, query: str, db: AsyncSession
    ) -> list[dict[str, Any]]:
        """Search local database."""
        try:
            stmt = select(Movie).where(Movie.title.contains(query))
            result = await db.execute(stmt)
            movies = result.scalars().all()

            results = []
            for movie in movies:
                movie_dict = {
                    "id": movie.id,
                    "title": movie.title,
                    "poster_url": movie.poster_url,
                    "rating": movie.rating,
                    "year": movie.year,
                    "genre": movie.genre,
                    "duration": movie.duration,
                    "description": movie.description,
                    "stream_url": movie.stream_url,
                    "file_path": movie.file_path,
                    "is_local": movie.is_local,
                    "source": "local",
                }
                results.append(movie_dict)

            return results
        except Exception as e:
            print(f"Local database search error: {e}")
            return []

    def _deduplicate_results(
        self, results: list[dict[str, Any]]
    ) -> list[dict[str, Any]]:
        """Remove duplicate results based on title."""
        seen = set()
        unique_results = []

        for result in results:
            title = result.get("title", "").lower()
            if title and title not in seen:
                seen.add(title)
                unique_results.append(result)

        return unique_results

    def _extract_year(self, year_str: str) -> int | None:
        """Extract year from string."""
        match = re.search(r"\b(19|20)\d{2}\b", year_str)
        if match:
            return int(match.group())
        return None

    def _parse_rating(self, rating_str: str) -> float | None:
        """Parse rating string to float."""
        try:
            if rating_str:
                return float(rating_str)
        except (ValueError, TypeError):
            pass
        return None
