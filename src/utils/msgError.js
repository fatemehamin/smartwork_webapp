const msgError = {
  email: (email) => {
    const regexEmail =
      /^(([^<>()[\].,;:@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,}\s*)$/i;
    return regexEmail.test(email) ? "" : "errorEmailFormat";
  },
  password: (password) => {
    const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d#@$!%*?&_-]{8,}$/;
    return regexPassword.test(password) ? "" : "errorFormatPassword";
  },
  rePassword: (rePassword, password) => {
    return password === rePassword ? "" : "errorRepeatPassword";
  },
};

export default msgError;
