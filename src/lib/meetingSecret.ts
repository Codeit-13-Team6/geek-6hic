const BASE_DATE = "2100-01-01";


export function generateSecretTime(): string {
  let h: number, m: number, s: number;

  do {
    h = Math.floor(Math.random() * 24);
    m = Math.floor(Math.random() * 60);
    s = Math.floor(Math.random() * 60);
  } while (h === 0 && m === 0 && s === 0);

  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

/** 비밀 시간을 포함한 ISO dateTime 문자열을 반환합니다. */
export function buildSecretDateTime(secretTime: string): string {
  const [h, m, s] = secretTime.split(":");
  return `${BASE_DATE}T${h}:${m}:${s}.000Z`;
}

/** 일반 모임용 dateTime(시/분/초 모두 00)을 반환합니다. */
export function buildNormalDateTime(): string {
  return `${BASE_DATE}T00:00:00.000Z`;
}

/** dateTime의 시/분/초(UTC)가 00:00:00이 아니면 비밀 모임으로 판별합니다. */
export function isSecretMeeting(dateTime: string): boolean {
  const dt = new Date(dateTime);
  return dt.getUTCHours() !== 0 || dt.getUTCMinutes() !== 0 || dt.getUTCSeconds() !== 0;
}

/** dateTime에서 비밀 코드(HHMMSS, UTC 기준)를 추출합니다. */
export function extractSecretCode(dateTime: string): string {
  const dt = new Date(dateTime);
  return [dt.getUTCHours(), dt.getUTCMinutes(), dt.getUTCSeconds()]
    .map((v) => String(v).padStart(2, "0"))
    .join("");
}

/** 사용자 입력값과 dateTime에서 추출한 비밀 코드를 비교합니다. */
export function verifySecretCode(input: string, dateTime: string): boolean {
  return input.trim() === extractSecretCode(dateTime);
}
