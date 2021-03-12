export function validEmail(email) {
  if (email === '') {
    return false;
  }
  let EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return !!EMAIL_REGEXP.test(email);
}

export function validCNPJ(cnpj) {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj === '') {
    return false;
  }
  if (cnpj.length !== 14) {
    return false;
  }
  // Elimina CNPJs invalidos conhecidos
  if (
    cnpj === '00000000000000' ||
    cnpj === '11111111111111' ||
    cnpj === '22222222222222' ||
    cnpj === '33333333333333' ||
    cnpj === '44444444444444' ||
    cnpj === '55555555555555' ||
    cnpj === '66666666666666' ||
    cnpj === '77777777777777' ||
    cnpj === '88888888888888' ||
    cnpj === '99999999999999'
  ) {
    return false;
  }
  // Valida DVs
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (`${resultado}` !== digitos.charAt(0)) {
    return false;
  }
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (`${resultado}` !== digitos.charAt(1)) {
    return false;
  }
  return true;
}

export function validCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf === '') {
    return false;
  }
  if (cpf.length !== 11) {
    return false;
  }

  // Elimina CPFs invalidos conhecidos
  if (
    cpf === '00000000000' ||
    cpf === '11111111111' ||
    cpf === '22222222222' ||
    cpf === '33333333333' ||
    cpf === '44444444444' ||
    cpf === '55555555555' ||
    cpf === '66666666666' ||
    cpf === '77777777777' ||
    cpf === '88888888888' ||
    cpf === '99999999999'
  ) {
    return false;
  }

  let numeros = cpf.substring(0, 9);
  const digitos = cpf.substring(9);
  let soma = 0;

  for (let i = 10; i > 1; i--) {
    soma += numeros.charAt(10 - i) * i;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (`${resultado}` !== digitos.charAt(0)) {
    return false;
  }
  numeros = cpf.substring(0, 10);
  soma = 0;
  for (let i = 11; i > 1; i--) {
    soma += numeros.charAt(11 - i) * i;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (`${resultado}` !== digitos.charAt(1)) {
    return false;
  }
  return true;
}
