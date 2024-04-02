import { InputMediaPhoto } from "../deps.ts";
import { InputMediaBuilder } from "../deps.ts";
import { MangaSearchResult, Page } from "../types.ts";
import { Manga } from "../types.ts";

export async function searchManga(name: string): Promise<MangaSearchResult[]> {
  const res = await fetch(`https://manga.deno.dev/api/search?q=${name}`);
  return await res.json();
}

export async function getMangaInfo(id: string): Promise<Manga> {
  const res = await fetch(`https://manga.deno.dev/api/manga?id=${id}`);
  return await res.json();
}

export async function getMangaChapter(
  id: string,
  chapter: string,
): Promise<InputMediaPhoto[][]> {
  const mangaPages: Page[] = await (await fetch(
    `https://manga.deno.dev/api/chapter?id=${id}&chapter=${chapter}`,
  )).json();

  const maxElements = 10;
  const mangaArrays: InputMediaPhoto[][] = [];

  for (let i = 0; i < mangaPages.length; i += maxElements) {
    const slicedArray = mangaPages
      .slice(i, i + maxElements)
      .map((page) => InputMediaBuilder.photo(page.proxyURL));

    mangaArrays.push(slicedArray);
  }

  return mangaArrays;
}
