// app.js

// ========================= MOCK DATA =========================
// ATENÇÃO: substitua este bloco por uma fonte real (JSON, API ou tabela)
// com as regras oficiais de cada medicamento antes de uso clínico.
// Estrutura sugerida por item:
// {
//   id: "lidocaina",
//   nome: "Lidocaína",
//   maxMgKg: 7,                 // mg/kg com vasoconstrictor (exemplo MOCK)
//   maxAbsolutoMg: 500,         // teto absoluto em mg (MOCK)
//   idealMgKg: 3,               // alvo 'ideal' sugerido (MOCK)
//   precaucoes: ["cardiopatia", "hepática", "..."], // lista textual
// }
const MOCK_DATA = [
    {
        id: "lidocaina",
        nome: "Lidocaína",
        maxMgKg: 7,
        maxAbsolutoMg: 500,
        idealMgKg: 3,
        precaucoes: [
            "Ajustar em disfunção hepática (metabolismo hepático) [mock].",
            "Monitorar sinais de toxicidade sistêmica (zumbido, parestesias, convulsões) [mock].",
            "Cautela com antiarrítmicos classe I [mock].",
        ],
    },
    {
        id: "bupivacaina",
        nome: "Bupivacaína",
        maxMgKg: 2.5,
        maxAbsolutoMg: 175,
        idealMgKg: 1.25,
        precaucoes: [
            "Maior cardiotoxicidade relativa; evitar injeção intravascular [mock].",
            "Cautela em gestantes e cardiopatas [mock].",
            "Onset lento; duração longa [mock].",
        ],
    },
    {
        id: "mepivacaina",
        nome: "Mepivacaína",
        maxMgKg: 6.6,
        maxAbsolutoMg: 400,
        idealMgKg: 3,
        precaucoes: [
            "Menor vasodilatação; pode vir sem vasoconstrictor [mock].",
            "Cautela em neonatos/ lactentes [mock].",
        ],
    },
    {
        id: "articaina",
        nome: "Articaína",
        maxMgKg: 7,
        maxAbsolutoMg: 500,
        idealMgKg: 3.5,
        precaucoes: [
            "Metabolismo também por esterases plasmáticas; meia-vida curta [mock].",
            "Evitar bloqueios de nervo mandibular em crianças pequenas [mock].",
        ],
    },
];

// ========================= UI BINDINGS =========================
const select = document.getElementById("anestheticSelect");
const inputsBlock = document.getElementById("inputsBlock");
const pesoInput = document.getElementById("pesoInput");
const concInput = document.getElementById("concInput");
const calcBtn = document.getElementById("calcBtn");
const resultBlock = document.getElementById("resultBlock");
const doseMaxText = document.getElementById("doseMaxText");
const doseIdealText = document.getElementById("doseIdealText");
const precList = document.getElementById("precList");

// Preenche select
function populateSelect(items){
    for(const item of items){
        const opt = document.createElement("option");
        opt.value = item.id;
        opt.textContent = item.nome;
        select.appendChild(opt);
    }
}
populateSelect(MOCK_DATA);

// Helpers
const toNumber = (v) => Number(String(v).replace(",", "."));
const round = (n, p=2) => Number.isFinite(n) ? Number(n.toFixed(p)) : NaN;

// Converte % para mg/mL (1% = 10 mg/mL)
function percentToMgPerMl(percent){
    return percent * 10;
}

// Regras de negócio MOCK:
// - doseMáxima mg = min(maxMgKg * pesoKg, maxAbsolutoMg)
// - doseIdeal mg = idealMgKg * pesoKg
// - volume em mL = dose mg / (mg/mL pela concentração informada)
function calcular(anest, pesoKg, percent){
    const mgPerMl = percentToMgPerMl(percent);
    const doseMaxMgCap = Math.min(anest.maxMgKg * pesoKg, anest.maxAbsolutoMg);
    const doseIdealMg = anest.idealMgKg * pesoKg;

    return {
        mgPerMl,
        doseMaxMg: doseMaxMgCap,
        doseIdealMg,
        volMaxMl: mgPerMl ? doseMaxMgCap / mgPerMl : NaN,
        volIdealMl: mgPerMl ? doseIdealMg / mgPerMl : NaN,
    };
}

// Eventos
select.addEventListener("change", () => {
    const chosen = MOCK_DATA.find(x => x.id === select.value);
    if(chosen){
        inputsBlock.classList.remove("hidden");
        pesoInput.focus();
    }else{
        inputsBlock.classList.add("hidden");
        resultBlock.classList.add("hidden");
    }
});

calcBtn.addEventListener("click", () => {
    const anest = MOCK_DATA.find(x => x.id === select.value);
    const pesoKg = toNumber(pesoInput.value);
    const conc = toNumber(concInput.value);

    // validações simples
    if(!anest){ alert("Escolha um anestésico."); return; }
    if(!(pesoKg > 0)){ alert("Informe um peso válido (kg)."); return; }
    if(!(conc > 0)){ alert("Informe a concentração em % (ex.: 1, 0.5, 2)."); return; }

    const r = calcular(anest, pesoKg, conc);

    doseMaxText.innerHTML =
        `${round(r.doseMaxMg)} mg • aprox. ${isFinite(r.volMaxMl)? round(r.volMaxMl): "--"} mL @ ${conc}%`;

    doseIdealText.innerHTML =
        `${round(r.doseIdealMg)} mg • aprox. ${isFinite(r.volIdealMl)? round(r.volIdealMl): "--"} mL @ ${conc}%`;

    // precauções
    precList.innerHTML = "";
    for(const p of anest.precaucoes){
        const li = document.createElement("li");
        li.textContent = p;
        precList.appendChild(li);
    }

    resultBlock.classList.remove("hidden");
});

// ========================= PONTOS DE EXTENSÃO =========================
// 1) Trocar MOCK_DATA por um fetch("anestesicos.json") e manter a mesma estrutura.
// 2) Implementar regras específicas por fármaco (p.ex., tetos com/sem vasoconstrictor).
// 3) Adicionar cálculo de mg/cartucho e limites por vasoconstrictor, se necessário.
// 4) Internacionalização simples lendo labels de um JSON.
