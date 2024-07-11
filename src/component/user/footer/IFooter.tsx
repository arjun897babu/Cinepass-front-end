export interface ArrayInterFace {
  name: string;
  link: string
}

export interface ItemProps {
  Links: ArrayInterFace[];
  title?: string;
}

export const PRODUCTS:ArrayInterFace[] = [
  { name: "Drag And Drop", link: "#" },
  { name: "Visual Studio X", link: "#" },
  { name: "Easy Content", link: "#" },
];
export const RESOURCES:ArrayInterFace[] = [
  { name: "Industries and tools", link: "#" },
  { name: "Use cases", link: "#" },
  { name: "Blog", link: "#" },
  { name: "Online evenet", link: "#" },
  { name: "Nostrud exercitation", link: "#" },
];
export const COMPANY:ArrayInterFace[] = [
  { name: "Diversity & inclusion", link: "#" },
  { name: "About us", link: "#" },
  { name: "Press", link: "#" },
  { name: "Customer Stories", link: "#" },
  { name: "Online communities", link: "#" },
];
export const SUPPORT:ArrayInterFace[]  = [
  { name: "Documentation", link: "#" },
  { name: "Tutorials & guides", link: "#" },
  { name: "Webinars", link: "#" },
  { name: "Open-source", link: "#" },
];

export const Icons:ArrayInterFace[]  = [
  { name: "FaInstagram", link: "#" },
  { name: "FaTwitter", link: "#" },
  { name: "FaFacebook", link: "#" },
];