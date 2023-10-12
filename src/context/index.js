import React, { useContext, createContext } from "react";
import {
    useAddress,
    useContract,
    useMetamask,
    useContractWrite,
} from "@thirdweb-dev/react";

import { ethers } from "ethers";
import { contractABI } from "../utils";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract(
        "0xFEb87e798Bd44ea534eec9528275A82F9279540C",
        contractABI
    );

    const { mutateAsync: createCampaign } = useContractWrite(
        contract,
        "createCampaign"
    );

    const address = useAddress();
    const connect = useMetamask();

    const publishCampaign = async (form) => {
        try {
            const data = await createCampaign({
                args: [
                    address,
                    form.title,
                    form.description,
                    form.target,
                    new Date(form.deadline).getTime(),
                    form.image,
                ],
            });

            console.log("contract call successful", data);
        } catch (error) {
            console.log("contract call failed", error);
        }
    };

    const getCampaigns = async () => {
        const campaigns = await contract.call("getCampaigns");

        const parsedCampaigns = campaigns.map((campaign, i) => {
            return {
                owner: campaign.owner,
                title: campaign.title,
                description: campaign.description,
                target: ethers.utils.formatEther(campaign.target.toString()),
                deadline: campaign.deadline.toNumber(),
                image: campaign.image,
                amountCollected: ethers.utils.formatEther(
                    campaign.amountCollected.toString()
                ),
                pId: i,
            };
        });

        console.log("parsedCampaigns", parsedCampaigns);

        return parsedCampaigns;
    };

    return (
        <StateContext.Provider
            value={{
                address,
                contract,
                connect,
                createCampaign: publishCampaign,
                getCampaigns,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
