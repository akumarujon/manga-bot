import {
  Bot,
  Context,
  Conversation,
  ConversationFlavor,
  conversations,
  session,
} from "../deps.ts";
import "https://deno.land/std@0.201.0/dotenv/load.ts";

export type MyContext = Context & ConversationFlavor;
export type MyConversation = Conversation<MyContext>;

const bot = new Bot<MyContext>(Deno.env.get("BOT_TOKEN") as string);
const instance = await bot.api.getMe();

bot.use(session({
  initial() {
    // return empty object for now
    return {};
  },
}));
bot.use(conversations());

bot.catch((err) => console.error(err));

export { bot, instance };
