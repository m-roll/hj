export function getInputValueFromForm(form, name) {
  console.log(form.serializeArray(), name);
  return form.serializeArray().find(keyValue => keyValue.name == name)["value"];
}