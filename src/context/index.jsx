import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import {ethers } from 'ethers';
import {useNavigate} from 'react-router-dom';
import { ABI, ADDRESS } from '../contract';
import { createEventListeners } from './createEventListeners';

const GlobalContext = createContext();

export const GlobalContextProvider = ({children}) => {
    const [walletAddress, setWalletAddress] = useState('');
    const [provider, setProvider] = useState();
    const [contract, setContract] = useState();
    const [showAlert, setShowAlert] = useState({
        status: false,
        type: "info",
        message: ""
    });
    const [battleName, setBattleName] = useState("");
    const [gameData, setGameData] = useState({ players: [], pendingBattles: [], activeBattle: null });
    const [updateGameData, setUpdateGameData] = useState(0)
    const [battleground, setBattleground] = useState("bg-astral")
    const [errorMessage, setErrorMessage] = useState('');

    const player1Ref = useRef();
    const player2Ref = useRef();

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

     //* Set battleground to local storage
  useEffect(() => {
    const isBattleground = localStorage.getItem('battleground');

    if (isBattleground) {
      setBattleground(isBattleground);
    } else {
      localStorage.setItem('battleground', battleground);
    }
  }, []);


    // Set smart contract provider to the state
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
            createEventListeners({navigate, contract, provider, walletAddress, setShowAlert, setUpdateGameData, player1Ref,
                player2Ref})
        }
    }, [contract]);

    //* Set the game data to the state
  useEffect(() => {
    const fetchGameData = async () => {
      if (contract) {
        const fetchedBattles = await contract.getAllBattles();
        const pendingBattles = fetchedBattles.filter((battle) => battle.battleStatus === 0);
        let activeBattle = null;

        fetchedBattles.forEach((battle) => {
          if (battle.players.find((player) => player.toLowerCase() === walletAddress.toLowerCase())) {
              activeBattle = battle;
          }
        });

        setGameData({ pendingBattles: pendingBattles.slice(1), activeBattle });
      }
    };

    fetchGameData();
  }, [contract, updateGameData]);

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


  //* Handle error messages
  useEffect(() => {
    if (errorMessage) {
      const parsedErrorMessage = errorMessage?.reason?.slice('execution reverted: '.length).slice(0, -1);

      if (parsedErrorMessage) {
        setShowAlert({
          status: true,
          type: 'failure',
          message: parsedErrorMessage,
        });
      }
    }
  }, [errorMessage]);




    return (
        <GlobalContext.Provider value={{
            contract,
            walletAddress,
            showAlert,
            setShowAlert,
            battleName,
            setBattleName, 
            gameData,
            battleground,
            setBattleground,
            setErrorMessage,
            errorMessage,
        }}>
            {children}
        </GlobalContext.Provider>
    );
}

export const useGlobalContext = () => useContext(GlobalContext);

