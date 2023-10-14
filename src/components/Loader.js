import React from "react";

import { loader } from "../assets";

const Loader = () => {
    return (
        <div className="fixed z-10 inset-0 h-screen bg-[rgba(0,0,0,0.7)] flex justify-center items-center flex-col">
            <img
                src={loader}
                alt="loader"
                className="w-[100px] h-[100px] object-contain"
            />
            <p className="font-epilogue font-bold text-[20px] text-center mt-[20px] text-white">
                Transaction is in progress <br /> Please wait...
            </p>
        </div>
    );
};

export default Loader;
