import { InlineKeyboard, InlineKeyboardButton, InputMediaBuilder, InputMediaPhoto } from "../deps.ts";
import { Manga, MangaSearchResult } from "../types.ts";


/**
 * Generates an inline keyboard for selecting manga items.
 *
 * @param {MangaSearchResult[]} results - The array of manga search results.
 * @return {InlineKeyboard} The generated inline keyboard.
 */
export function chooseKeyboard(results: MangaSearchResult[]): InlineKeyboard {
  const keyboard = new InlineKeyboard();
  for (const result of results) {
    /**
     * Example result.name: "Naruto"
     * Example result.id: "manga-001"
     */
    keyboard.text(result.name, result.id).row();
  }
  return keyboard;
}

/**
 * Generates an inline keyboard for selecting manga items.
 *
 * @param {MangaSearchResult[]} results - The array of manga search results.
 * @return {InputMediaPhoto[]} The generated inline keyboard.
 */
export function chooseAnime(results: MangaSearchResult[]): InputMediaPhoto[] {
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

/**
 * Generates an inline keyboard for selecting chapters of a manga.
 *
 * @param {Manga} manga - The manga object containing chapters to be displayed.
 * @return {InlineKeyboard} The generated inline keyboard for chapter selection.
 */
export function chapterSelectionKeyboard(manga: Manga): InlineKeyboard {
  const keyboard = new InlineKeyboard();
  // example manga_id: manga-001
  const manga_id = manga.id.split("-").slice(-1)[0];

  console.log("Manga id:", manga_id);
  for (const chapter of manga.chapters) {
    keyboard.text(chapter.title, `${chapter.id}-${manga_id}`).row();
  }

  return keyboard;
}


export function createPagination(keyboard: InlineKeyboardButton[][], current: string, manga_id: string): InlineKeyboard {
  const pagination = new InlineKeyboard();
  
  // example manga_id: manga-001
  // console.log(keyboard)

  const currentIndex = keyboard.indexOf(
    // @ts-ignore types have problems
    keyboard.filter((row) => row[0].callback_data == current)[0]
  )

  const isBeginning = currentIndex == 0
  const isEnd = currentIndex == keyboard.length - 1


  console.log(`Coming callback: ${keyboard[currentIndex + 1][0].callback_data.split("-").slice(0,-1).join("-")}-${manga_id}`);
  
  if(isBeginning){
    // @ts-ignore types have problems
    pagination.text("➡️", `${keyboard[currentIndex + 1][0].callback_data.split("-")[0]}-${manga_id}`)
    return pagination
  }

  if(isEnd){
    pagination.text("⬅️", `${current.split("-")[0]}-${Number(current.split("-")[1]) - 1}-${manga_id}`)
    return pagination
  }

  // example current: chapter-001-manga-001
  pagination
    .text("⬅️", `${current.split("-")[0]}-${Number(current.split("-")[1]) - 1}-${manga_id}`)
    .text("➡️", `${current.split("-")[0]}-${Number(current.split("-")[1]) + 1}-${manga_id}`)
    .row();

  return pagination;
}