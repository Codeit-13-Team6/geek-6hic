import {
  MeetingFormErrors,
  MeetingFormValues,
} from "@/app/meetings/modal/modal";

export const getNormalizedMeetingLink = (link: string) => {
  const trimmedLink = link.trim();

  if (!trimmedLink) {
    return "";
  }

  if (trimmedLink.startsWith("http://") || trimmedLink.startsWith("https://")) {
    return trimmedLink;
  }

  return `https://${trimmedLink}`;
};

const isValidIpv4Address = (hostname: string) => {
  const ipv4Regex =
    /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

  return ipv4Regex.test(hostname);
};

const isLikelyValidDomain = (hostname: string) => {
  if (!hostname.includes(".")) {
    return false;
  }

  if (hostname.startsWith(".") || hostname.endsWith(".")) {
    return false;
  }

  if (hostname.includes("..")) {
    return false;
  }

  return true;
};

const getRawHostname = (link: string) => {
  const trimmedLink = link.trim();

  if (!trimmedLink) {
    return "";
  }

  const linkWithoutProtocol = trimmedLink.replace(/^https?:\/\//, "");
  const hostWithPort = linkWithoutProtocol.split("/")[0];
  const rawHostname = hostWithPort.split(":")[0];

  return rawHostname.toLowerCase();
};

const isValidRawHostname = (link: string) => {
  const rawHostname = getRawHostname(link);

  if (!rawHostname) {
    return false;
  }

  if (rawHostname === "localhost") {
    return true;
  }

  if (isValidIpv4Address(rawHostname)) {
    return true;
  }

  return isLikelyValidDomain(rawHostname);
};

export const getMeetingLinkErrorMessage = (link: string) => {
  const trimmedLink = link.trim();

  if (!trimmedLink) {
    return "모임 링크를 입력해주세요.";
  }

  if (!isValidRawHostname(trimmedLink)) {
    return "올바른 링크 형식을 입력해주세요.";
  }

  const normalizedLink = getNormalizedMeetingLink(trimmedLink);

  try {
    const parsedLink = new URL(normalizedLink);

    if (parsedLink.protocol !== "http:" && parsedLink.protocol !== "https:") {
      return "http 또는 https 링크만 입력할 수 있습니다.";
    }

    return "";
  } catch {
    return "올바른 링크 형식을 입력해주세요.";
  }
};

export const validateMeetingCategoryStep = (formValues: MeetingFormValues) => {
  return {
    category: formValues.category ? "" : "모임 종류를 선택해주세요.",
  };
};

export const validateMeetingBasicInfoStep = (formValues: MeetingFormValues) => {
  return {
    name: formValues.name.trim() ? "" : "모임 이름을 입력해주세요.",
    description: formValues.description.trim()
      ? ""
      : "모임 설명을 입력해주세요.",
    link: getMeetingLinkErrorMessage(formValues.link),
    imageUrl: "",
  };
};

const INVALID_END_DATETIME_MESSAGE =
  "모집 마감은 모임 시작보다 늦을 수 없습니다.";

export const validateMeetingScheduleStep = (formValues: MeetingFormValues) => {
  const errors = {
    startDate: formValues.startDate ? "" : "모임 시작 날짜를 입력해주세요.",
    startTime: formValues.startTime ? "" : "모임 시작 시간을 입력해주세요.",
    endDate: formValues.endDate ? "" : "모집 마감 날짜를 입력해주세요.",
    endTime: formValues.endTime ? "" : "모집 마감 시간을 입력해주세요.",
    capacity: "",
  };

  const capacityNumber = Number(formValues.capacity);

  if (!formValues.capacity.trim()) {
    errors.capacity = "모임 정원을 입력해주세요.";
  } else if (!Number.isInteger(capacityNumber) || capacityNumber < 1) {
    errors.capacity = "모임 정원은 1명 이상 입력해주세요.";
  }

  if (formValues.startDate && formValues.endDate) {
    const isEndDateAfterStartDate = formValues.endDate > formValues.startDate;
    const isSameDateAndEndTimeAfterStartTime =
      formValues.startDate === formValues.endDate &&
      formValues.startTime &&
      formValues.endTime &&
      formValues.endTime >= formValues.startTime;

    if (isEndDateAfterStartDate || isSameDateAndEndTimeAfterStartTime) {
      errors.endDate = INVALID_END_DATETIME_MESSAGE;
      errors.endTime = INVALID_END_DATETIME_MESSAGE;
    }
  }

  return errors;
};

export const hasMeetingValidationError = (
  errors: Partial<MeetingFormErrors>,
) => {
  return Object.values(errors).some(Boolean);
};
