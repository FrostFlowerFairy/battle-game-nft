import React, {useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styles from '../styles'
import { Alert, Card, PlayerInfo, GameInfo, ActionButton } from '../components'
import { useGlobalContext } from '../context'
import {attack, defense, attackSound, defenseSound, player01Icon, player02Icon} from "../assets" 
import {playAudio} from "../utils/animation.js"

const Battle = () => {
    const {contract, gameData, walletAddress, showAlert, setShowAlert, battleground, setErrorMessage, player1Ref, player2Ref } = useGlobalContext()
    const  [player01, setplayer01] = useState({})
    const  [player02, setplayer02] = useState({})

    const navigate = useNavigate()
    const {battleName} = useParams()

    useEffect(() => {
      const getPlayerInfo = async () => {
        try {
          let player01Address = null
          let player02Address = null

          if(gameData.activeBattle?.players[0].toLowerCase() === walletAddress.toLowerCase()){
            player01Address = gameData.activeBattle?.players[0] 
            player02Address = gameData.activeBattle?.players[1]
          } else {
            player01Address = gameData.activeBattle?.players[1] 
            player02Address = gameData.activeBattle?.players[0]
          }

          const p1TokenData = await contract.getPlayerToken(player01Address)
          const player01 = await contract.getPlayer(player01Address)
          const player02 = await contract.getPlayer(player02Address)

          const p1Attack = p1TokenData.attackStrength.toNumber()
          const p1Defense = p1TokenData.defenseStrength.toNumber()
          const p1Health = player01.playerHealth.toNumber()
          const p1Mana = player01.playerMana.toNumber()
          const p2Health = player02.playerHealth.toNumber()
          const p2Mana = player02.playerMana.toNumber()

          setplayer01({...player01, att: p1Attack, def: p1Defense, health: p1Health, mana: p1Mana})
          setplayer02({...player02, att: "X", def: "X", health: p2Health, mana: p2Mana})
        }
        catch(err) {
          setErrorMessage(err)
        }
      }
      if(contract) getPlayerInfo()
    }, [gameData, battleName, contract])


  useEffect(() => {
    const timer = setTimeout(() => {
      if (!gameData?.activeBattle) navigate('/');
    }, [2000]);

    return () => clearTimeout(timer);
  }, []);

    const makeMove = async (choice) => {
      playAudio(choice === 1 ? attackSound : defenseSound)

      try {
        await contract.attackOrDefendChoice(choice, battleName, { gasLimit: 500000 })
        setShowAlert({status: true, type: "info", message: "Move made successfully"})
      }
      catch(err) {
        setErrorMessage(err)
      }
    }


  return (
    <div className={`${styles.flexBetween} ${styles.gameContainer} ${battleground}`}>
                  {showAlert.status && <Alert type={showAlert.type} message={showAlert.message}/>}
      <PlayerInfo player={player02} playerIcon={player02Icon} />
      <div className={`${styles.flexCenter} flex-col my-10`}>
        <Card card={player02} title={player02?.playerName} playerTwo cardRef={player2Ref} />
        <div className='flex items-center flex-row'>
          <ActionButton imgUrl={attack} handleClick={()=>{makeMove(1)}} restStyles="mr-2 hover:border-yellow-400" />
          <Card card={player01} title={player01?.playerName} cardRef={player1Ref} restStyles="mt-3" />
          <ActionButton imgUrl={defense} handleClick={()=>{makeMove(2)}} restStyles="ml-6 hover:border-red-600" />
        </div>
      </div>
      <PlayerInfo player={player01} playerIcon={player01Icon} />
      <GameInfo />
    </div>
  )
}

export default Battle