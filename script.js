// script.js — somente trechos relevantes para a sua pergunta

// ====== MOCK estático (mantido) ======
const MOCK_DATA = [
    { id: "lidocaina",  nome: "Lidocaína"  },
    { id: "bupivacaina",nome: "Bupivacaína"},
    { id: "mepivacaina",nome: "Mepivacaína"},
    { id: "articaina",  nome: "Articaína"  },
];

// ====== Bindings de UI (já existentes no seu HTML) ======
const select = document.getElementById("anestheticSelect");
const pesoBlock = document.getElementById("pesoBlock");
const concBlock = document.getElementById("concBlock");
const pesoInput = document.getElementById("pesoInput");
const concInput = document.getElementById("concInput");
const calcBtn = document.getElementById("calcBtn");
const resultBlock = document.getElementById("resultBlock");
const bulasBlock = document.getElementById("bulasBlock");
const resultBody = document.getElementById("resultBody");
const bulasBody = document.getElementById("bulasBody");

// Popular select com MOCK fixo
(function populate(){
    for(const item of MOCK_DATA){
        const opt = document.createElement("option");
        opt.value = item.id;
        opt.textContent = item.nome;
        select.appendChild(opt);
    }
})();

// ====== Utilitários genéricos ======
const toNumber = (v) => Number(String(v).replace(",", "."));
const round = (n, p=2) => Number.isFinite(n) ? Number(n.toFixed(p)) : NaN;
const percentToMgPerMl = (percent) => percent * 10;

// ====== Tipo de retorno padronizado ======
// { doseIdealMg:number, doseMaxMg:number, volIdealMl:number, volMaxMl:number, precaucoes:string[], bulas:Array<{nome,url}> }

function calcLidocaina({ pesoKg, concPct }){
    const mgMl = percentToMgPerMl(concPct);
    const idealMgKg = 3;      // MOCK
    const maxMgKg   = 7;      // MOCK
    const maxAbsMg  = 500;    // MOCK

    const doseIdealMg = idealMgKg * pesoKg;
    const doseMaxMg   = Math.min(maxMgKg * pesoKg, maxAbsMg);

    return {
        doseIdealMg,
        doseMaxMg,
        volIdealMl: mgMl ? doseIdealMg / mgMl : NaN,
        volMaxMl:   mgMl ? doseMaxMg   / mgMl : NaN,
        precaucoes: [
            "Pegar da bula precauções e efeitos colaterais.",
        ],
        bulas: [
            { nome: "EMS", url: "https://hypofarma.com.br/wp-content/uploads/2023/08/Medicamento_Bula_Paciente-Lidocaina-SV-10mg-20mL-e-20mg-5mL.pdf" },
            { nome: "Neoquimica", url: "https://www.neoquimica.com.br/nossas-marcas/bula/lidogel" },
        ],
    };
}

function calcBupivacaina({ pesoKg, concPct }){
    const mgMl = percentToMgPerMl(concPct);
    const idealMgKg = 1.25;   // MOCK
    const maxMgKg   = 2.5;    // MOCK
    const maxAbsMg  = 175;    // MOCK

    const doseIdealMg = idealMgKg * pesoKg;
    const doseMaxMg   = Math.min(maxMgKg * pesoKg, maxAbsMg);

    return {
        doseIdealMg,
        doseMaxMg,
        volIdealMl: mgMl ? doseIdealMg / mgMl : NaN,
        volMaxMl:   mgMl ? doseMaxMg   / mgMl : NaN,
        precaucoes: [
            "Pegar da bula precauções e efeitos colaterais.",
        ],
        bulas: [
            { nome: "Teuto", url: "https://hypofarma.com.br/wp-content/uploads/2023/08/Medicamento_Bula_Paciente-Lidocaina-SV-10mg-20mL-e-20mg-5mL.pdf" },
            { nome: "Teste", url: "https://www.neoquimica.com.br/nossas-marcas/bula/lidogel" },
        ],
    };
}

function calcMepivacaina({ pesoKg, concPct }){
    const mgMl = percentToMgPerMl(concPct);
    const idealMgKg = 3;      // MOCK
    const maxMgKg   = 6.6;    // MOCK
    const maxAbsMg  = 400;    // MOCK

    const doseIdealMg = idealMgKg * pesoKg;
    const doseMaxMg   = Math.min(maxMgKg * pesoKg, maxAbsMg);

    return {
        doseIdealMg,
        doseMaxMg,
        volIdealMl: mgMl ? doseIdealMg / mgMl : NaN,
        volMaxMl:   mgMl ? doseMaxMg   / mgMl : NaN,
        precaucoes: [
            "Pegar da bula precauções e efeitos colaterais.",
        ],
        bulas: [
            { nome: "EMS", url: "https://hypofarma.com.br/wp-content/uploads/2023/08/Medicamento_Bula_Paciente-Lidocaina-SV-10mg-20mL-e-20mg-5mL.pdf" },
            { nome: "Neoquimica", url: "https://www.neoquimica.com.br/nossas-marcas/bula/lidogel" },
        ],
    };
}

function calcArticaina({ pesoKg, concPct }){
    const mgMl = percentToMgPerMl(concPct);
    const idealMgKg = 3.5;    // MOCK
    const maxMgKg   = 7;      // MOCK
    const maxAbsMg  = 500;    // MOCK

    const doseIdealMg = idealMgKg * pesoKg;
    const doseMaxMg   = Math.min(maxMgKg * pesoKg, maxAbsMg);

    return {
        doseIdealMg,
        doseMaxMg,
        volIdealMl: mgMl ? doseIdealMg / mgMl : NaN,
        volMaxMl:   mgMl ? doseMaxMg   / mgMl : NaN,
        precaucoes: [
            "Pegar da bula precauções e efeitos colaterais.",
        ],
        bulas: [
            { nome: "EMS", url: "https://hypofarma.com.br/wp-content/uploads/2023/08/Medicamento_Bula_Paciente-Lidocaina-SV-10mg-20mL-e-20mg-5mL.pdf" },
            { nome: "Neoquimica", url: "https://www.neoquimica.com.br/nossas-marcas/bula/lidogel" },
        ],
    };
}

// ====== Roteador genérico por anestésico ======
const calculators = {
    "lidocaina":    calcLidocaina,
    "bupivacaina":  calcBupivacaina,
    "mepivacaina":  calcMepivacaina,
    "articaina":    calcArticaina,
};

// Função de orquestração: captura dados da UI e delega ao cálculo correto
function calcularGenerico(){
    const anestId = select.value;
    const pesoKg  = toNumber(pesoInput.value);
    const concPct = toNumber(concInput.value);

    if(!anestId)   throw new Error("Anestésico não selecionado.");
    if(!(pesoKg>0))throw new Error("Peso inválido.");
    if(!(concPct>0))throw new Error("Concentração inválida.");

    const fn = calculators[anestId];
    if(typeof fn !== "function") throw new Error("Cálculo não implementado para: " + anestId);

    // Executa a função específica, retornando o payload padronizado
    return fn({ pesoKg, concPct });
}

// ====== Fluxo de UX progressiva (igual ao seu) ======
select.addEventListener("change", () => {
    if(select.value){
        pesoBlock.classList.remove("hidden");
        pesoInput.focus();
    }else{
        pesoBlock.classList.add("hidden");
        concBlock.classList.add("hidden");
        calcBtn.disabled = true;
        resultBlock.classList.add("hidden");
        bulasBlock.classList.add("hidden");
    }
});

pesoInput.addEventListener("input", () => {
    const ok = toNumber(pesoInput.value) > 0;
    concBlock.classList.toggle("hidden", !ok);
    calcBtn.disabled = true;
});
concInput.addEventListener("input", () => {
    const ok = toNumber(concInput.value) > 0;
    calcBtn.disabled = !ok;
});

// ====== Handler do botão: usa o retorno padronizado para renderizar ======
calcBtn.addEventListener("click", () => {
    try{
        const r = calcularGenerico();

        // tabela de resultados
        resultBody.innerHTML = "";
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>
        <div><strong>${round(r.doseIdealMg)} mg</strong> (${round(r.volIdealMl)} mL)</div>
      </td>
      <td>
        <div><strong>${round(r.doseMaxMg)} mg</strong> (${round(r.volMaxMl)} mL)</div>
      </td>
      <td>
        <ul class="muted">
          ${r.precaucoes.map(p=>`<li>${p}</li>`).join("")}
        </ul>
      </td>
    `;
        resultBody.appendChild(tr);
        resultBlock.classList.remove("hidden");

        // tabela de bulas
        bulasBody.innerHTML = "";
        for(const b of r.bulas){
            const trb = document.createElement("tr");
            trb.innerHTML = `
        <td>${b.nome}</td>
        <td>${b.tipo}</td>
        <td><a href="${b.url}" target="_blank" rel="noopener">Abrir</a></td>
      `;
            bulasBody.appendChild(trb);
        }
        bulasBlock.classList.remove("hidden");
    }catch(err){
        alert(err.message || String(err));
    }
});
