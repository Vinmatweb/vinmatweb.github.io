import type { MetadataRoute } from "next";
import { gameData } from "./data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-fantasy-adventure.jirik66.chatgpt.site";
const updated = new Date("2026-08-19T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/start",
    "/en",
    "/explorer",
    "/explorer/hrdinove",
    "/explorer/hrdinove/rasy",
    "/explorer/hrdinove/povolani",
    "/explorer/bestiar",
    "/explorer/vybaveni",
    "/explorer/magie",
    "/explorer/pravidla",
    "/explorer/vaelor",
    ...gameData.races.map((item) => `/explorer/hrdinove/rasy/${item.slug}`),
    ...gameData.classes.map((item) => `/explorer/hrdinove/povolani/${item.slug}`),
    ...gameData.heroes.map((item) => `/explorer/hrdinove/${item.slug}`),
    ...gameData.bestiaryCategories.map((item) => `/explorer/bestiar/kategorie/${item.slug}`),
    ...gameData.bestiary.map((item) => `/explorer/bestiar/${item.slug}`),
    ...gameData.equipmentCategories.map((item) => `/explorer/vybaveni/kategorie/${item.slug}`),
    ...gameData.equipment.map((item) => `/explorer/vybaveni/${item.slug}`),
    ...gameData.magicSchools.map((item) => `/explorer/magie/${item.slug}`),
    ...gameData.spells.map((item) => `/explorer/magie/${item.schoolSlug}/${item.slug}`),
  ];

  return paths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: updated,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/start" ? 0.95 : path.split("/").length <= 3 ? 0.8 : 0.65,
  }));
}
