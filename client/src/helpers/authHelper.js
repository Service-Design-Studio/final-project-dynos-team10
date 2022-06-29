import { $axios } from './axiosHelper';

export const registerCredential = async () => {
    const opts = {
        attestation: 'none',
        authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
            requireResidentKey: false
        }
    };

    const { data: options } = await $axios.post('/auth/registerRequest', opts);
    options.user.id = atob(options.user.id);
    options.challenge = atob(options.challenge);
}