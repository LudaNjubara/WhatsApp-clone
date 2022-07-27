const getRecipientEmail = (user, participantsArray) => {
  if (participantsArray?.length === 1) return "";

  const recipientEmail = participantsArray?.find((participant) => participant !== user.email);
  return recipientEmail;
};

export { getRecipientEmail };
