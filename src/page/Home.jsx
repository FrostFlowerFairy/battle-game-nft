import React, {useState, useEffect} from 'react';
import { PageHOC,CustomInput,CustomButton } from '../components';
import {useGlobalContext} from '../context';
import {useNavigate} from 'react-router-dom';


const Home = () => {
  const { contract, walletAddress, setShowAlert, gameData,setErrorMessage} = useGlobalContext();
  const [playerName, setPlayerName] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try{
      const playerExists = await contract.isPlayer(walletAddress);  

      if(!playerExists) {
        await contract.registerPlayer(playerName, playerName, { gasLimit: 500000 });
        setShowAlert({
          status: true,
          type: "success",
          message: `Player with name ${playerName} registered successfully`
        });

        setTimeout(() => navigate('/create-battle'), 8000);
      }  
    }
    catch(err){
      setErrorMessage(err)
    }
  };

useEffect(() => {
    const checkForPlayerToken = async () => {
      const playerExists = await contract.isPlayer(walletAddress);
      const playerTokenExists = await contract.isPlayerToken(walletAddress);

      if (playerExists && playerTokenExists) navigate('/create-battle');
    };

    if (contract) checkForPlayerToken();
  }, [contract]);

useEffect(() => {
  if (gameData.activeBattle) {
    navigate(`/battle/${gameData.activeBattle.name}`);
  }
}, [gameData]);

return(
    <div className="flex flex-col">
     <CustomInput
     label="Name"
      placeholder="Enter your name"
      value={playerName}
      handleValueChange={setPlayerName}
     />
      <CustomButton 
            title="Register"
            handleClick={handleRegister}
            restStyles="mt-6"
            />
    </div>
  )
};

export default PageHOC(Home,
  <>Welcome to Avax Gods <br /> a web3 NFT card game</>,
  <>Connect your Wallet to start playing <br /> ultimate battle card game</>
  );