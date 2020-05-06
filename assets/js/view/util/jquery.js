export function getInputValueFromForm(form, name) {
  return form.serializeArray().find(keyValue => keyValue.name == name)["value"];
}