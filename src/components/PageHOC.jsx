import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Alert} from '../components';

import { useGlobalContext } from '../context';

import {heroImg, logo} from '../assets'; 
import styles from '../styles';

const PageHOC = (Component, title, description) => () => {
    const {showAlert} = useGlobalContext();
    const navigate = useNavigate();

        return (
        <div className={styles.hocContainer}>
            {showAlert.status && <Alert type={showAlert.type} message={showAlert.message}/>}
           <div className={styles.hocContentBox}>
            <img src={logo} alt="logo" className={styles.hocLogo} onClick={()=> navigate("/")} />
            <div className={styles.hocBodyWrapper}>
                <div className="flex flex-row w-full">
                    <h1 className={`flex ${styles.headText} head-text `}>{title}</h1>
                </div>
                <p className={`${styles.normalText} my-10 `}>
                    {description}</p>
                <Component/>
            </div>
           </div>
           <div className='flex flex-1'>
            <img src={heroImg} alt="hero-img" className='w-full xl:h-full object-cover' />
           </div>
        </div>
        );
    };


export default PageHOC;
