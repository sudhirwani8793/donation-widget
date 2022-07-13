// import { authenticationService } from '../_services';

export function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401 || response.status === 302 || response.status === 504) {
                // authenticationService.refreshToken().then(response => {
                if (response) {
                    return [];
                    // window.location.reload(true);
                } else {
                    // authenticationService.logout();
                    return [];
                }
                // })

            }
            if ([403, 500, 502].indexOf(response.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                // authenticationService.refreshToken();
                // authenticationService.logout();
                window.location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}