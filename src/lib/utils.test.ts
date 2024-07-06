import { formatDate, formatDateTime, formatSecond } from "./utils";

test("Test formatDate", () => {
  expect(formatDate(new Date("2024-07-01T00:38:47.471+00:00"))).toBe(
    "July 1, 2024"
  );
});

test("Test formatDateTime", () => {
  expect(formatDateTime(new Date("2024-07-01T00:38:47.471+00:00"))).toBe(
    "01/07/2024 07:38:47"
  );
});

test("Test formatSecond with the parameter is 0 second", () => {
  expect(formatSecond(0)).toBe("0 sec");
});

test("Test formatSecond with the parameter is less than 60 second", () => {
  expect(formatSecond(40)).toBe("40 sec");
});

test("Test formatSecond with the parameter is equal or greater than 60 second", () => {
  expect(formatSecond(200)).toBe("03 min");
});

test("Test formatSecond with the parameter is 3600 second", () => {
  expect(formatSecond(3600)).toBe("1h ");
});

test("Test formatSecond with the parameter is 660 second", () => {
  expect(formatSecond(660)).toBe("11 min");
});
