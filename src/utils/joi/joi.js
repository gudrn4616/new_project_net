import joi from 'joi';

class JoiUtils {
  async validateRegister(payload) {
    const emailRegExp = /^[0-9a-zA-Z]*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;

    const joiSchema = joi.object({
      email: joi.string().regex(emailRegExp).required().messages({
        'string.base': 'Email을 제대로 입력해주세요.',
        'any.required': 'Email을 입력해주세요.',
        'string.pattern.base': 'Email이 형식에 맞지 않습니다. (대소문자 + 숫자 조합)',
      }),
      id: joi.string().min(4).max(12).required().messages({
        'string.base': 'ID를 제대로 입력해주세요.',
        'string.min': `ID의 길이는 최소 {#limit}자 이상입니다.`,
        'string.max': `ID의 길이는 최대 {#limit}자 이하입니다.`,
        'any.required': 'ID를 입력해주세요.',
      }),
      password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required().messages({
        'string.base': '비밀번호를 제대로 입력해주세요.',
        'any.required': '비밀번호를 입력해주세요.',
      }),
      passwordConfirm: joi.any().valid(joi.ref('password')).required().messages({
        'any.only': '비밀번호와 일치하지 않습니다.',
        'any.required': '비밀번호 확인을 입력해주세요.',
      }),
    });

    const validation = await joiSchema.validateAsync(payload);

    return validation;
  }
}

export default joiUtils = new JoiUtils();