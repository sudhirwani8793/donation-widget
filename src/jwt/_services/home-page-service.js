import { handleResponse } from '../_helpers';
import { BASE_URL, CHARITY_ID } from "../../common/constant";
import { authContext } from "../../data/authContext";

export const homePageService = {
    getHomePageSettings,
    getDonationWidgetData,
    // handleResponse
};
async function getHomePageSettings(charityId) {
    const requestOptions = {
        method: 'POST',
        headers: {
            "givepls_token": authContext.IdToken,
            "Content-Type": "application/json",
        }
    };
    const url = BASE_URL + `/v1/Home/homePageConfiguration?charityId=${charityId}`;
    return fetch(url, requestOptions)
        .then(handleResponse)
        .then(result => {
            if (result.data !== null && result.data !== undefined && result.data.status === 1) {
                return result.data;
            } else {
                return false
            }
        }).catch(error => {
            return false;
        });
}

async function getDonationWidgetData(appealId) {
    const requestOptions = {
        method: 'POST',
        headers: {
            "givepls_token": authContext.IdToken,
            "Content-Type": "application/json",
        }
    };
    const url = BASE_URL + "/v1/Donation/donationWidget?charityId=" + CHARITY_ID + "&appealId=" + appealId;
    return fetch(url, requestOptions)
        .then(handleResponse)
        .then(result => {
            return result.data;
        }).catch(error => {
            return { status: 0 };
        });
}

