/* eslint-disable prettier/prettier */
import * as Joi from 'joi';

//sirve para validar las variables de entorno
export const JoiValidationSchema = Joi.object({
  MONGODB: Joi.string().required(),
  PORT: Joi.number().default(3002),
  DEFAULT_LIMIT: Joi.number().default(7),
});
