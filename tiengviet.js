class TiengViet {

    constructor() {

        const dictUrl = "https://raw.githubusercontent.com/tahotu/tieng-viet/main/tudien/tudien.txt";
        this.wordSet = new Set();
        fetch(dictUrl)
            .then(response => response.text())
            .then((response) => {
                this.wordSet = new Set(response.split("\n"))
                init();
            })
            .catch(err => console.log(err));

        this.cache = {};

        this.kiTuPhuAm = [
            "q", "w", "r", "t", "p",
            "s", "d", "đ", "f", "g", "h", "k", "l",
            "z", "x", "c", "v", "b", "n", "m"
        ];

        this.dauThanhData = {
            "d": "àằầìùừèềòồờỳ",
            "z": "áắấíúứéếóốớý",
            "x": "ảẳẩỉủửẻểỏổởỷ",
            "b": "ãẵẫĩũữẽễõỗỡỹ",
            "f": "ạặậịụựẹệọộợỵ"
        };

        this.khongDauthanhData = {
            "àằầìùừèềòồờỳ": "aăâiuưeêoôơy",
            "áắấíúứéếóốớý": "aăâiuưeêoôơy",
            "ảẳẩỉủửẻểỏổởỷ": "aăâiuưeêoôơy",
            "ãẵẫĩũữẽễõỗỡỹ": "aăâiuưeêoôơy",
            "ạặậịụựẹệọộợỵ": "aăâiuưeêoôơy"
        };

        this.phuAmDauMap = {
            "gh": "g",
            "ngh": "w",
            "ng": "w",
            "nh": "jn",
            "gi": "j",
            "d": "z",
            "đ": "d",
            "ch": "c",
            "ph": "f",
            "c": "k",
        };

        this.phuAmCuoiMap = {
            "ch": "c",
            "nh": "ng"
        };

        this.phuAmCuoiTac = ['t', 'th', 'c', 'p'];

        this.nguyenAmMap = {
            "ă": "ar",
            "â": "ei",
            "e": "ae",
            "ê": "e",
            "y": "i",
            "o": "ow",
            "ô": "o",
            "ơ": "or",
            "ư": "ur",
            "âu": "ou",
            "ây": "ei",
            "êu": "eu",
            "yê": "ie",
            "iê": "ie",
            "oă": "oar",
            "oi": "oiw",
            "ôi": "oi",
            "ơi": "oir",
            "ôô": "oow",
            "ue": "uae",
            "uâ": "uei",
            "ưa": "uar",
            "uê": "ue",
            "ưi": "uir",
            "uô": "uo",
            "uơ": "uor",
            "ươ": "ua",
            "ưu": "uu",
            "uy": "ui",
            "iêu": "ieu",
            "yêu": "ieu",
            "uây": "uei",
            "uôi": "uoi",
            "ươi": "uai",
            "ươu": "uou",
            "uya": "uia",
            "uyê": "uie",
            "uyu": "uiu"
        };

        this.dauThanhMap = {};
        for (const [dauThanh, mangNguyenAm] of Object.entries(this.dauThanhData)) {
            for (const c of mangNguyenAm) {
                this.dauThanhMap[c] = dauThanh;
            }
        }

        this.khongDauthanhMap = {};
        for (const [coDau, khongDau] of Object.entries(this.khongDauthanhData)) {
            for (let i = 0; i < coDau.length; i++) {
                this.khongDauthanhMap[coDau[i]] = khongDau[i];
            }
        }
    }

    convert(sentence, linkWord) {
        if (linkWord) {
            sentence = this.linkWords(sentence);
        }
        const words = this.splitWords(sentence);
        const convertedWords = words.map(word => {
            if (word.includes("_")) {
                const subWords = word.split("_");
                const ret = this.connectWord(subWords.map(subWord => this.convertWord(subWord)));
                return this.applyCase(word, ret);
            } else {
                const ret = this.convertWord(word);
                return this.applyCase(word, ret);
            }
        });

        return convertedWords.join("");
    }

    convertWord(word) {
        word = word.toLowerCase();
        if (this.cache[word]) {
            return this.cache[word];
        }

        let ret = "";
        let phuAmDau = "";
        let nguyenAm = "";
        let dauThanh = "";
        let phuAmCuoi = "";

        try {
            for (let char of word) {
                if (this.kiTuPhuAm.includes(char)) {
                    if (!nguyenAm) {
                        phuAmDau += char;
                    } else {
                        phuAmCuoi += char;
                    }
                } else {
                    if (this.dauThanhMap[char]) {
                        dauThanh = this.dauThanhMap[char];
                        char = this.khongDauthanhMap[char];
                    }
                    nguyenAm += char;
                }
            }

            // Preprocess

            // Phu am dau
            if (phuAmDau === "g" && nguyenAm.startsWith("i")) {
                phuAmDau = "gi";
                if (nguyenAm.length > 1 && nguyenAm[1] != 'ê') {
                    nguyenAm = nguyenAm.slice(1);
                }
            }

            // Phu am cuoi
            if (phuAmCuoi === "nh" && nguyenAm.endsWith("a")) {
                nguyenAm += "i";
                phuAmCuoi = "n";
            }

            if (phuAmCuoi === "ch" && nguyenAm.endsWith("a")) {
                nguyenAm += "i";
                phuAmCuoi = "c";
            }

            // Process
            const convertedPhuAmDau = this.phuAmDauMap[phuAmDau] || phuAmDau;
            const convertedNguyenAm = this.nguyenAmMap[nguyenAm] || nguyenAm;
            const convertedPhuAmCuoi = this.phuAmCuoiMap[phuAmCuoi] || phuAmCuoi;

            // Postprocess
            if (nguyenAm === "uy" && phuAmCuoi === "") {
                ret = convertedPhuAmDau + "uy" + dauThanh;
            } else if (this.phuAmCuoiTac.includes(convertedPhuAmCuoi) && dauThanh === "z") {
                ret = convertedPhuAmDau + convertedNguyenAm + convertedPhuAmCuoi;
            } else {
                ret = convertedPhuAmDau + convertedNguyenAm + dauThanh + convertedPhuAmCuoi;
            }
        } catch (exc) {
            console.error(`Error when converting '${word}'. Error ${exc}`);
            ret = word;
        }

        this.cache[word] = ret;
        return ret;
    }

    connectWord(subWords) {
        let ret = subWords[0];
        for (const word of subWords.slice(1)) {
            const prefix1 = ['h', 'r'].includes(word[0]) && subWords[0].endsWith('t') ? 'h' : '';
            const prefix2 = ['a', 'i', 'u', 'e', 'o'].includes(word[0]) ? 'y' : '';
            ret += prefix1 + prefix2 + word;
        }
        return ret;
    }

    splitWords(text) {
        let words = [];
        let currentWord = "";
        let previousIsAlphabet = false;

        for (let c of text) {
            // Using \p{L} to match any kind of letter from any language
            let currentIsAlphabet = /\p{L}/u.test(c) || c === '_';
            if (currentIsAlphabet === previousIsAlphabet) {
                currentWord += c;
            } else {
                if (currentWord) {
                    words.push(currentWord);
                }
                currentWord = c;
            }
            previousIsAlphabet = currentIsAlphabet;
        }
        if (currentWord) {
            words.push(currentWord);
        }

        return words;
    }

    applyCase(original, converted) {
        if (original === original.toUpperCase()) {
            return converted.toUpperCase();
        } else if (original[0] === original[0].toUpperCase()) {
            return converted.charAt(0).toUpperCase() + converted.slice(1);
        }
        return converted;
    }

    linkWords(text) {
        const words = this.splitWords(text);
        const linkedWords = [];
        let i = 0;
        while (i < words.length) {
            let linkWord = words[i];
            let checkWordNumbers = [4, 3, 2];
            for (const wordNum of checkWordNumbers) {
                let checkWord = words.slice(i, i + 2 * wordNum - 1).join('')
                if (this.wordSet.has(checkWord.toLowerCase())) {
                    linkWord = checkWord;
                    i += 2 * wordNum - 2;
                    linkWord = linkWord.replace(/ /g, '_');
                    break;
                }
            }
            linkedWords.push(linkWord)
            i++;
        }

        return linkedWords.join("")
    }
}