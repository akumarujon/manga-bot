import { MyConversation } from "../config/bot.ts";
import { MyContext } from "../config/bot.ts";
import { bot } from "../config/bot.ts";
import { createConversation } from "../deps.ts";
import { getMangaInfo } from "../utils/api.ts";
import { getMangaChapter, searchManga } from "../utils/api.ts";
import {
  chapterSelectionKeyboard,
  chooseKeyboard,
  createPagination,
} from "../utils/keyboards.ts";

/**
 * Function to handle searching for manga in a conversation.
 */
async function searchingMangaConversation(
  conversation: MyConversation,
  ctx: MyContext,
) {
  await ctx.reply("Send your manga name");
  const { message } = await conversation.wait();

  const mangaResults = await searchManga(message!.text!);

  if (mangaResults.length === 0) {
    await ctx.reply("No results found.");
    return;
  }
  const keyboard = chooseKeyboard(mangaResults);

  await ctx.reply("Choose a manga.", { reply_markup: keyboard });
}

bot.use(createConversation(searchingMangaConversation));

bot.command("search", async (ctx) => {
  await ctx.conversation.enter("searchingMangaConversation");
});

/**
 * Handles the callback query for manga selection.
 */
bot.callbackQuery(/manga-.+/g, async (ctx) => {
  // example id: manga-001
  const id = ctx.callbackQuery!.data;

  const manga = await getMangaInfo(id!);

  const keyboard = chapterSelectionKeyboard(manga);

  await ctx.deleteMessages([
    ctx.callbackQuery!.message!.message_id,
    ctx.callbackQuery!.message!.message_id - 1,
  ]);

  const description = manga.description.length > 768
    ? `${manga.description.substring(0, 768)}...`
    : manga.description;

  const result = `${manga.title}\n${description}\n`;
  await ctx.replyWithPhoto(manga.thumbnail, {
    caption: result,
    reply_markup: keyboard,
  });

  await ctx.answerCallbackQuery();
});

/**
 * Handles the callback query for chapter selection.
 */
bot.callbackQuery(/chapter-.+/g, async (ctx) => {
  let id = ctx.callbackQuery!.data;
  // example id: chapter-001-pd992912
  const manga_id = "manga-" + id.split("-").slice(-1)[0];
  // example manga id: manga-pd992912

  const manga = await getMangaInfo(manga_id);
  const keyboard = chapterSelectionKeyboard(manga);

  // plan fix
  const pagination = createPagination(
    keyboard.inline_keyboard.slice(0, -1).reverse(),
    id,
    id.split("-").slice(-1)[0],
  );

  id = id.split("-" + id.split("-").slice(-1)[0])[0];

  const manga_pics = await getMangaChapter(manga_id, id);

  for (const pic of manga_pics) {
    await ctx.replyWithMediaGroup(pic);
  }

  await ctx.reply(`Manga: ${manga.title}\nChapter: ${id}`, {
    reply_markup: pagination,
  });

  await ctx.answerCallbackQuery();
});
