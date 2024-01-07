import CryptoJS from "crypto-js";

// Function to encrypt and save data
export const saveSecureData = (key, data) => {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    "secretKey"
  ).toString();
  localStorage.setItem(key, encryptedData);
};

// Function to decrypt and retrieve data
export const getSecureData = (key) => {
  const encryptedData = localStorage.getItem(key);
  if (encryptedData) {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, "secretKey");
    const decryptedData = JSON.parse(
      decryptedBytes.toString(CryptoJS.enc.Utf8)
    );
    return decryptedData;
  }
  return null;
};
