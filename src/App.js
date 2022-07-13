import React, { lazy, Suspense } from "react";
import { PaymentContext } from './data/context';
import { authContext } from './data/authContext';
import { ContextProvider } from "./context";
import { homePageService } from "./jwt/_services/home-page-service";
// import './assets/css/style.css';
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { EMAIL_AWS_COGNITO, PASSWORD_AWS_COGNITO, USER_NAME_AWS_COGNITO, } from "./common";
import authAwsPool from "./aws-pool/auth-aws";
import NGS from "./views";
// const NGS = lazy(() => import('./views/'));

class DonationComponent extends React.Component {
  // static contextType = PageContext;
  constructor(props) {
    super(props);
    this.state = {
      url: window.location.host,
      isDataLoaded: false,
      settingsData: [],
      isOnline: window.navigator.onLine,
      isAuthorised: false,
      blockSettings: [],
      bannerDetails: [],
      is_banner: false,
      is_donation_widget: false,
      donationWidgetData: []
    }

    // setTimeout(() => { AuthenticateUser() }, 2000)
    this.getHomePageData = this.getHomePageData.bind(this);
    this.getAuthorisedHomePage = this.getAuthorisedHomePage.bind(this);
    this.updateConnection = this.updateConnection.bind(this);
  }

  getHomePageData() {
    homePageService.getHomePageSettings(this.props.data.charityId)
      .then(response => {
        if (response) {
          response.PaymentContext = PaymentContext;
          this.setState({
            settingsData: response,
            isDataLoaded: true
          });
        } else {
          this.setState({
            isOnline: false,
            isDataLoading: true,
            settingsData: []
          })
        }
      });
  }

  //isLoadHomePage allow to load homepage data boolian flag
  getAuthorisedHomePage(isLoadHomePage) {
    const user = new CognitoUser({
      Username: USER_NAME_AWS_COGNITO,
      Pool: authAwsPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: USER_NAME_AWS_COGNITO,
      Password: PASSWORD_AWS_COGNITO,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (data) => {
        // localStorage.setItem("accessToken", data.)AccessToken, IdToken, RefreshToken, TokenType=Bearer
        authContext.AccessToken = data.accessToken.jwtToken
        authContext.IdToken = data.idToken.jwtToken
        authContext.RefreshToken = data.refreshToken.token
        // authContext.TokenType = data.refreshToken.token 
        if (isLoadHomePage) {
          this.getHomePageData();
        } else {
          this.setState({
            isDataLoaded: true
          })
        }
        this.setState({
          isAuthorised: true
        })
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
  }

  updateConnection(status) {
    this.setState({
      isOnline: status
    })
  }

  componentDidMount() {
    this.getAuthorisedHomePage(true)
  }

  render() {
    return (
      <div>
        {
          this.state.isDataLoaded && this.state.isAuthorised ?
            <ContextProvider value={this.state.settingsData}>
              {
                <NGS value={this.state.settingsData} />
              }
            </ContextProvider>

            : <div className="site-loader"></div>
        }
      </div>
    )
  }
}

export default DonationComponent;
