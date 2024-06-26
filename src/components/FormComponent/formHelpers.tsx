// Zipcode validation
const postalCodes = require("postal-codes-js");
const countryCode = "PL"; // ISO 3166-1 alpha-2 or alpha-3 country code as string.

export const postalCodeValidation = (zipCode: string) => {
  const message = postalCodes.validate(countryCode, zipCode);
  if (message === true) {
    return true;
  } else {
    return false;
  }
};

export type OrderData = {
  id: string;
  assoType: string;
  timeFrames: { seconds: number; nanoseconds: number }[];
};

export type confirmedOrderData = {
  id: string;
  adminConfirmation: boolean;
};

export type DisabledDays = { [key: string]: string[] };

export type ReservationInfo = {
  [key: string]: { [key: string]: number };
};

export type AssAmounts = {
  [key: string]: number;
};

export const getBookedDays = (
  ordersData: OrderData[],
  confirmedOrdersData: confirmedOrderData[]
) => {
  const confirmedOrdersIds = confirmedOrdersData.map((order) => order.id);
  const filteredOrdersData = ordersData.filter((order) =>
    confirmedOrdersIds.includes(order.id)
  );

  const result = filteredOrdersData.reduce<{
    [key: string]: { [key: string]: number };
  }>((acc, order) => {
    const { assoType, timeFrames } = order;

    if (!acc[assoType]) {
      acc[assoType] = {};
    }
    const list: number[] = [];

    let currTimestampMs = timeFrames[0].seconds * 1000;
    const endTimestampMs = timeFrames[1].seconds * 1000;
    while (currTimestampMs <= endTimestampMs) {
      list.push(currTimestampMs);
      currTimestampMs += 24 * 60 * 60 * 1000;
    }

    list.forEach(function (reservedDate) {
      const dateKey = reservedDate.toString();
      if (!acc[assoType][dateKey]) {
        acc[assoType][dateKey] = 1;
      } else {
        acc[assoType][dateKey] = acc[assoType][dateKey] + 1;
      }
    });
    return acc;
  }, {});
  return result;
};

export const getDisabledDays = (
  reservationInfo: ReservationInfo,
  assAmounts: AssAmounts
) => {
  let disabledDates: DisabledDays = {};
  for (const assType in reservationInfo) {
    const datesObj = reservationInfo[assType];
    disabledDates[assType] = [];
    for (const dateKey in datesObj) {
      const reservationAmount = datesObj[dateKey];
      if (reservationAmount >= assAmounts[assType]) {
        disabledDates[assType].push(dateKey);
      }
    }
  }
  return disabledDates;
};
