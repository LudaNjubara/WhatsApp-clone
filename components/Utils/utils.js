const getRecipientEmail = (user, participantsArray) => {
  if (participantsArray?.length === 1) return "";

  const recipientEmail = participantsArray?.find((participant) => participant !== user.email);
  return recipientEmail;
};

const truncate = (string, length = 25) => {
  return string?.length > length ? string?.substring(0, length) + "..." : string;
};

export { getRecipientEmail, truncate };
