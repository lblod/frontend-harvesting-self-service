export function isValidUrl(urlAsString) {
  if (!urlAsString) {
    return false;
  }

  const urlRegex =
    /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?$/;
  return String(urlAsString).match(urlRegex) !== null;
}
