import { InlineKeyboard, InputMediaBuilder, InputMediaPhoto } from "../deps.ts";
import { Manga, MangaSearchResult } from "../types.ts";

export function chooseKeyboard(results: MangaSearchResult[]) {
  const keyboard = new InlineKeyboard();
  for (const result of results) {
    keyboard.text(result.name, result.id).row();
  }
  return keyboard;
}

export function chooseAnime(results: MangaSearchResult[]) {
  const group: InputMediaPhoto[] = [];

  for (const result of results) {
    group.push(
      InputMediaBuilder.photo(
        `https://manga-proxy.deno.dev/?q=${result.thumbnail}`,
      ),
    );
  }
  return group;
}

export function chapterSelectionKeyboard(manga: Manga) {
  const keyboard = new InlineKeyboard();
  const manga_id = manga.id.split("-").slice(-1)[0];

  for (const chapter of manga.chapters) {
    keyboard.text(chapter.title, `${chapter.id}-${manga_id}`).row();
  }

  return keyboard;
}
