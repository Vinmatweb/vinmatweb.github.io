import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const data = JSON.parse(
  await readFile(new URL("../app/data/game-data.json", import.meta.url), "utf8"),
);

const expectedCounts = {
  races: 5,
  classes: 6,
  heroes: 30,
  bestiary: 62,
  equipment: 92,
  magicSchools: 11,
  spells: 110,
};

test("contains the complete approved v1.0 collections", () => {
  for (const [collection, expected] of Object.entries(expectedCounts)) {
    assert.equal(data[collection].length, expected, collection);
  }
});

test("uses unique slugs inside every collection", () => {
  for (const collection of Object.keys(expectedCounts)) {
    const slugs = data[collection].map((item) => item.slug);
    assert.equal(new Set(slugs).size, slugs.length, collection);
  }
});

test("contains every race and class hero combination exactly once", () => {
  const combinations = new Set(
    data.heroes.map((hero) => `${hero.raceSlug}/${hero.classSlug}`),
  );
  assert.equal(combinations.size, 30);
  for (const race of data.races) {
    for (const characterClass of data.classes) {
      assert.ok(combinations.has(`${race.slug}/${characterClass.slug}`));
    }
  }
});

test("keeps references valid and every magic school at ten spells", () => {
  const races = new Set(data.races.map((item) => item.slug));
  const classes = new Set(data.classes.map((item) => item.slug));
  const schools = new Set(data.magicSchools.map((item) => item.slug));

  for (const hero of data.heroes) {
    assert.ok(races.has(hero.raceSlug), hero.slug);
    assert.ok(classes.has(hero.classSlug), hero.slug);
  }
  for (const spell of data.spells) {
    assert.ok(schools.has(spell.schoolSlug), spell.slug);
  }
  for (const school of data.magicSchools) {
    assert.equal(
      data.spells.filter((spell) => spell.schoolSlug === school.slug).length,
      10,
      school.slug,
    );
  }
});
