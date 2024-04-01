export interface Manga {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  alternative: string;
  authors: string;
  status: string;
  genres: string[];
  lastUpdated: string;
  views: string;
  rating: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  views: string;
  uploaded: string;
}

export interface Page {
  number: number;
  title: string;
  url: string;
  proxyURL: string;
}

export interface MangaSearchResult {
  id: string;
  name: string;
  lastChapter: string;
  thumbnail: string;
  author: string;
  url: string;
}
