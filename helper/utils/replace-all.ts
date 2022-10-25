export function replaceAllPolyfill() {
  String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, 'gm'), s2);
  };
}
