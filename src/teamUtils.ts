export const REQUIRED_MEMBER_COUNT = 16;
export const TEAM_COUNT = 8;
export const TEAM_SIZE = 2;

export type Team = {
  id: number;
  members: string[];
};

export const DEFAULT_MEMBERS = [
  "成员 01",
  "成员 02",
  "成员 03",
  "成员 04",
  "成员 05",
  "成员 06",
  "成员 07",
  "成员 08",
  "成员 09",
  "成员 10",
  "成员 11",
  "成员 12",
  "成员 13",
  "成员 14",
  "成员 15",
  "成员 16",
];

export function parseRoster(text: string) {
  return text
    .split(/[\n,，、;；]+/)
    .map((name) => name.trim())
    .filter(Boolean);
}

export function validateRoster(text: string) {
  const names = parseRoster(text);
  const duplicatedNames = names.filter((name, index) => names.indexOf(name) !== index);

  if (names.length !== REQUIRED_MEMBER_COUNT) {
    return {
      ok: false,
      names,
      message: `需要刚好 ${REQUIRED_MEMBER_COUNT} 人，当前是 ${names.length} 人。`,
    };
  }

  if (duplicatedNames.length > 0) {
    return {
      ok: false,
      names,
      message: `名单里有重复姓名：${Array.from(new Set(duplicatedNames)).join("、")}。`,
    };
  }

  return {
    ok: true,
    names,
    message: "名单已就绪，可以开始抽签。",
  };
}

export function createTeams(names: string[]): Team[] {
  const shuffled = shuffle(names);

  return Array.from({ length: TEAM_COUNT }, (_, index) => {
    const start = index * TEAM_SIZE;

    return {
      id: index + 1,
      members: shuffled.slice(start, start + TEAM_SIZE),
    };
  });
}

export function formatTeams(teams: Team[]) {
  return teams
    .map((team) => `第 ${team.id} 组：${team.members.join(" + ")}`)
    .join("\n");
}

function shuffle<T>(items: T[]) {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const targetIndex = secureRandomIndex(index + 1);
    [result[index], result[targetIndex]] = [result[targetIndex], result[index]];
  }

  return result;
}

function secureRandomIndex(maxExclusive: number) {
  const cryptoApi = globalThis.crypto;

  if (!cryptoApi?.getRandomValues) {
    return Math.floor(Math.random() * maxExclusive);
  }

  const bucket = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive;

  do {
    cryptoApi.getRandomValues(bucket);
  } while (bucket[0] >= limit);

  return bucket[0] % maxExclusive;
}
