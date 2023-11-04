import crypto from "crypto";

let id = null;

export const genId = () => {
  if (!id) {
    id = crypto.randomBytes(20);
    Buffer.from("-DT0001-").copy(id, 0);
  }
  return id;
};
