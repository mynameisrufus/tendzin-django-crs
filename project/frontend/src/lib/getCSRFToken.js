const getCSRFToken = () => {
  const value = `; ${document.cookie}`;
  const parts = value.split("; csrftoken=");
  if (parts.length === 2) {
    return decodeURIComponent(
      parts
        .pop()
        .split(";")
        .shift()
    );
  }
  throw new Error("could not get CSRF token from cookie");
};

export default getCSRFToken;
