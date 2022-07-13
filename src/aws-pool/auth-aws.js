import { CognitoUserPool } from "amazon-cognito-identity-js";

//DEV Detais
// const awsAuthPool = {
//     UserPoolId: "ap-southeast-1_e3Vf2hVfB",
//     ClientId: "117p6d2oeohsfgm5sbmberkotr"
// }

//UAT Details
const awsAuthPool = {
    UserPoolId: "ap-southeast-1_IwFKdYOeP",
    ClientId: "7ulb67p4gmmgmi2a7b1oqr9mmg"
}

//PROD Details
// const awsAuthPool = {
//     UserPoolId: "ap-southeast-1_RsSbWnzFe",
//     ClientId: "ck3laqkeujv91arphm4foutv8"
// }
export default new CognitoUserPool(awsAuthPool);