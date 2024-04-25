import { InputFile } from "https://deno.land/x/grammy@v1.21.1/types.deno.ts";
import { InputMediaDocument } from "../deps.ts";
import { InputMediaBuilder } from "../deps.ts";
import { Chapter } from "../types.ts";
import { MangaSearchResult, Page } from "../types.ts";
import { Manga } from "../types.ts";

/**
 * Search for manga
 * @param query to search manga by
 */
async function searchManga(query: string): Promise<MangaSearchResult[]> {
  const response: Response = await fetch(
    `https://manga.deno.dev/api/search?q=${query}`,
  );
  return response.json();
}

/**
 * Get info about manga
 * @param id manga to fetch
 */
async function getMangaInfo(
  id: string,
): Promise<Manga> {
  const response: Response = await fetch(
    `https://manga.deno.dev/api/manga?id=${id}`,
  );

  return response.json();
}

/**
 * Get chapters of manga
 * @param id manga to fetch
 * @deprecated Use field chapters on manga instead. You can fetch manga using getMangaInfo
 */
async function mangaChapters(
  id: string,
): Promise<Chapter[]> {
  const response: Response = await fetch(
    `https://manga.deno.dev/api/manga?id=${id}`,
  );
  const manga: Manga = await response.json();
  return manga.chapters;
}

/**
 * Get pages of manga's chapter
 * @param mangaId manga to fetch
 * @param chapterId chapter to fetch
 */
async function getMangaChapter(
  mangaId: string,
  chapterId: string,
): Promise<InputMediaDocument[][]> {
  const mangaPages: Page[] = await (await fetch(
    `https://manga.deno.dev/api/chapter?id=${mangaId}&chapter=${chapterId}`,
  )).json();

  const maxElements = 10;
  const mangaArrays: InputMediaDocument[][] = [];

  for (let i = 0; i < mangaPages.length; i += maxElements) {
    const slicedArray = mangaPages.slice(i, i + maxElements).map((page) => {
      return InputMediaBuilder
        .document(
          new InputFile(
            new URL("https://manga-proxy.deno.dev/?q=" + page.url),
            `${chapterId}.jpeg`,
          ),
        );
    });
    mangaArrays.push(slicedArray);
  }

  return mangaArrays;
}

export { getMangaChapter, getMangaInfo, mangaChapters, searchManga };
