import { InputMediaPhoto } from "../deps.ts";
import { InputMediaBuilder } from "../deps.ts";
import { Chapter } from "../types.ts";
import { MangaSearchResult, Page } from "../types.ts";
import { Manga } from "../types.ts";

async function searchManga(name: string): Promise<MangaSearchResult[]> {
  const response: Response = await fetch(
    `https://manga.deno.dev/api/search?q=${name}`,
  );
  return response.json();
}

async function getMangaInfo(
  id: string,
): Promise<Manga> {
  const response: Response = await fetch(
    `https://manga.deno.dev/api/manga?id=${id}`,
  );

  return response.json();
}

async function mangaChapters(
  id: string,
): Promise<Chapter[]> {
  const response: Response = await fetch(
    `https://manga.deno.dev/api/manga?id=${id}`,
  );
  const manga: Manga = await response.json();
  return manga.chapters;
}

async function getMangaChapter(
  id: string,
  chapter: string,
): Promise<InputMediaPhoto[][]> {
  console.log("FROM API", id, chapter);
  const mangaPages: Page[] = await (await fetch(
    `https://manga.deno.dev/api/chapter?id=${id}&chapter=${chapter}`,
  )).json();

  const maxElements = 10;
  const mangaArrays: InputMediaPhoto[][] = [];

  for (let i = 0; i < mangaPages.length; i += maxElements) {
    const slicedArray = mangaPages.slice(i, i + maxElements).map((page) => {
      return InputMediaBuilder
        .photo("https://manga-proxy.deno.dev/?q=" + page.url);
    });
    mangaArrays.push(slicedArray);
  }

  return mangaArrays;
}

export { getMangaChapter, getMangaInfo, mangaChapters, searchManga };
