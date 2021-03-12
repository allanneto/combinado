export default function validateEmail(email) {
  const emailValidate = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gi;

  return emailValidate.test(email);
}
