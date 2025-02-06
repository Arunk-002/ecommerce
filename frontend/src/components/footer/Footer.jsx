import React from "react";
import { MdOutlineLocationOn } from "react-icons/md";
import { HiOutlineMail } from "react-icons/hi";
import { FiPhone } from "react-icons/fi";


export default function Footer() {
  return (
    <>
      <div className="flex bg-[#F5EBDA] flex-col p-5 gap-y-28 bg-[url('/landing-bg.png')] bg-repeat-x bg-[center_top_4rem] bg-contain mt-3">
        <div className="flex justify-around ">
          <div className="self-center">
            <img src="/Logo.png" alt="Logo image" />
          </div>
          <div>
            <div className="flex flex-col gap-y-2">
              <h2 className="text-[#482817] text-lg font-medium underline decoration-[#AF6900] underline-offset-8 ">ABOUT US</h2>
              <p className="text-[#9E845C] text-left text-sm w-28">
                Story about us Our latest blog posts Purchase our products Keep
                in touch
              </p>
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-y-2">
              <h2 className="text-[#482817] text-lg font-medium underline decoration-[#AF6900] underline-offset-8 ">CONTACT US</h2>
              <div className="flex flex-col  text-[#BB6500] gap-y-2">
               <div className="flex  text-lg gap-x-1 ">
               <MdOutlineLocationOn />
               <p className="text-sm text-[#9E845C]">35 W 46nd Street Portugal</p>
               </div>
               <div className="flex  text-lg gap-x-1 ">
               <HiOutlineMail />
               <p className="text-sm text-[#9E845C]">vinrouge@dotcreativemarket.com</p>
               </div>
               <div className="flex  text-lg gap-x-1 ">
               <FiPhone />
               <p className="text-sm text-[#9E845C]">+(123) 456-7890-456-7890</p>
               </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <p className="text-sm text-[#AF6900] font-bold">
            <span className="text-[#482817]">Copyright</span> Dotcreativemarket
          </p>
        </div>
      </div>
    </>
  );
}
