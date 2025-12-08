import crypto from "crypto";

function generateCode(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  let code = "";

  for (let i = 0; i < 6; i++) {
    const randomBytes = crypto.randomBytes(1);
    const randomIndex = randomBytes[0] % charactersLength;
    code += characters[randomIndex];
  }

  return code;
}

export default generateCode;
