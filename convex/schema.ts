import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const MonsterSchema = {
  name: v.string(),
  description: v.string(),
  avgHeight: v.string(),
  diet: v.string(),
  environment: v.string(),
}

export default defineSchema({
  monsters: defineTable(MonsterSchema),
});