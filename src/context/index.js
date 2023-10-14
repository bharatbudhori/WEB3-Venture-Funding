import React, { useContext, createContext } from "react";
import {
    useAddress,
    useContract,
    useMetamask,
    useContractWrite,
    useContractRead,
} from "@thirdweb-dev/react";

import { ethers } from "ethers";
import { contractABI } from "../utils";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract(
        "0x60A038733757B225B0f917dE91bA6F25adD49933",
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

    const getUserCampaigns = async () => {
        const allCampaigns = await getCampaigns();

        const userCampaigns = allCampaigns.filter(
            (campaign) => campaign.owner === address
        );

        return userCampaigns;
    };

    const donate = async (pId, amount) => {
        try {
            const data = await contract.call(
                "donateToCampaign",
                [pId],
                {
                    value: ethers.utils.parseEther(amount),
                }
            );

            return data;
        } catch (error) {
            console.log("contract call failed", error);
        }
    };

    const getDonations = async (pId) => {
        try {
            const donations = await contract.call("getDonators", [pId]);
            const numberOfDonations = donations[0].length;

            const parsedDonations = [];

            for (let i = 0; i < numberOfDonations; i++) {
                parsedDonations.push({
                    donator: donations[0][i],
                    donation: ethers.utils.formatEther(
                        donations[1][i].toString()
                    ),
                });
            }

            return parsedDonations;
        } catch (error) {
            console.log("contract call failed", error);
        }
    };

    return (
        <StateContext.Provider
            value={{
                address,
                contract,
                connect,
                createCampaign: publishCampaign,
                getCampaigns,
                getUserCampaigns,
                donate,
                getDonations,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
