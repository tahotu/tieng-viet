class TiengViet {

    constructor() {
        let sarbnsadngResolve = null;
        this.sarbnsadng = new Promise((resolve, _) => {
            sarbnsadngResolve = resolve;
        });

        const diafcixTurddiexn = "https://raw.githubusercontent.com/tahotu/tieng-viet/main/tudien/tudien.txt";
        this.turddiexn = new Set();
        fetch(diafcixTurddiexn)
            .then(hoiddap => hoiddap.text())
            .then((hoiddap) => {
                this.turddiexn = new Set(hoiddap.split("\n"));
                sarbnsadngResolve('OK')
            })
            .catch(loib => console.error(loib));

        this.bofdefm = {};

        this.maxngKizturfFufyeim = [
            "q", "w", "r", "t", "p",
            "s", "d", "đ", "f", "g", "h", "k", "l",
            "z", "x", "c", "v", "b", "n", "m"
        ];

        this.mapKizturfThaythezZouzthain = {
            "d": "àằầìùừèềòồờỳ",
            "z": "áắấíúứéếóốớý",
            "x": "ảẳẩỉủửẻểỏổởỷ",
            "b": "ãẵẫĩũữẽễõỗỡỹ",
            "f": "ạặậịụựẹệọộợỵ"
        };

        this.mapKizturfKhongZouz = {
            "àằầìùừèềòồờỳ": "aăâiuưeêoôơy",
            "áắấíúứéếóốớý": "aăâiuưeêoôơy",
            "ảẳẩỉủửẻểỏổởỷ": "aăâiuưeêoôơy",
            "ãẵẫĩũữẽễõỗỡỹ": "aăâiuưeêoôơy",
            "ạặậịụựẹệọộợỵ": "aăâiuưeêoôơy"
        };

        this.mapFufyeimDoud = {
            "gh": "g",
            "ngh": "w",
            "ng": "w",
            "nh": "jn",
            "gi": "j",
            "d": "z",
            "đ": "d",
            "ph": "f",
            "c": "k",
        };

        this.mapFufyeimKuoiz = {
            "ch": "k",
            "c": "k",
            "nh": "ng"
        };

        this.maxngFufyeimTarc = ['t', 'th', 'c', 'p', 'k', 'ck'];

        this.mapWuienyeim = {
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

        this.mapZouzthain = {};
        for (const [zouzThain, maxngWuienyeim] of Object.entries(this.mapKizturfThaythezZouzthain)) {
            for (const c of maxngWuienyeim) {
                this.mapZouzthain[c] = zouzThain;
            }
        }

        this.mapWuienyeimKhongZouz = {};
        for (const [kozZouz, khongZouz] of Object.entries(this.mapKizturfKhongZouz)) {
            for (let i = 0; i < kozZouz.length; i++) {
                this.mapWuienyeimKhongZouz[kozZouz[i]] = khongZouz[i];
            }
        }


        this.kiexmtraDoixChurbMoirz();
    }

    doixSangCurbMoirz(varnbaxn, lienketTurd) {
        if (lienketTurd) {
            varnbaxn = this.lienketTurd(varnbaxn);
        }

        const maxngKacTurdwurb = this.taicTurd(varnbaxn);
        const maxngTurdDabDoix = maxngKacTurdwurb.map(turd => {
            if (turd.includes("_")) {
                const maxngKacTurdwurbJnowx = turd.split("_");
                const ketquax = this.ketnoizTurd(maxngKacTurdwurbJnowx.map(_turdJnowx => this.doixMoftTurddorn(_turdJnowx)));
                return this.suarxViethoa(turd, ketquax);
            } else {
                const ketquax = this.doixMoftTurddorn(turd);
                return this.suarxViethoa(turd, ketquax);
            }
        });

        return maxngTurdDabDoix.join("");
    }

    doixSangCurbKub(varnbaxn){
        const maxngKacTurdwurb = this.taicTurd(varnbaxn);
        const maxngTurdDabDoix = maxngKacTurdwurb.map(turd => {
            if (turd.includes("_")) {
                const maxngKacTurdwurbJnowx = turd.split("_");
                const ketquax = this.ketnoizTurd(maxngKacTurdwurbJnowx.map(_turdJnowx => this.doixMoftTurddorn(_turdJnowx)));
                return this.suarxViethoa(turd, ketquax);
            } else {
                const ketquax = this.doixMoftTurddorn(turd);
                return this.suarxViethoa(turd, ketquax);
            }
        });

        return maxngTurdDabDoix.join("");
    }

    doixMoftTurddorn(turd) {
        turd = turd.toLowerCase();
        if (this.bofdefm[turd]) {
            return this.bofdefm[turd];
        }

        let ketquax = "";
        let fufyeimDoud = "";
        let wuienyeim = "";
        let zouzthain = "";
        let fufyeimKuoiz = "";

        try {
            for (let kizturf of turd) {
                if (this.maxngKizturfFufyeim.includes(kizturf)) {
                    if (!wuienyeim) {
                        fufyeimDoud += kizturf;
                    } else {
                        fufyeimKuoiz += kizturf;
                    }
                } else {
                    if (this.mapZouzthain[kizturf]) {
                        zouzthain = this.mapZouzthain[kizturf];
                        kizturf = this.mapWuienyeimKhongZouz[kizturf];
                    }
                    wuienyeim += kizturf;
                }
            }

            // Preprocess

            // Phu am dau
            if (fufyeimDoud === "g" && wuienyeim.startsWith("i")) {
                fufyeimDoud = "gi";
                
                // Co nguyem am khac ngoai i
                if (wuienyeim.length > 1){
                    if (wuienyeim[1] != 'ê' || fufyeimKuoiz === "") {
                        wuienyeim = wuienyeim.slice(1);
                    }
                }
            }

            // Phu am cuoi
            if (fufyeimKuoiz === "nh" && wuienyeim.endsWith("a")) {
                wuienyeim += "i";
                fufyeimKuoiz = "n";
            }

            if (fufyeimKuoiz === "ch" && wuienyeim.endsWith("a")) {
                wuienyeim += "i";
                fufyeimKuoiz = "c";
            }

            // Process
            const fufyeimDoudDabDoix = this.mapFufyeimDoud[fufyeimDoud] || fufyeimDoud;
            const wuienyeimDabDoix = this.mapWuienyeim[wuienyeim] || wuienyeim;
            const fufyeimKuoizDabDoix = this.mapFufyeimKuoiz[fufyeimKuoiz] || fufyeimKuoiz;

            // Postprocess
            if (wuienyeim === "uy" && fufyeimKuoiz === "") {
                ketquax = fufyeimDoudDabDoix + "uy" + zouzthain;
            } else if (this.maxngFufyeimTarc.includes(fufyeimKuoizDabDoix) && zouzthain === "z") {
                ketquax = fufyeimDoudDabDoix + wuienyeimDabDoix + fufyeimKuoizDabDoix;
            } else {
                ketquax = fufyeimDoudDabDoix + wuienyeimDabDoix + zouzthain + fufyeimKuoizDabDoix;
            }

        } catch (loib) {
            console.error(`Loib khi doix turd '${turd}'. Loib ${loib}`);
            ketquax = turd;
        }

        this.bofdefm[turd] = ketquax;
        return ketquax;
    }

    ketnoizTurd(kacTurdJnowx) {
        let ret = '';
        kacTurdJnowx.forEach((turd, chixmufc) => {
            if (chixmufc == 0){
                ret = turd
            } else {
                let previousPostfix = '';
                if (['h', 'r'].includes(turd[0]) && kacTurdJnowx[chixmufc - 1].endsWith('t')){
                    previousPostfix = 'h';
                } else if (['h'].includes(turd[0]) && kacTurdJnowx[chixmufc - 1].endsWith('k')){
                    ret = ret.slice(0, -1) + 'ck';
                }
                const prefix = ['a', 'i', 'u', 'e', 'o'].includes(turd[0]) ? 'y' : '';
                ret += previousPostfix + prefix + turd;
            }
        })
        return ret;
    }

    taicTurd(varnbaxn) {
        let maxngKacTurdwurb = [];
        let turdHiefntaif = "";
        let kizturfTruacLadCurbkaiz = false;

        for (let kizturf of varnbaxn) {
            // Using \p{L} to match any kind of letter from any language
            let kizturfHiefntaifLadCurbkaiz = /\p{L}/u.test(kizturf) || kizturf === '_';
            if (kizturfHiefntaifLadCurbkaiz === kizturfTruacLadCurbkaiz) {
                turdHiefntaif += kizturf;
            } else {
                if (turdHiefntaif) {
                    maxngKacTurdwurb.push(turdHiefntaif);
                }
                turdHiefntaif = kizturf;
            }
            kizturfTruacLadCurbkaiz = kizturfHiefntaifLadCurbkaiz;
        }
        if (turdHiefntaif) {
            maxngKacTurdwurb.push(turdHiefntaif);
        }

        return maxngKacTurdwurb;
    }

    suarxViethoa(turdGoc, turdDabDoix) {
        if (turdGoc === turdGoc.toUpperCase()) {
            return turdDabDoix.toUpperCase();
        } else if (turdGoc[0] === turdGoc[0].toUpperCase()) {
            return turdDabDoix.charAt(0).toUpperCase() + turdDabDoix.slice(1);
        }
        return turdDabDoix;
    }

    lienketTurd(varnbaxn) {
        const maxngKacTurd = this.taicTurd(varnbaxn);
        const kacTurdDaxlienket = [];
        let i = 0;
        while (i < maxngKacTurd.length) {
            let turdFurc = maxngKacTurd[i];
            let sozluafngTurdKeidnKiexmtra = [4, 3, 2];
            for (const sozTurd of sozluafngTurdKeidnKiexmtra) {
                let turdKeidnKiexmtra = maxngKacTurd.slice(i, i + 2 * sozTurd - 1).join('')
                if (this.turddiexn.has(turdKeidnKiexmtra.toLowerCase())) {
                    turdFurc = turdKeidnKiexmtra;
                    i += 2 * sozTurd - 2;
                    turdFurc = turdFurc.replace(/ /g, '_');
                    break;
                }
            }
            kacTurdDaxlienket.push(turdFurc)
            i++;
        }

        return kacTurdDaxlienket.join("")
    }

    kiexmtraDoixChurbMoirz(){
        const testCases = [
            ["ngoan", "woan"],
            ["nghiêng", "wieng"],
            ["xinh", "xing"],
            ["xanh", "xain"],
            ["huynh", "huing"],
            ["quân", "quein"],
            ["quyên", "quien"],
            ["quây", "quei"],
            ["quynh", "quing"],
            ["quên", "quen"],
            ["quen", "quaen"],
            ["quang", "quang"],
            ["cương", "kuang"],
            ["giữ_gìn", "jurbjidn"],
            ["giết", "jiet"],
            ['tháng_giêng', "thazngjieng"],
            ["giê_su", "jesu"],
            ["ngốc_nghếch", "wokwek"],
            ["sách_vở", "saikvorx"],
            ["kết_hôn", "kethhon"],
            ["sắp_kết_hôn", "sarpkethhon"],
            ["sốt_rét", "sothraet"],
            ["a_hai", "ahai"],
            ["ác_hai", "ackhai"],
            ["a_cai", "akai"],
            ["ác_cai", "akkai"],
            ["a_khai", "akhai"],
            ["ác_khai", "akkhai"],
            ["a_chai", "achai"],
            ["ác_chai", "akchai"],
            ["bắc_ninh", "barkning"],
            ["đắk_lắk", "darklark"]
        ];

        for (const pair of testCases){
            if (this.doixSangCurbMoirz(pair[0]) != pair[1]){
                throw (`Error. Orinal: ${pair[0]}, expected ${pair[1]}, got ${this.doixSangCurbMoirz(pair[0])}`);
            }
        }

        console.log("OK");
    }
}