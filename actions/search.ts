import { MyConversation } from "../config/bot.ts";
import { MyContext } from "../config/bot.ts";
import { bot } from "../config/bot.ts";
import { createConversation } from "../deps.ts";
import { getMangaInfo } from "../utils/api.ts";
import { getMangaChapter, searchManga } from "../utils/api.ts";
import {
  chapterSelectionKeyboard,
  chooseKeyboard,
} from "../utils/keyboards.ts";

async function searchingMangaConversation(
  conversation: MyConversation,
  ctx: MyContext,
) {
  await ctx.reply("Send your manga name");
  const { message } = await conversation.wait();

  const mangaResults = await searchManga(message!.text!);
  const keyboard = chooseKeyboard(mangaResults);

  await ctx.reply("Choose a manga.", { reply_markup: keyboard });
}

bot.use(createConversation(searchingMangaConversation));

bot.command("search", async (ctx) => {
  await ctx.conversation.enter("searchingMangaConversation");
});

bot.callbackQuery(/manga-.+/g, async (ctx) => {
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

bot.callbackQuery(/chapter-.+/g, async (ctx) => {
  let id = ctx.callbackQuery!.data;
  const manga_id = "manga-" + id.split("-").slice(-1)[0];

  id = id.split("-" + id.split("-").slice(-1)[0])[0];

  const manga_pics = await getMangaChapter(manga_id, id.split(manga_id)[0]);

  for (const pic of manga_pics) {
    await ctx.replyWithMediaGroup(pic);
  }

  await ctx.answerCallbackQuery();
});
