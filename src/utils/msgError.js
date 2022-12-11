const msgError = {
  email: (email) => {
    const regexEmail =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return regexEmail.test(email) ? "" : "Invalid email format.";
  },
  password: (password) => {
    const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regexPassword.test(password)
      ? ""
      : "Minimum 8 characters, at least one letter and one number.";
  },
  rePassword: (rePassword, password) => {
    return password === rePassword
      ? ""
      : "Repeating the password is incorrect.";
  },
};

export default msgError;
