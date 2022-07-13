
import { CognitoUser, AuthenticationDetails, CognitoAccessToken, ICognitoUserAttributeData } from "amazon-cognito-identity-js";
import { useEffect, useState } from "react";
import { EMAIL_AWS_COGNITO, PASSWORD_AWS_COGNITO, USER_NAME_AWS_COGNITO, } from "../common";
import authAwsPool from "./auth-aws";
import { authContext} from "../data/authContext";

// import 

const AuthenticateUser = () => {   
    const user = new CognitoUser({
        Username: USER_NAME_AWS_COGNITO,
        Pool: authAwsPool,
    });

    const authDetails = new AuthenticationDetails({
        Username: USER_NAME_AWS_COGNITO,
        Password: PASSWORD_AWS_COGNITO,
    });

    const userName = user.getUsername();    
    user.authenticateUser(authDetails, {
        onSuccess: (data) => {
            console.log("accessToken: ", data);
            // localStorage.setItem("accessToken", data.)AccessToken, IdToken, RefreshToken, TokenType=Bearer
            authContext.AccessToken = data.accessToken.jwtToken    
            authContext.IdToken = data.idToken.jwtToken    
            authContext.RefreshToken = data.refreshToken.token 
            authContext.TokenType = data.refreshToken.token 
            console.log(authContext);        
        },
        onFailure: (error) => {
            console.error("onFailure: ", error);
        },
        newPasswordRequired: (response) => {
            const userAttributes = {
                'email': EMAIL_AWS_COGNITO
            }
            console.log("newPasswordRequired: ", userAttributes, response);
            user.completeNewPasswordChallenge(PASSWORD_AWS_COGNITO, userAttributes, {
                onSuccess: (result) => {
                    console.log("NEW PASSWORD COMPLETED: New Password Set");
                    // console.log(result);
                },
                onFailure: (err) => {
                    // console.log(err);
                }
            })
        },
    })

    // user.completeNewPasswordChallenge("Admin123@", '', {
    //     onSuccess: (data) => {
    //         console.log("onSuccess: ", data);
    //     },
    //     onFailure: (err) => {
    //         console.error("onFailure: ", err);
    //     },
    //     newPasswordRequired: (data) => {
    //         console.log("newPasswordRequired: ", data);
    //     },
    // });

    // authAwsPool.signUp("sudhir.wani@ideaqu.com", "Admin@123", [{
    //     Name: 'email',
    //     Value: 'sudhir111.wani@ideaqu.com',
    // }], null, (err, data) => {
    //     if (err) {
    //         console.error(err);
    //     }
    //     console.log(data, "new account");
    // });


    // user.changePassword("Admin@123", "NG$U$@}P}0>~", (err, result) => {
    //     if (err) {
    //         console.error(err);
    //     } else {
    //         console.log("CREATE PASS RESULT : " , result);
    //     }
    // })

    // user.authenticateUser(authDetails, {
    //     onSuccess: (data) => {
    //         console.log("onSuccess: ", data);
    //     },
    //     onFailure: (err) => {
    //         console.error("onFailure: ", err);
    //     },
    //     newPasswordRequired: (data) => {
    //         console.log("newPasswordRequired: ", data);
    //     },
    // });


    return (
        <div>
            <div className={"container sec-header-2"}>
                <h1>Auth Test</h1>
            </div>
        </div>
    );
}


export default AuthenticateUser;