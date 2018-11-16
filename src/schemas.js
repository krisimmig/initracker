import Joi from "joi";

export const CharacterSchema = {
  name: Joi.string().required(),
  level: Joi.number().required(),
  health: Joi.number().required(),
  characterClass: Joi.string()
    .valid("Ranger", "Wizard", "Warlock")
    .required(),
  id: Joi.string().required()
};

export function validate(schema, object) {
  return Joi.validate(object, schema, {
    presence: "required"
  });
}
