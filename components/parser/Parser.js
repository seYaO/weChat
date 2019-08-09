//Parser.js
const Tokenizer = require("./Tokenizer.js");
const DomHandler = require("./DomHandler.js");
const Discode = require('./Discode')
const hljs = require('./highlight/index')
const trustAttrs = {
    align: true,
    alt: true,
    author: true,
    autoplay: true,
    class: true,
    color: true,
    colspan: true,
    controls: true,
    "data-src": true,
    dir: true,
    face: true,
    height: true,
    href: true,
    id: true,
    ignore: true,
    loop: true,
    muted: true,
    name: true,
    poster: true,
    rowspan: true,
    span: true,
    src: true,
    start: true,
    style: true,
    type: true,
    width: true,
};
const voidTag = {
    area: true,
    base: true,
    basefont: true,
    br: true,
    col: true,
    circle: true,
    command: true,
    ellipse: true,
    embed: true,
    frame: true,
    hr: true,
    img: true,
    input: true,
    isindex: true,
    keygen: true,
    line: true,
    link: true,
    meta: true,
    param: true,
    path: true,
    polygon: true,
    polyline: true,
    rect: true,
    source: true,
    stop: true,
    track: true,
    use: true,
    wbr: true
};

function Parser(cbs, callback) {
    this._cbs = cbs;
    this._callback = callback;
    this._tagname = "";
    this._attribname = "";
    this._attribvalue = "";
    this._attribs = null;
    this._stack = [];
    this._tokenizer = new Tokenizer(this);
}
Parser.prototype.ontext = function (data) {
    this._cbs.ontext(data);
};
Parser.prototype.onopentagname = function (name) {
    name = name.toLowerCase();
    this._tagname = name;
    this._attribs = {
        style: ''
    };
    if (!voidTag[name]) this._stack.push(name);
};
Parser.prototype.onopentagend = function () {
    if (this._attribs) {
        this._cbs.onopentag(this._tagname, this._attribs);
        this._attribs = null;
    }
    if (voidTag[this._tagname]) this._cbs.onclosetag(this._tagname);
    this._tagname = "";
};
Parser.prototype.onclosetag = function (name) {
    name = name.toLowerCase();
    if (this._stack.length && !voidTag[name]) {
        var pos = this._stack.lastIndexOf(name);
        if (pos !== -1) {
            pos = this._stack.length - pos;
            while (pos--) this._cbs.onclosetag(this._stack.pop());
        } else if (name === "p") {
            this.onopentagname(name);
            this._closeCurrentTag();
        }
    } else if (name === "br" || name === "hr" || name === "p") {
        this.onopentagname(name);
        this._closeCurrentTag();
    }
};
Parser.prototype._closeCurrentTag = function () {
    let name = this._tagname;
    this.onopentagend();
    if (this._stack[this._stack.length - 1] === name) {
        this._cbs.onclosetag(name);
        this._stack.pop();
    }
};
Parser.prototype.onattribend = function () {
    this._attribvalue = this._attribvalue.replace(/&quot;/g, '"');
    if (this._attribs && trustAttrs[this._attribname]) {
        this._attribs[this._attribname] = this._attribvalue;
    }
    this._attribname = "";
    this._attribvalue = "";
};
Parser.prototype.onend = function () {
    for (
        var i = this._stack.length; i > 0; this._cbs.onclosetag(this._stack[--i])
    );
    this._callback({
        'nodes': this._cbs.nodes,
        'title': this._cbs.title,
        'imgList': this._cbs.imgList
    });
};
Parser.prototype.write = function (chunk) {
    // console.log('html2nodes write >>>>>>>>>')
    this._tokenizer.parse(chunk);
    // console.log('html2nodes write >>>>>>>>>', this._cbs)

};

function html2nodes(data, tagStyle) {
    // debugger
    return new Promise(function (resolve, reject) {
        try {
            let style = '';
            data = data.replace(/<style.*?>([\s\S]*?)<\/style>/gi, function (...args) {
                style += args[1];
                return '';
            });
            data = data.replace(/<pre.*?>([\s\S]*?)<\/pre>/gi, function (...args) {

                let reg = /<code.*?(language-[a-zA-Z0-9]*).*?>([\s\S]*?)<\/code>/gi, _html = args[1], _class = ''

                if (args[1].match(reg)) {
                    _html = _html.replace(reg, function (..._args) {
                        _class = _args[1]
                        // ,['html', 'js', 'css', 'php']
                        const result = hljs.highlightAuto(_args[2])
                        console.log(result)
                        return result.value
                    })
                    _html = `<code>${_html}</code>`
                } else {
                    const result = hljs.highlightAuto(_args[1])
                    _html = result.value
                }
                _html = `<div class='${_class}' id='code'><pre class='${_class}'>${_html}</pre></div>`
                return _html;
            });
            // data = Discode.strDiscode(data);
            let handler = new DomHandler(style, tagStyle);
            console.log(JSON.stringify(data))

            new Parser(handler, (res) => {
                // debugger
                // console.log('html2nodes handler >>>>>>>>>', handler, res)
                return resolve(res);
            }).write(data);
        } catch (err) {
            return reject(err);
        }
    })
}
module.exports = html2nodes;