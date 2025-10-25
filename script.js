const MOCK_DATA = [
    {
        id: "lidocaina",
        nome: "Lidocaína",
        maxMgKg: 7,
        maxAbsolutoMg: 500,
        idealMgKg: 3,
        precaucoes: [
            "Ajustar em disfunção hepática [mock].",
            "Monitorar sinais de toxicidade sistêmica [mock].",
        ],
        bulas: [
            { nome: "Lidocaína 1% (Genérico)", tipo: "Profissional", url: "#" },
            { nome: "Xylocaína", tipo: "Paciente", url: "#" },
        ],
    },
    {
        id: "bupivacaina",
        nome: "Bupivacaína",
        maxMgKg: 2.5,
        maxAbsolutoMg: 175,
        idealMgKg: 1.25,
        precaucoes: [
            "Maior cardiotoxicidade relativa [mock].",
            "Evitar injeção intravascular [mock].",
        ],
        bulas: [
            { nome: "Bupivacaína 0,5%", tipo: "Profissional", url: "#" },
            { nome: "Marca A", tipo: "Paciente", url: "#" },
        ],
    },
    {
        id: "mepivacaina",
        nome: "Mepivacaína",
        maxMgKg: 6.6,
        maxAbsolutoMg: 400,
        idealMgKg: 3,
        precaucoes: [
            "Pode ser sem vasoconstrictor [mock].",
            "Cautela em neonatos [mock].",
        ],
        bulas: [
            { nome: "Mepivacaína 2%", tipo: "Profissional", url: "#" },
        ],
    },
    {
        id: "articaina",
        nome: "Articaína",
        maxMgKg: 7,
        maxAbsolutoMg: 500,
        idealMgKg: 3.5,
        precaucoes: [
            "Metabolismo também por esterases [mock].",
            "Cautela em crianças pequenas [mock].",
        ],
        bulas: [
            { nome: "Articaína + Epinefrina", tipo: "Profissional", url: "#" },
            { nome: "Marca B", tipo: "Paciente", url: "#" },
        ],
    },
];

// ========================= ELEMENTOS =========================
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

// ========================= POPULAR SELECT =========================
(function populate(){
    for(const item of MOCK_DATA){
        const opt = document.createElement("option");
        opt.value = item.id;
        opt.textContent = item.nome;
        select.appendChild(opt);
    }
})();

// ========================= HELPERS =========================
const toNumber = (v) => Number(String(v).replace(",", "."));
const round = (n, p=2) => Number.isFinite(n) ? Number(n.toFixed(p)) : NaN;
const percentToMgPerMl = (percent) => percent * 10;

// ========================= REGRAS MOCK =========================
function calcular(anest, pesoKg, percent){
    const mgPerMl = percentToMgPerMl(percent);
    const doseMaxMgCap = Math.min(anest.maxMgKg * pesoKg, anest.maxAbsolutoMg);
    const doseIdealMg = anest.idealMgKg * pesoKg;

    return {
        doseMaxMg: doseMaxMgCap,
        doseIdealMg,
        volMaxMl: mgPerMl ? doseMaxMgCap / mgPerMl : NaN,
        volIdealMl: mgPerMl ? doseIdealMg / mgPerMl : NaN,
    };
}

// ========================= UX PROGRESSIVA =========================
select.addEventListener("change", () => {
    // Mostrar peso somente após escolher anestésico
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
    const pesoOk = toNumber(pesoInput.value) > 0;
    // Mostrar concentração somente após peso válido
    if(pesoOk){
        concBlock.classList.remove("hidden");
    }else{
        concBlock.classList.add("hidden");
        calcBtn.disabled = true;
    }
});

concInput.addEventListener("input", () => {
    const concOk = toNumber(concInput.value) > 0;
    calcBtn.disabled = !concOk;
});

// ========================= CÁLCULO / RENDER =========================
calcBtn.addEventListener("click", () => {
    const anest = MOCK_DATA.find(x => x.id === select.value);
    const pesoKg = toNumber(pesoInput.value);
    const conc = toNumber(concInput.value);

    if(!anest || !(pesoKg>0) || !(conc>0)) return;

    const r = calcular(anest, pesoKg, conc);

    // preencher tabela de resultados
    resultBody.innerHTML = "";
    const tr = document.createElement("tr");
    const idealTd = document.createElement("td");
    const maxTd = document.createElement("td");
    const obsTd = document.createElement("td");

    idealTd.innerHTML = `
    <div><strong>${round(r.doseIdealMg)} mg</strong> (${round(r.volIdealMl)} mL @ ${conc}%)</div>
    <span class="badge muted">alvo mock</span>
  `;
    maxTd.innerHTML = `
    <div><strong>${round(r.doseMaxMg)} mg</strong> (${round(r.volMaxMl)} mL @ ${conc}%)</div>
    <span class="badge muted">teto mock</span>
  `;
    obsTd.innerHTML = `
    <ul class="muted">
      ${anest.precaucoes.map(p=>`<li>${p}</li>`).join("")}
    </ul>
  `;

    tr.appendChild(idealTd);
    tr.appendChild(maxTd);
    tr.appendChild(obsTd);
    resultBody.appendChild(tr);

    // preencher tabela de bulas
    bulasBody.innerHTML = "";
    for(const b of anest.bulas){
        const trb = document.createElement("tr");
        trb.innerHTML = `
      <td>${b.nome}</td>
      <td>${b.tipo}</td>
      <td><a href="${b.url}" target="_blank" rel="noopener">Abrir</a></td>
    `;
        bulasBody.appendChild(trb);
    }

    resultBlock.classList.remove("hidden");
    bulasBlock.classList.remove("hidden");
});

// ========================= PONTOS DE TROCA (dados reais) =========================
// - Substituir MOCK_DATA por fetch("anestesicos.json") mantendo a mesma estrutura.
// - Ajustar regras em calcular() por fármaco (sem/com vasoconstrictor, limites por cartucho, etc.).
// - Popular 'bulas' com URLs reais.
// - Validar limites pediátricos/geriátricos conforme protocolo institucional.
