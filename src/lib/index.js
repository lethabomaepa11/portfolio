import CryptoJS from 'crypto-js';
// place files you want to import through the `$lib` alias in this folder.
const key = "5e50f405ace6cbdf17379f4b9f2b0c9f4144c5e380ea0b9298cb02ebd8ffe511";

export const encrypt = (text) => {
    return CryptoJS.AES.encrypt(text,key).toString();
}
export const decrypt = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText,key);
    return bytes.toString(CryptoJS.enc.Utf8);
}