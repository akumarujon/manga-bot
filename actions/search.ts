import { bot } from "../config/bot.ts";
import { InlineKeyboard } from "../deps.ts";
import { getMangaInfo, mangaChapters } from "../utils/api.ts";
import { find_manga, searchManga } from "../utils/api.ts";
import { chooseAnime, chooseKeyboard } from "../utils/keyboards.ts";

bot.command("search", async (ctx) => {
  const name = ctx.message!.text.split("search")[1].trim();

  const mangaResults = await searchManga(name);
  const group = chooseAnime(mangaResults);
  const keyboard = chooseKeyboard(mangaResults);

  await ctx.replyWithMediaGroup(group);
  await ctx.reply("Choose a manga.", { reply_markup: keyboard });
});

bot.callbackQuery(/manga-.+/g, async (ctx) => {
  const id = ctx.callbackQuery!.data;
  const manga = await getMangaInfo(id!);

  const chapters = await mangaChapters(id!);
  const keyboard = new InlineKeyboard();

  for (const chapter of chapters) {
    keyboard.text(
      chapter.title,
      chapter.id + "-" + id.split("-").slice(-1)[0],
    ).row();
  }

  await ctx.deleteMessages([
    ctx.callbackQuery!.message!.message_id,
    ctx.callbackQuery!.message!.message_id - 1,
  ]);

  const result = `${manga.title}\n${manga.description}\n`;
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

  const manga_pics = await find_manga(manga_id, id.split(manga_id)[0]);

  for (const pic of manga_pics) {
    await ctx.replyWithMediaGroup(pic);
  }
});
