import QRCode from "qrcode";

export const generateQrCode = async (payload) => {
  return QRCode.toDataURL(JSON.stringify(payload));
};
