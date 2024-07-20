import { mutation, query } from "./_generated/server";
import { MonsterSchema } from "./schema";

type Monster = {
  name:string,
  description:string,
  avgHeight:string,
  diet:string,
  environment:string,
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("monsters").collect();
  },
});

export const send = mutation({
  args: { ...MonsterSchema },
  handler: async (ctx, { name, description, avgHeight, diet, environment}:Monster) => {
    // Send a new message.
    await ctx.db.insert("monsters", { name, description, avgHeight, diet, environment });
  },
});