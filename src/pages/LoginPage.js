import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons';

import '../assets/styles/pages/LoginPage.css';

function LoginPage(){
    const [emailErrorVisibility, setEmailErrorVisibility] = useState('hidden');
    const [passwordErrorVisibility, setPasswordErrorVisibility] = useState('hidden');

    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

    const [currentEmail, setCurrentEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');

    const handleClick = e => {
        if(e.target.outerText === 'Sign Up') {
            /////////////////////////////////
            //REDIRECT TO SIGN UP PAGE HERE//
            /////////////////////////////////
            console.log('REDIRECT TO SIGN UP PAGE')
            return 0;
        }
        e.preventDefault();

        setEmailErrorMessage('');
        setPasswordErrorMessage('');
        setEmailErrorVisibility('hidden');
        setPasswordErrorVisibility('hidden');

        // Validations

        let emailIsValid = true;
        let passwordIsValid = true;

        let emailHasAnAt = false;
        let emailHasADomain = true;
        currentEmail.split('').forEach((char, index, arr) => {
            if(char === '@'){
                emailHasAnAt = true;
            }
            if(arr.indexOf('@') === arr.length - 1){
                emailHasADomain = false;
            }
        })
        if(currentEmail === ''){
            emailIsValid = false;
            setEmailErrorMessage('Please enter your email');
            setEmailErrorVisibility('visible');
        } else if(!emailHasAnAt){
            emailIsValid = false;
            setEmailErrorMessage('Invalid email, please add an @ to the email');
            setEmailErrorVisibility('visible');
        } else if(!emailHasADomain){
            emailIsValid = false;
            setEmailErrorMessage('Invalid email, add a domain next to the @');
            setEmailErrorVisibility('visible');
        }

        if(currentPassword.length < 4){
            passwordIsValid = false;
            if(currentPassword === ''){
                setPasswordErrorMessage('Please enter your password');
                setPasswordErrorVisibility('visible');
            } else {
                setPasswordErrorMessage('Invalid password, the password is too short');
                setPasswordErrorVisibility('visible');
            }  
        }

        if(emailIsValid && passwordIsValid){
            /////////////////////////////
            //REDIRECT TO HOMEPAGE HERE//
            /////////////////////////////
            console.log('REDIRECT TO HOMEPAGE')
        }

    }

    const handleChange = e => {
        if(e.target.name === 'login-email'){
            setCurrentEmail(e.target.value);
        } else {
            setCurrentPassword(e.target.value);
        }
    }

    return(
        <div className="login-form-container">
            <form className="login-form">
                <fieldset className="login-login-fieldset">
                    <h1 className="login-form__legend">Sign In</h1>
                    <div className="login-input-container">
                        <div className="input-container__input">
                            <span className="login-input__icon"><FontAwesomeIcon icon={faUser}/></span><input onChange={handleChange} className="login-input__input" type="email" name="login-email" id="login-email" placeholder="Email" required />
                        </div>
                        <div className="input-container__error-message">
                            <span style={{color: 'red', visibility: emailErrorVisibility}} className="email-error-span">{emailErrorMessage}</span>
                        </div>
                    </div>
                    <div className="login-input-container">
                        <div className="input-container__input">
                            <span className="login-input__icon"><FontAwesomeIcon icon={faKey}/></span><input onChange={handleChange} className="login-input__input" type="password" name="login-password" id="login-password" placeholder="Password" required />
                        </div>
                        <div className="input-container__error-message">
                            <span style={{color: 'red', visibility: passwordErrorVisibility}} className="password-error-span">{passwordErrorMessage}</span>
                        </div>
                    </div>
                    <button onClick={handleClick} className="login-form__submit" type="submit">Sign In</button>
                </fieldset>
                <fieldset className="login-signup-fieldset">
                    <p className="signup__text">Don't have an account? <a href="/">Register</a></p>
                </fieldset>
            </form>
        </div>
    )
}

export default LoginPage; 