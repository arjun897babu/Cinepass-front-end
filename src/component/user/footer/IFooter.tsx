export interface ArrayInterFace {
  name: string;
  link: string
}

export interface ItemProps {
  Links: ArrayInterFace[];
  title?: string;
}

export const NAVIGATION:ArrayInterFace[] = [
  { name: "Home", link: "#" },
  { name: "Movies", link: "#" },
  { name: "Cinemas", link: "#" },
  { name: "Orders", link: "#" },
  { name: "Profile", link: "#" },
];
export const MOVIEUPDATES:ArrayInterFace[] = [
  { name: "Upcoming Movies", link: "#" },
  { name: "Now Showing", link: "#" },
 
];
export const COMPANY:ArrayInterFace[] = [
  { name: "About us", link: "#" },
  { name: "Customer Stories", link: "#" },
  { name: "Online communities", link: "#" },
];
export const TALKTOUS:ArrayInterFace[]  = [
  { name: "+62172992827", link: "#" },
  { name: "cinepassmovies22@gmail.com", link: "#" },
 
];

export const Icons:ArrayInterFace[]  = [
  { name: "FaInstagram", link: "#" },
  { name: "FaTwitter", link: "#" },
  { name: "FaFacebook", link: "#" },
];