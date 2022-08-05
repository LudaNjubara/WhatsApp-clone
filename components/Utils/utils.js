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

export { getRecipientEmail, truncate, getCSSVariableValue };
