import React from "react";
import { Link } from 'react-router-dom'
import * as IFooter from "./IFooter";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import logo from '/cinepass logo.png'

const iconMap = {
  FaFacebook: FaFacebook,
  FaTwitter: FaTwitter,
  FaInstagram: FaInstagram,
};

const SocialIcons: React.FC<{ Icons: IFooter.ArrayInterFace[] }> = ({ Icons }) => {
  return (
    <div className="text-teal-500">
      {Icons.map((icon) => {
        const IconComponent = iconMap[icon.name as keyof typeof iconMap];
        return (
          <span
            key={icon.name}
            className="p-2 cursor-pointer inline-flex items-center
            rounded-full bg-white text-black mx-1.5 text-xl hover:text-white hover:bg-black
            duration-300 "
          >
            {IconComponent && <IconComponent />}
          </span>
        );
      })}
    </div>
  );
};

const ItemsContainer: React.FC = () => {
  return (
    <div className="grid grid-cols-1 text-center sm:grid-cols-4 sm:text-justify sm:gap-4 gap-6 sm:px-8 px-5 py-16">
      <Item Links={IFooter.PRODUCTS} title="PRODUCTS" />
      <Item Links={IFooter.RESOURCES} title="RESOURCES" />
      <Item Links={IFooter.COMPANY} title="COMPANY" />
      <Item Links={IFooter.SUPPORT} title="SUPPORT" />
    </div>
  );
};


const Item: React.FC<IFooter.ItemProps> = ({ Links, title }) => {
  return (
    <ul>
      <h1 className="mb-1 font-semibold">{title}</h1>
      {Links.map((link) => (
        <li key={link.name}>
          <a
            className="text-gray-400 hover:text-white duration-300
          text-sm cursor-pointer leading-6"
            href={link.link}
          >
            {link.name}
          </a>
        </li>
      ))}
    </ul>
  );
};


const UserFooter: React.FC = (): JSX.Element => {
  return (
    <footer className="bg-black text-white">
      {/* <div className="md:flex md:justify-between md:items-center sm:px-12 px-4 bg-[#ffffff19] py-7">
        <h1
          className="lg:text-4xl text-3xl md:mb-0 mb-6 lg:leading-normal font-semibold
         md:w-2/5"
        >
          <span className="text-teal-400">Free</span> until you're ready to
          launch
        </h1>
        <div>
          <input
            type="text"
            placeholder="Enter Your ph.no"
            className="text-gray-800
           sm:w-72 w-full sm:mr-5 mr-1 lg:mb-0 mb-4 py-2.5 rounded px-2 focus:outline-none"
          />
          <button
            className="bg-teal-400 hover:bg-teal-500 duration-300 px-5 py-2.5 font-[Poppins]
           rounded-md text-white md:w-auto w-full"
          >
            Request Code
          </button>
        </div>
      </div> */}
      <ItemsContainer />
      <div
        className=" social-media flex justify-between  items-center
      text-center pt-2 text-gray-400 text-sm p-8"
      >
        <span>© 2024 Apply. All rights reserved.</span>
        <SocialIcons Icons={IFooter.Icons} />
      </div>
    </footer>
  );
};

export default UserFooter;