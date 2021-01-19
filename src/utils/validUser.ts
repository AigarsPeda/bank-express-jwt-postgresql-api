export const validSignupUser = (
  email: string,
  password: string,
  name: string,
  surname: string
) => {
  const validEmail =
    typeof email === "string" && email.trim() !== "" && email.includes("@");
  const validPassword =
    typeof password === "string" && password.trim() !== "" && email.length > 5;
  const validUsername =
    typeof name === "string" && name.trim() !== "" && name.length > 3;
  const validSurname =
    typeof surname === "string" && surname.trim() !== "" && surname.length > 3;

  return validPassword && validUsername && validSurname && validEmail;
};

export const validateEmail = (email: string) => {
  const validEmail =
    typeof email === "string" &&
    email.trim() !== "" &&
    email.includes("@") &&
    email.length > 5;

  return validEmail;
};

export const validLoginUser = (password: string) => {
  const validPassword =
    typeof password === "string" &&
    password.trim() !== "" &&
    password.length > 5;

  return validPassword;
};
