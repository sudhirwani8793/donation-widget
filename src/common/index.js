export const IMG_LOGO = '/logo-big.png'; //'/images/logo-590x164.png';
export const COMPANY_NAME_FULL = 'National Gallery Singapore';
export const COMPANY_NAME_SHORT = 'NGS';
export const CURRENCY_SYMBOL = '$';
export const USER_NAME_AWS_COGNITO = 'ngs';
export const PASSWORD_AWS_COGNITO = 'Admin@123';
// export const EMAIL_AWS_COGNITO = 'mayank.kumar@ideaqu.com'; //DEV Email
export const EMAIL_AWS_COGNITO = 'ngs@givepls.com'; // UAT email

export const CREDIT_CARD = {
    monthOptions: [
        { "value": "01", "label": "01" },
        { "value": "02", "label": "02" },
        { "value": "03", "label": "03" },
        { "value": "04", "label": "04" },
        { "value": "05", "label": "05" },
        { "value": "06", "label": "06" },
        { "value": "07", "label": "07" },
        { "value": "08", "label": "08" },
        { "value": "09", "label": "09" },
        { "value": "10", "label": "10" },
        { "value": "11", "label": "11" },
        { "value": "12", "label": "12" }
    ],
    cardImages: {
        AmericanExpress: '/images/cards/american-express-195x125.png',
        DefaultCard: '/images/cards/default-195x125.png',
        DinersClub: '/images/cards/diners-club-195x125.png',
        JCB: '/images/cards/jcb-195x125.png',
        Mastercard: '/images/cards/master-card-195x125.png',
        UnionPay: '/images/cards/union-pay-195x125.png',
        Visa: '/images/cards/visa-195x125.png',
        MasterCard: '/images/cards/master-card-195x125.png',
    },

    getCardExpiryYearList() {
        var yearList = [];
        var year = (new Date()).getFullYear();
        for (let i = 0; i < 21; i++) {
            const obj = {
                value: year + i,
                label: year + i
            }
            yearList.push(obj)
        }
        return yearList;
    },
}


export const DEFAULT_IMAGE_PATH = "/images/campaigns/default-image/default-image.png";

export const GET_PARENT = (e, nodename, classname) => {
    let ele = e;
    //console.log(ele, nodename, classname);
    try {
        do {
            //console.log('node', ele.nodeName);
            if (nodename && ele.nodeName === nodename || classname && ele.classList.contains(classname)) {
                return ele;
            } else {
                ele = ele.parentNode;
            }
        } while (ele.parentNode)
    } catch (ex) {
        //throw ex;
    }
}

export const TEXT_TRIM = (text, characters) => {
    try {
        if (text.length > characters) {
            return ((text.substr(0, characters)).trim() + '...');
        } else {
            return text;
        }
    } catch (ex) {
        return text;
    }
}

export const commaSeperatedAmount = (sign, value) => {
    if (value === undefined || value === null)
        return ''
    let val = value.toString();
    let str = [];
    let decimalval = val.split('.')

    if (decimalval.length === 2) {
        val = decimalval[0];
    }

    if (val && val.length > 3) {
        for (let ind = val.length - 1; ind >= 0; ind--) {
            if (!(ind % 3) && ind !== 0) {
                str.push(val[val.length - 1 - ind]);
                str.push(',');
            } else {
                str.push(val[val.length - 1 - ind]);
            }
        }
        val = str.join('');
    }

    if (decimalval.length === 2) {
        return sign + val + '.' + decimalval[1];
    } else {
        return sign + val;
    }
}

