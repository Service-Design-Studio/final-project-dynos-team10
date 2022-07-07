import { create, get } from '@github/webauthn-json';

export const register = async (challenge, rp, user, pubKeyCredParams, registeredCredentials=[]) => {
    // what about attestation?
    const newRegistration = await create({
        publicKey: {
            challenge,
            rp,
            user,
            pubKeyCredParams,
            excludeCredentials: registeredCredentials,
            authenticatorSelection: {
                authenticatorAttachment: 'platform', // play around with these values
                userVerification: 'required',
                requireResidentKey: false
            },
            extensions: {
                credProps: true
            }
        }
    })
    console.log({newRegistration});
    return newRegistration;
}

export const authenticate = async (challenge, registeredCredentials) => {
    return await get({
        publicKey: {
            challenge,
            allowCredentials: registeredCredentials,
            userVerification: 'required'
        }
    })
}