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

  return validEmail && validPassword && validUsername && validSurname;
};

export const validLoginUser = (email: string, password: string) => {
  const validEmail =
    typeof email === "string" && email.trim() !== "" && email.includes("@");
  const validPassword =
    typeof password === "string" && password.trim() !== "" && email.length > 5;

  return validEmail && validPassword;
};
