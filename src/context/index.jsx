import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import {ethers } from 'ethers';
import {useNavigate} from 'react-router-dom';
import { ABI, ADDRESS } from '../contract';
import { createEventListeners } from './createEventListeners';

const GlobalContext = createContext();

export const GlobalContextProvider = ({children}) => {
    const [walletAddress, setWalletAddress] = useState('');
    const [provider, setProvider] = useState("");
    const [contract, setContract] = useState();
    const [showAlert, setShowAlert] = useState({
        status: false,
        type: "info",
        message: ""
    });
    const [battleName, setBattleName] = useState("");

    const navigate = useNavigate();

    const updateWalletAddress = async () => {
        
        const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = account[0];
        setWalletAddress(address);

       if(account){setWalletAddress(account[0])}
    };

    useEffect(() => {
        updateWalletAddress();
        window.ethereum.on('accountsChanged', updateWalletAddress);

    }, []);

    useEffect(() => {
        const setSmartContract = async () => {
            const newProvider = new ethers.providers.Web3Provider(web3.currentProvider);
            const signer = newProvider.getSigner();
            const newContract = new ethers.Contract(ADDRESS, ABI, signer);
            setProvider(newProvider);
            setContract(newContract);

        };
        setSmartContract();
    }, []);

    useEffect(() => {
        if(contract){
            createEventListeners({navigate, contract, provider, walletAddress, setShowAlert})
        }
    }, [contract]);

    useEffect(() => {
        if(showAlert?.status){
            const timer = setTimeout(() => {
                setShowAlert({
                    status: false,
                    type: "info",
                    message: ""
                });
            }, 5000);
            return () => clearTimeout(timer);
        }
      
    }, [showAlert]);

    return (
        <GlobalContext.Provider value={{
            contract,
            walletAddress,
            showAlert,
            setShowAlert,
            battleName,
            setBattleName
        }}>
            {children}
        </GlobalContext.Provider>
    );
}

export const useGlobalContext = () => useContext(GlobalContext);

