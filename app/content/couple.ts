export const couple = {
  groom: {
    full: "Gia Khôi",
    family: "Nguyễn",
  },
  bride: {
    full: "Huyền Trân",
    family: "Huỳnh",
  },
} as const;

export const ceremonies = {
  damNoi: {
    label: "Lễ Ăn Hỏi",
    solar: { day: 5, month: 7, year: 2026 },
    solarDisplay: "05.07.2026",
    solarFull: "Chủ Nhật, ngày 5 tháng 7 năm 2026",
    lunar: "21/5 năm Bính Ngọ",
    isoTarget: "2026-07-05T00:00:00+07:00",
  },
  damCuoi: {
    label: "Lễ Cưới",
    solar: { day: 2, month: 8, year: 2026 },
    solarDisplay: "02.08.2026",
    solarFull: "Chủ Nhật, ngày 2 tháng 8 năm 2026",
    lunar: "20/6 năm Bính Ngọ",
    isoTarget: "2026-08-02T00:00:00+07:00",
  },
} as const;
