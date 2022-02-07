export const getSrcFromBase64 = (contentType: string, base64: string) => `data:${contentType};base64,${base64}`;

const Converter = { getSrcFromBase64 };
export default Converter;
