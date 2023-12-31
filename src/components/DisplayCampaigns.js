import React from "react";
import { useNavigate } from "react-router-dom";

import { loader } from "../assets";
import FundCard from "./FundCard";
import { Loader } from "../components";

function DisplayCampaigns({ title, isLoading, campaigns }) {
    const navigate = useNavigate();

    const handleNavigate = (campaign) => {
        navigate(`/campaign-details/${campaign.title}`, {
            state: campaign,
        });
    };

    return (
        <div>
            <h1 className="font-epilogue font-semibold text-white text-left">
                {title} ({campaigns.length})
                <div className="flex flex-wrap mt-[20px] gap-[26px]">
                {isLoading && <Loader />}

                    {!isLoading && campaigns.length === 0 && (
                        <p className="font-epilogue font-semibold text-[40px] leading-[30px] text-[#818183]">
                            You have not created any campaigns yet.
                        </p>
                    )}

                    {!isLoading &&
                        campaigns.length > 0 &&
                        campaigns.map((campaign) => (
                            <FundCard
                                key={campaign.id}
                                {...campaign}
                                handleClick={() => handleNavigate(campaign)}
                            />
                        ))}
                </div>
            </h1>
        </div>
    );
}

export default DisplayCampaigns;
