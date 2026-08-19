import rawData from "./game-data.json";

export type AttributeSet = {
  strength: number;
  agility: number;
  intelligence: number;
  charisma: number;
  luck: number;
};

export type Ability = { name: string; effect: string };

export type Race = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  modifiers: AttributeSet;
  strong: string;
  weak: string;
  ability: Ability;
  recommendedClassSlugs: string[];
  assetKey: string;
};

export type CharacterClass = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  playStyle: string;
  modifiers: AttributeSet;
  ability: Ability;
  startingEquipment: {
    active: string[];
    inventory: string[];
    note?: string | null;
  };
  assetKey: string;
};

export type Hero = {
  slug: string;
  name: string;
  raceSlug: string;
  classSlug: string;
  stats: AttributeSet;
  hp: number;
  strong: string;
  weak: string;
  raceAbility: Ability;
  classAbility: Ability;
  startingEquipment: CharacterClass["startingEquipment"];
  description: string;
  assetKey: string;
  futureAssets: string[];
};

export type BestiaryEntry = {
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  difficulty: number;
  stats: AttributeSet & {
    luckBonus: number;
    hp: number;
    physicalAttack: number;
    physicalDefense: number;
    magicAttack: number;
    magicDefense: number;
  };
  strong: string;
  weak: string;
  attackAttribute: string;
  weaponBonus: number;
  weapon: string;
  armorBonus: number;
  armor: string;
  shieldBonus: number;
  shield?: string | null;
  spellBonus: number;
  magicProtection: number;
  ability: Ability;
  xp: number;
  recommendedGroups: Record<"2" | "3" | "4", string | number | null>;
  defenseSpecialization?: {
    name: string;
    effect: string;
    resistanceType: string;
    weakness?: string | null;
  } | null;
  isBoss: boolean;
  boss?: {
    adventureType: string;
    signatureAbility: string;
    weakness: string;
    alternativeSolutions: string;
    note: string;
  } | null;
  assetKey: string;
  futureAssets: string[];
};

export type EquipmentItem = {
  slug: string;
  name: string;
  categorySlug: string;
  category: string;
  assetKey: string;
  futureAssets: string[];
  fields: Record<string, string | number | boolean>;
};

export type MagicSchool = {
  slug: string;
  name: string;
  description: string;
  symbol: string;
  tone: string;
  assetKey: string;
};

export type Spell = {
  slug: string;
  name: string;
  schoolSlug: string;
  school: string;
  type: string;
  minIntelligence: number;
  minLevel: string | number;
  bonus: string;
  target: string;
  duration: string;
  limitations: string;
  effect: string;
  assetKey: string;
  futureAssets: string[];
};

export type NamedCount = { slug: string; name: string; count: number };

export type GameData = {
  meta: {
    title: string;
    version: string;
    sourceDate: string;
    sourceLanguage: string;
    sourceFiles: string[];
    counts: Record<string, number>;
  };
  races: Race[];
  classes: CharacterClass[];
  heroes: Hero[];
  bestiaryCategories: NamedCount[];
  bestiary: BestiaryEntry[];
  equipmentCategories: NamedCount[];
  equipment: EquipmentItem[];
  magicSchools: MagicSchool[];
  spells: Spell[];
  rules: {
    attributes: Array<{ key: string; name: string; use: string }>;
    virtualDie: string;
    hpFormula: string;
    luckBonusFormula: string;
    adventureScenes: string[];
    leveling: string;
    simpleMode: string;
    combat: string;
    magic: string;
  };
};

export const gameData = rawData as GameData;

export const attributeLabels: Array<[keyof AttributeSet, string, string]> = [
  ["strength", "Síla", "S"],
  ["agility", "Obratnost", "O"],
  ["intelligence", "Chytrost", "CH"],
  ["charisma", "Charisma", "CHA"],
  ["luck", "Štěstí", "Š"],
];

export function formatModifier(value: number) {
  return value > 0 ? `+${value}` : String(value);
}

export function findRace(slug: string) {
  return gameData.races.find((item) => item.slug === slug);
}

export function findClass(slug: string) {
  return gameData.classes.find((item) => item.slug === slug);
}

export function findHero(slug: string) {
  return gameData.heroes.find((item) => item.slug === slug);
}

export function findBestiaryEntry(slug: string) {
  return gameData.bestiary.find((item) => item.slug === slug);
}

export function findEquipment(slug: string) {
  return gameData.equipment.find((item) => item.slug === slug);
}

export function findSchool(slug: string) {
  return gameData.magicSchools.find((item) => item.slug === slug);
}

export function findSpell(slug: string, schoolSlug?: string) {
  return gameData.spells.find(
    (item) => item.slug === slug && (!schoolSlug || item.schoolSlug === schoolSlug),
  );
}

export function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
