import React from "react";
import "./LandingPage.css";
function LandingPage() {
  return (
    <>
      <div className="bg-class w-full flex justify-center ">
        <div className="container items-center flex  w-full h-auto">
          <div className="container flex items-center h-full w-full">
            <div className="flex flex-col gap-y-9 justify-start">
              <h3 className="text-xl font-medium tracking-wide">WINEMAKING TRADITION</h3>
              <h1 className="text-6xl font-bold">
                Wines from all over the world
              </h1>
              <p className="landing-p text-lg w-[90%]">
                Nunc morbi purus purus nisl, amet. Non eleifend aliquam nibh <br />
                ultrices platea platea enim tellus, tincid.
              </p>
            </div>
          </div>
          <div className="container flex justify-end">
            <img
              className="image-landing h-full"
              src="public/product.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
