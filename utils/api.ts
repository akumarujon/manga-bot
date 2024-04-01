import { InputMediaPhoto } from "../deps.ts";
import { InputMediaBuilder } from "../deps.ts";
import { Chapter } from "../types.ts";
import { MangaSearchResult, Page } from "../types.ts";
import { Manga } from "../types.ts";

async function searchManga(name: string): Promise<MangaSearchResult[]> {
  const response: MangaSearchResult[] =
    await (await fetch(`https://manga.deno.dev/api/search?q=${name}`)).json();
  return response;
}

async function getMangaInfo(
  id: string,
): Promise<Manga> {
  const response: Manga =
    await (await fetch(`https://manga.deno.dev/api/manga?id=${id}`)).json();
  return response;
}

async function mangaChapters(
  id: string,
): Promise<Chapter[]> {
  const response: Manga =
    await (await fetch(`https://manga.deno.dev/api/manga?id=${id}`)).json();
  return response.chapters;
}

async function find_manga(
  id: string,
  chapter: string,
): Promise<InputMediaPhoto[][]> {
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

export { find_manga, getMangaInfo, mangaChapters, searchManga };
