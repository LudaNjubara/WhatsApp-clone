const getRecipientEmail = (user, participantsArray) => {
  if (participantsArray?.length === 1) return "";

  const recipientsArray = participantsArray?.filter((participant) => participant !== user.email);
  return recipientsArray;
};

const truncate = (string, length = 25) => {
  return string?.length > length ? string?.substring(0, length) + "..." : string;
};

const getCSSVariableValue = (CSSVariable) => {
  const root = document.documentElement;
  const value = getComputedStyle(root).getPropertyValue(CSSVariable);
  return value;
};

const generateRecipientColor = () => {
  // create random vibrant color

  const generateRandomColor = () => {
    return Math.floor(Math.random() * 135 + 120);
  };

  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const r = generateRandomColor();
  const g = generateRandomColor();
  const b = generateRandomColor();

  return rgbToHex(r, g, b);
};

export { getRecipientEmail, truncate, getCSSVariableValue, generateRecipientColor };
