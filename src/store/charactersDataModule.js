export default {
  namespaced: true,
  firestorePath: "characters",
  firestoreRefType: "collection",
  moduleName: "charactersData",
  statePropName: "characters",
  sync: {
    where: [["userId", "==", "{userId}"]]
  }
};
