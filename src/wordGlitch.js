const glitchyTitle = {
    init() {
        this._root = document.querySelector("#glitchyTitle");
        this._titles = this._root.querySelectorAll(".glitchyTitle-title");
        this._frame = this._frame.bind(this);
        this.setTexts([
            "GOT TALENT",
            "60T TA1EN7",
            "goT tALeNt",
            "פOʇ ʇ∀˥ƎNʇ",
        ]);
    },
    on() {
        if (!this._frameId) {
            this._frame();
        }
    },
    off() {
        clearTimeout(this._frameId);
        this._textContent(this._text);
        delete this._frameId;
    },
    setTexts([text, ...alt]) {
        this._text = text;
        this._textAlt = alt;
    },

    _text: "",
    _textAlt: [],
    _rand(n) {
        return Math.random() * n | 0;
    },
    _textContent(txt) {
        this._titles.forEach(el => el.textContent = txt);
    },
    _frame() {
        let txt = Array.from(this._text);

        for (let i = 0; i < 6; ++i) {
            const ind = this._rand(this._text.length);

            txt[ind] = this._textAlt[this._rand(this._textAlt.length)][ind];
        }
        this._textContent(txt.join(""));
        this._root.classList.add("glitchyTitle-glitched");
        setTimeout(() => {
            this._textContent(this._text);
            this._root.classList.remove("glitchyTitle-glitched");
        }, 50 + Math.random() * 200);
        this._frameId = setTimeout(this._frame, 250 + Math.random() * 500);
    },
};

glitchyTitle.init();
glitchyTitle.on();