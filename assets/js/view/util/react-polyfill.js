/**
 * Include this script in your HTML to use JSX compiled code without React.
 * Code from https: //stackoverflow.com/questions/30430982/can-i-use-jsx-without-react-to-inline-html-in-script
 */
export default class ReactPolyfill {
  static createElement(tagName, attrs, ...children) {
    const elem = Object.assign(document.createElement(tagName), attrs)
    for (const child of children) {
      if (Array.isArray(child)) elem.append(...child)
      else elem.append(child)
    }
    return elem
  }
};