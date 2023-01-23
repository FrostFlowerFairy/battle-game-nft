import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles';
import { useGlobalContext } from '../context';
import { PageHOC, CustomButton, CustomInput, GameLoad } from '../components';

const CreateBattle = () => {
  const [waitBattle, setWaitBattle] = useState(false);
  const navigate = useNavigate();
  const { contract, battleName, setBattleName} = useGlobalContext();

  const handleClick = async () => {
    if(!battleName || !battleName.trim()) return null;

    try {
      await contract.createBattle(battleName);
      setWaitBattle(true);
    }
    catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {waitBattle && <GameLoad />}
      <div className="flex flex-col mb-5">
        <CustomInput label="Battle" placeholder="Enter battle name" value={battleName} handleValueChange={setBattleName} />
        <CustomButton title="Create Battle" handleClick={handleClick} restStyles="mt-6"/>
      </div>

      <p className={styles.infoText} onClick={()=>navigate("/join-battle")} >Or join already existing battle</p>
    </>
  )
};

export default PageHOC(CreateBattle,
  <>Create <br /> a new battle</>,
  <>Create a battle and wait for other players join <br /> ultimate battle card game</>
  );