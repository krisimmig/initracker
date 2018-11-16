import { CharacterSchema, validate } from "../schemas";

export default {
  namespaced: true,
  firestorePath: "characters",
  firestoreRefType: "collection",
  moduleName: "charactersData",
  statePropName: "characters",
  sync: {
    where: [["userId", "==", "{userId}"]]
  },

  actions: {
    update({ dispatch }, characterData) {
      const { error, value } = validate(CharacterSchema, characterData);
      if (error) {
        console.error("Error validating data", error);
      } else {
        dispatch("set", value);
      }
    }
  }
};
