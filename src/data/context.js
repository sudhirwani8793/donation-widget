//import { createContext } from 'react';

export const PaymentContext = {
    secondaryUserData : {
    },
    cause: {
        donationAmount: 0.00,
        frequency: 'one time',
        partPayment: '',
        entity: 'individual',
        causes: "The Gallery's Vision",         // selected cause name(s)
        id: '',                             // selected campaign id(s)
        default: {
            donationAmount: 0.00,          // default donation amount
            frequency: 'one time',           // one time | recurrent
            partPayment: '',                // monthly | quarterly | annually
            entity: 'individual',           // individual | corporate
            causes: "The Gallery's Vision",     // default cause name
            id: '',                         // default campaign name(s)
            minAmount: 5.00,                // minimum donation amount
            maxAmount: 999999.00,           // maximum donation amount
        }
    },
    paymentDetails : {
        transactionNo : '',
        cardTokenId : '',
        cardId : '',
        fingerprint : '',
        isUserRegistered : '',
        isPatronMember: ''
    },
    donationMethod: 'cause',      
}