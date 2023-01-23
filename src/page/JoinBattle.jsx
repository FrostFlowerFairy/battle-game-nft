import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../context'
import { PageHOC, CustomButton } from '../components'
import styles from '../styles'

const JoinBattle = () => {
    const navigate = useNavigate();
  return (
    <>
    <h2 className={styles.headText}>Available battles:</h2>
    <p className={styles.infoText} onClick={()=> navigate("/create-battle")} >Or create a new battle</p>
    </>
  )
}

export default PageHOC(JoinBattle, <>Join <br /> a battle</>, <>Join already existing battles</> )