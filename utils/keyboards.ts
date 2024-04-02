import { InlineKeyboard, InputMediaBuilder, InputMediaPhoto } from "../deps.ts";
import { MangaSearchResult } from "../types.ts";

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
        "https://manga-proxy.deno.dev/?q=" + result.thumbnail,
      ),
    );
  }
  return group;
}