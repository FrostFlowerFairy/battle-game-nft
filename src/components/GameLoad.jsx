import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from './CustomButton';
import { useGlobalContext } from '../context';
import { player01, player02 } from '../assets';
import styles from '../styles';

const GameLoad = () => {
    const navigate = useNavigate();
    const {walletAddress} = useGlobalContext();
  return (
    
    <div className={`${styles.flexBetween} ${styles.gameLoadContainer}`}>
        <div className={styles.gameLoadBtnBox}>
            <CustomButton title="Choose Battleground" handleClick={()=>navigate("/battleground")} restStyles="mt-6"/>
        </div>
        <div className={`${styles.flexCenter} flex-1 flex-col`}>
            <h1 className={`${styles.headText} text-center`} >Waiting for a <br /> your oppponent</h1>
            <p className={styles.gameLoadText}>
                Pro Tip: while you are waiting , choose yout preffed battleground 
            </p>
            <div className={styles.gameLoadPlayersBox}>
                <div className={`${styles.flexCenter} flex-col`}>
                    <img src={player01} alt="player" className={styles.gameLoadPlayerImg} />
                    <p className={styles.gameLoadPlayerText}>{walletAddress.slice(0,30)}</p>
                </div>
                <h2 className={styles.gameLoadVS} >VS</h2>
                <div className={`${styles.flexCenter} flex-col`}>
                    <img src={player02} alt="player" className={styles.gameLoadPlayerImg} />
                    <p className={styles.gameLoadPlayerText}>?????????????????????</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default GameLoad