import { ceremonies } from "./couple";

export type SideKey = "groom" | "bride";

export const sides = {
  groom: {
    key: "groom" as const,
    label: "Họ hàng nhà trai",
    family: "Nhà Trai",
    parents: {
      father: "Nguyễn Quốc Bảo",
      mother: "Phan Hồng Thắm",
    },
    address: {
      street: "Số nhà 130/12, Phước Yên A",
      ward: "Phú Quới",
      province: "Vĩnh Long",
    },
    ceremony: ceremonies.damCuoi,
    hostFamilyLabel: "Tư gia nhà trai",
    time: "TBD",
    mapsUrl: "https://maps.app.goo.gl/Rv9jAc1wfAm2vxAM6",
  },
  bride: {
    key: "bride" as const,
    label: "Họ hàng nhà gái",
    family: "Nhà Gái",
    parents: {
      father: "Huỳnh Văn Thường",
      mother: "Trần Kim Mai",
    },
    address: {
      street: "Số nhà 46, Khu vực 8",
      ward: "Phường Long Mỹ",
      province: "Thành phố Cần Thơ",
    },
    ceremony: ceremonies.damNoi,
    hostFamilyLabel: "Tư gia nhà gái",
    time: "TBD",
    mapsUrl: "https://maps.app.goo.gl/8vBwQXkWc5YKvN877",
  },
} as const;

export type Side = (typeof sides)[SideKey];

export function resolveSide(pathname: string): Side {
  if (pathname.includes("bride")) return sides.bride;
  return sides.groom;
}
