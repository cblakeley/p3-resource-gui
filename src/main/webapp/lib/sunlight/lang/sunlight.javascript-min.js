(function(a, b) {
    if (a === b || a.registerLanguage === b) {
        throw "Include sunlight.js before including language files";
    }
    a.registerLanguage("javascript", {
        keywords: ["break", "case", "catch", "continue", "default", "delete", "do", "else", "finally", "for", "function", "if", "in", "instanceof", "new", "return", "switch", "this", "throw", "try", "typeof", "var", "void", "while", "with", "true", "false", "null"],
        customTokens: {
            reservedWord: {
                values: ["abstract", "boolean", "byte", "char", "class", "const", "debugger", "double", "enum", "export", "extends", "final", "float", "goto", "implements", "import", "int", "interface", "long", "native", "package", "private", "protected", "public", "short", "static", "super", "synchronized", "throws", "transient", "volatile"],
                boundary: "\\b"
            },
            globalVariable: {
                values: ["NaN", "Infinity", "undefined"],
                boundary: "\\b"
            },
            globalFunction: {
                values: ["encodeURI", "encodeURIComponent", "decodeURI", "decodeURIComponent", "parseInt", "parseFloat", "isNaN", "isFinite", "eval"],
                boundary: "\\b"
            },
            globalObject: {
                values: ["Math", "JSON", "XMLHttpRequest", "XDomainRequest", "ActiveXObject", "Boolean", "Date", "Array", "Image", "Function", "Object", "Number", "RegExp", "String"],
                boundary: "\\b"
            }
        },
        scopes: {
            string: [
                ['"', '"', a.util.escapeSequences.concat(['\\"'])],
                ["'", "'", a.util.escapeSequences.concat(["\\'", "\\\\"])]
            ],
            comment: [
                ["//", "\n", null, true],
                ["/*", "*/"]
            ]
        },
        customParseRules: [function(c) {
            var j = c.reader.peek(),
                i, e = "/",
                k = c.reader.getLine(),
                d = c.reader.getColumn(),
                h = false,
                g, f;
            if (c.reader.current() !== "/" || j === "/" || j === "*") {
                return null;
            }
            i = function() {
                var m = c.token(c.count() - 1),
                    l = null;
                if (c.defaultData.text !== "") {
                    l = c.createToken("default", c.defaultData.text);
                }
                if (!l) {
                    l = m;
                }
                if (l === b) {
                    return true;
                }
                if (l.name === "default" && l.value.indexOf("\n") > -1) {
                    return true;
                }
                if (a.util.contains(["keyword", "ident", "number"], m.name)) {
                    return false;
                }
                if (m.name === "punctuation" && !a.util.contains(["(", "{", "[", ",", ";"], m.value)) {
                    return false;
                }
                return true;
            }();
            if (!i) {
                return null;
            }
            while (c.reader.peek() !== c.reader.EOF) {
                g = c.reader.peek(2);
                if (g === "\\/" || g === "\\\\") {
                    e += c.reader.read(2);
                    continue;
                }
                if (g === "\\[" || g === "\\]") {
                    e += c.reader.read(2);
                    continue;
                } else {
                    if (f === "[") {
                        h = true;
                    } else {
                        if (f === "]") {
                            h = false;
                        }
                    }
                }
                e += (f = c.reader.read());
                if (f === "/" && !h) {
                    break;
                }
            }
            while (c.reader.peek() !== c.reader.EOF) {
                if (!/[A-Za-z]/.test(c.reader.peek())) {
                    break;
                }
                e += c.reader.read();
            }
            return c.createToken("regexLiteral", e, k, d);
        }],
        identFirstLetter: /[$A-Za-z_]/,
        identAfterFirstLetter: /[\w\$]/,
        namedIdentRules: {
            follows: [
                [{
                    token: "keyword",
                    values: ["function"]
                }, a.util.whitespace]
            ]
        },
        operators: ["++", "+=", "+", "--", "-=", "-", "*=", "*", "/=", "/", "%=", "%", "&&", "||", "|=", "|", "&=", "&", "^=", "^", ">>>=", ">>>", ">>=", ">>", "<<=", "<<", "<=", "<", ">=", ">", "===", "==", "!==", "!=", "!", "~", "?", ":", ".", "="]
    });
}(this["Sunlight"]));