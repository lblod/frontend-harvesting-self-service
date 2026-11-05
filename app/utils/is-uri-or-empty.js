// A scheme followed by characters that are allowed in a SPARQL IRI reference.
const URI_REGEX = /^[a-z][a-z0-9+.-]*:[^\s<>"{}|\\^`]+$/i;

export default function isUriOrEmpty(value) {
  return !value || URI_REGEX.test(value);
}
