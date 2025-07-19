//
// --- DATA SIMULATION ---
// This section simulates the data fetched from your Google Sheets.
// Replace the contents of 'groundUnits' and 'airUnits' with your actual data.
//

const groundUnits = [
    { Faction: "IMA", Unit_Name: "SAFS Fire team", Type: "SUIT", Figures_in_Unit: 6, Wounds_per_Figure: 1, Base_Cost: 32, Rarity: "Common", Extra_Rules: "A, FD", Parent_Unit: null },
    { Faction: "IMA", Unit_Name: "Fireball SG", Type: "SUIT", Figures_in_Unit: 6, Wounds_per_Figure: 1, Base_Cost: 32, Rarity: "Rare", Parent_Unit: null },
    { Faction: "IMA", Unit_Name: "AFS Mk I", Type: "SUIT", Figures_in_Unit: 6, Wounds_per_Figure: 1, Base_Cost: 22, Rarity: "Common", Extra_Rules: "C", Parent_Unit: null },
    { Faction: "IMA", Unit_Name: "AFS Mk II", Type: "SUIT", Wounds_per_Figure: 1, Figures_in_Unit: 6, Base_Cost: 24, Rarity: "Common", Parent_Unit: null },
    { Faction: "IMA", Unit_Name: "AFS Support unit", Type: "SUIT", Figures_in_Unit: 2, Wounds_per_Figure: 1, Base_Cost: 8, Rarity: "Rare", Parent_Unit: "AFS Mk I" },
    { Faction: "SDR", Unit_Name: "Gustav", Type: "SUIT", Figures_in_Unit: 6, Wounds_per_Figure: 1, Base_Cost: 32, Rarity: "Common", Parent_Unit: null },
    { Faction: "SDR", Unit_Name: "Krote", Type: "VEHICLE", Figures_in_Unit: 1, Wounds_per_Figure: 8, Base_Cost: 40, Rarity: "Common", Extra_Rules: "Q, D", Parent_Unit: null },
    { Faction: "SDR", Unit_Name: "Melusine", Type: "SUIT", Figures_in_Unit: 6, Wounds_per_Figure: 1, Base_Cost: 31, Rarity: "Common", Extra_Rules: "H", Parent_Unit: null },
    { Faction: "SDR", Unit_Name: "PzKpf 3000 Leopard", Type: "VEHICLE", Wounds_per_Figure: 8, Figures_in_Unit: 1, Base_Cost: 63, Rarity: "Rare", Parent_Unit: null },
    { Faction: "SDR", Unit_Name: "Gustav W/ Support unit", Type: "SUIT", Wounds_per_Figure: 1, Figures_in_Unit: 2, Base_Cost: 11, Rarity: "Rare", Parent_Unit: "Gustav" },
    { Faction: "Non-Specific", Unit_Name: "Infantry", Type: "INFANTRY", Figures_in_Unit: 10, Wounds_per_Figure: 1, Base_Cost: 15, Rarity: "Common", Extra_Rules: "i", Parent_Unit: null},
    { Faction: "Non-Specific", Unit_Name: "Light AFV", Type: "VEHICLE", Figures_in_Unit: 1, Wounds_per_Figure: 8, Base_Cost: 45, Rarity: "Common", Parent_Unit: null},
    { Faction: "Non-Specific", Unit_Name: "Hero - 'Red Bear'", Type: "SUIT", Figures_in_Unit: 1, Wounds_per_Figure: 1, Base_Cost: 45, Rarity: "Hero", Parent_Unit: null},

];

const airUnits = [
    { Faction: "IMA", Unit_Name: "Falke", Type: "AIR", Figures_in_Unit: 1, Wounds_per_Figure: 6, Base_Cost: 57, Rarity: "Common", Parent_Unit: null },
    { Faction: "IMA", Unit_Name: "Falke II", Type: "AIR", Figures_in_Unit: 1, Wounds_per_Figure: 9, Base_Cost: 57, Rarity: "Rare", Parent_Unit: null },
    { Faction: "SDR", Unit_Name: "PK40 - Fledermaus", Type: "AIR", Figures_in_Unit: 1, Wounds_per_Figure: 6, Base_Cost: 34, Rarity: "Common", Parent_Unit: null },
    { Faction: "SDR", Unit_Name: "PK50 - Hummel", Type: "AIR", Figures_in_Unit: 1, Wounds_per_Figure: 5, Base_Cost: 40, Rarity: "Common", Parent_Unit: null },
    { Faction: "Non-Specific", Unit_Name: "Drone Scout aircraft", Type: "AIR", Figures_in_Unit: 1, Wounds_per_Figure: 2, Base_Cost: 15, Rarity: "Common", Extra_Rules: "D", Parent_Unit: null },
    { Faction: "Non-Specific", Unit_Name: "Light Troop transport", Type: "AIR", Figures_in_Unit: 1, Wounds_per_Figure: 8, Base_Cost: 27, Rarity: "Common", Extra_Rules: "T(6), HP-1", Parent_Unit: null },
];

// --- APPLICATION STATE ---
let armyList = [];
let gameState = {
    gameSize: 600,
    faction: "IMA",
};

// --- DOM ELEMENTS ---
const elements = {
    gameSizeSelector: document.getElementById('game-size'),
    factionSelector: document.getElementById('faction'),
    unitSearch: document.getElementById('unit-search'),
    availableUnitsList: document.getElementById('available-units-list'),
    yourArmyList: document.getElementById('your-army-list'),
    totalPoints: document.getElementById('total-points'),
    totalUnits: document.getElementById('total-units'),
    airPoints: document.getElementById('air-points'),
    validationBox: document.getElementById('validation-box'),
    exportPdfButton: document.getElementById('export-pdf'),
};

// --- RENDER FUNCTIONS ---

// Renders the list of available units based on faction and search query
function renderAvailableUnits() {
    const searchQuery = elements.unitSearch.value.toLowerCase();
    elements.availableUnitsList.innerHTML = '';
    
    const renderList = (title, units) => {
        const filteredUnits = units.filter(unit => unit.Unit_Name.toLowerCase().includes(searchQuery));
        if (filteredUnits.length === 0) return;

        const heading = document.createElement('h3');
        heading.textContent = title;
        elements.availableUnitsList.appendChild(heading);

        filteredUnits.forEach(unit => {
            const card = document.createElement('div');
            card.className = 'unit-card';
            card.innerHTML = `
                <div>
                    <h3>${unit.Unit_Name}</h3>
                    <div class="unit-meta">${unit.Rarity} ${unit.Type}</div>
                </div>
                <div class="unit-actions">
                    <span class="unit-cost">${unit.Base_Cost} pts</span>
                    <button class="add-btn" data-unit-name="${unit.Unit_Name}">Add</button>
                </div>
            `;
            elements.availableUnitsList.appendChild(card);
        });
    };

    renderList(
        `${gameState.faction} Ground Units`,
        groundUnits.filter(u => u.Faction === gameState.faction)
    );
    renderList(
        `Non-Specific Ground Units`,
        groundUnits.filter(u => u.Faction === 'Non-Specific')
    );
    renderList(
        `${gameState.faction} Air Units`,
        airUnits.filter(u => u.Faction === gameState.faction)
    );
     renderList(
        `Non-Specific Air Units`,
        airUnits.filter(u => u.Faction === 'Non-Specific')
    );
}

// Renders the user's currently selected army list
function renderArmyList() {
    if (armyList.length === 0) {
        elements.yourArmyList.innerHTML = `<p class="empty-message">Your army is empty. Add units from the left panel.</p>`;
        return;
    }

    elements.yourArmyList.innerHTML = '';
    armyList.forEach((unit, index) => {
        const card = document.createElement('div');
        card.className = 'unit-card army-unit-card';
        card.innerHTML = `
            <div class="army-unit-header">
                <div>
                    <h3>${unit.name}</h3>
                    <div class="unit-meta">${unit.rarity} ${unit.type}</div>
                </div>
                <div class="unit-actions">
                    <span class="unit-cost">${unit.currentCost} pts</span>
                    <button class="remove-btn" data-index="${index}">Remove</button>
                </div>
            </div>
            <div class="unit-options" data-index="${index}">
                <label for="training-${index}">Training:</label>
                <select id="training-${index}" class="training-select">
                    <option value="Green" ${unit.training === 'Green' ? 'selected' : ''}>Green (-10)</option>
                    <option value="Regular" ${unit.training === 'Regular' ? 'selected' : ''}>Regular (+0)</option>
                    <option value="Elite" ${unit.training === 'Elite' ? 'selected' : ''}>Elite (+15)</option>
                </select>
                
                ${unit.type === 'SUIT' || unit.type === 'INFANTRY' ? `
                <label>
                    <input type="checkbox" class="panzerfaust-check" ${unit.hasPanzerfaust ? 'checked' : ''}> Add Panzerfausts (+${unit.figures})
                </label>
                ` : ''}

                <label>
                    <input type="checkbox" class="commander-check" ${unit.isCommander ? 'checked' : ''}> Commander (+20)
                </label>
            </div>
        `;
        elements.yourArmyList.appendChild(card);
    });
}

// Re-renders the entire UI
function rerender() {
    renderAvailableUnits();
    renderArmyList();
    validateArmy();
}


// --- CORE LOGIC ---

// Calculates the current cost of a unit based on its upgrades
function calculateUnitCost(unit) {
    let cost = unit.baseCost;
    [cite_start]// Commander upgrade cost [cite: 709]
    if (unit.isCommander) {
        cost += 20;
    }
    [cite_start]// Training level costs [cite: 697, 702, 706]
    if (unit.training === 'Green') {
        cost -= 10;
        if (cost < 5) cost = 5; [cite_start]// Green units cannot cost less than 5 points [cite: 698]
    } else if (unit.training === 'Elite') {
        cost += 15;
    }
    [cite_start]// Panzerfaust cost [cite: 716]
    if (unit.hasPanzerfaust) {
        cost += unit.figures;
    }
    return cost;
}

// Adds a unit to the army list
function addUnit(unitName) {
    const unitData = groundUnits.find(u => u.Unit_Name === unitName) || airUnits.find(u => u.Unit_Name === unitName);
    if (!unitData) return;

    const newUnit = {
        id: Date.now(), // Unique ID for the instance
        name: unitData.Unit_Name,
        baseCost: unitData.Base_Cost,
        faction: unitData.Faction,
        type: unitData.Type,
        rarity: unitData.Rarity,
        figures: unitData.Figures_in_Unit,
        parentUnit: unitData.Parent_Unit,
        [cite_start]training: 'Regular', // Default training level [cite: 693]
        isCommander: false,
        hasPanzerfaust: false,
    };
    newUnit.currentCost = calculateUnitCost(newUnit);
    armyList.push(newUnit);
    rerender();
}

// Removes a unit from the army list
function removeUnit(index) {
    armyList.splice(index, 1);
    rerender();
}

// Updates a unit's options (training, upgrades)
function updateUnit(index, key, value) {
    const unit = armyList[index];
    if (!unit) return;

    unit[key] = value;
    unit.currentCost = calculateUnitCost(unit);
    rerender();
}


// --- VALIDATION ENGINE ---
function validateArmy() {
    let errors = [];
    const armySize = parseInt(gameState.gameSize);
    const slotsPer600 = armySize / 600;

    // Calculate army stats
    const totalPoints = armyList.reduce((sum, u) => sum + u.currentCost, 0);
    const totalAirPoints = armyList.filter(u => u.type === 'AIR').reduce((sum, u) => sum + u.currentCost, 0);
    const numUnits = armyList.length;
    const numSuitUnits = armyList.filter(u => u.type === 'SUIT' && u.parentUnit === null).length;
    const numCommanders = armyList.filter(u => u.isCommander).length;
    const numGreenUnits = armyList.filter(u => u.training === 'Green').length;
    const numEliteUnits = armyList.filter(u => u.training === 'Elite').length;
    const numHeroes = armyList.filter(u => u.rarity === 'Hero').length;

    const groundUnitsInArmy = armyList.filter(u => u.type !== 'AIR');
    const airUnitsInArmy = armyList.filter(u => u.type === 'AIR');
    const numCommonGround = groundUnitsInArmy.filter(u => u.rarity === 'Common' && !u.parentUnit).length;
    const numRareGround = groundUnitsInArmy.filter(u => u.rarity === 'Rare').length;
    const numCommonAir = airUnitsInArmy.filter(u => u.rarity === 'Common' && !u.parentUnit).length;
    const numRareAir = airUnitsInArmy.filter(u => u.rarity === 'Rare').length;

    const numFactionSuits = armyList.filter(u => u.type === 'SUIT' && u.faction === gameState.faction).length;
    const numNonSpecificUnits = armyList.filter(u => u.faction === 'Non-Specific').length;

    // --- RULE CHECKS ---
    // Total points
    if (totalPoints > armySize) errors.push(`Points limit exceeded (${totalPoints}/${armySize}).`);

    [cite_start]// Air points limit [cite: 676]
    const maxAirPoints = 120 * slotsPer600;
    if (totalAirPoints > maxAirPoints) errors.push(`Air unit points limit exceeded (${totalAirPoints}/${maxAirPoints}).`);

    [cite_start]// Minimum Suits [cite: 681]
    const minSuits = 3 * slotsPer600;
    if (numSuitUnits < minSuits) errors.push(`Requires at least ${minSuits} Suit units (have ${numSuitUnits}). Support suits do not count.`);

    [cite_start]// Activation Token Limit [cite: 683]
    const maxTokens = 15 * slotsPer600;
    if (numUnits > maxTokens) errors.push(`Exceeds maximum of ${maxTokens} activation tokens (have ${numUnits}).`);
    
    [cite_start]// Rare Unit Limits (Ground) [cite: 683]
    if (numRareGround > Math.floor(numCommonGround)) errors.push(`Too many Rare ground units (max ${Math.floor(numCommonGround)}, have ${numRareGround}).`);

    [cite_start]// Rare Unit Limits (Air) [cite: 687]
    if (numRareAir > Math.floor(numCommonAir)) errors.push(`Too many Rare air units (max ${Math.floor(numCommonAir)}, have ${numRareAir}).`);

    [cite_start]// Training Level Limits [cite: 684, 685]
    if (numGreenUnits > 4 * slotsPer600) errors.push(`Too many Green units (max ${4*slotsPer600}, have ${numGreenUnits}).`);
    if (numEliteUnits > 4 * slotsPer600) errors.push(`Too many Elite units (max ${4*slotsPer600}, have ${numEliteUnits}).`);
    
    [cite_start]// Commander Limit [cite: 708]
    if (numCommanders > 1 * slotsPer600) errors.push(`Too many Command units (max ${1*slotsPer600}, have ${numCommanders}).`);
    
    [cite_start]// Hero Limit [cite: 502, 506]
    if (numHeroes > 1 * slotsPer600) errors.push(`Too many Hero units (max ${1*slotsPer600}, have ${numHeroes}).`);

    [cite_start]// Non-Specific Unit Limits [cite: 686]
    if (numNonSpecificUnits > 5 * slotsPer600) errors.push(`Too many Non-Specific units (max ${5*slotsPer600}, have ${numNonSpecificUnits}).`);
    if (numNonSpecificUnits > numFactionSuits) errors.push(`Requires 1 faction Suit for each Non-Specific unit (have ${numFactionSuits} suits, ${numNonSpecificUnits} non-specific).`);

    [cite_start]// Support Unit Dependencies [cite: 564]
    armyList.forEach(unit => {
        if (unit.parentUnit) {
            const hasParent = armyList.some(p => p.name === unit.parentUnit);
            if (!hasParent) {
                errors.push(`${unit.name} requires a ${unit.parentUnit} unit in the army.`);
            }
        }
    });

    // --- UPDATE UI ---
    elements.totalPoints.textContent = `${totalPoints} / ${armySize}`;
    elements.totalUnits.textContent = `${numUnits}`;
    elements.airPoints.textContent = `${totalAirPoints} / ${maxAirPoints}`;

    if (errors.length > 0) {
        elements.validationBox.innerHTML = `<strong>Army Illegal:</strong><br>${errors.join('<br>')}`;
        elements.validationBox.className = 'invalid';
    } else {
        elements.validationBox.textContent = 'Army is Legal';
        elements.validationBox.className = 'valid';
    }
}


// --- PDF EXPORT ---
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20;

    const armySize = gameState.gameSize;
    const faction = gameState.faction;
    const totalPoints = armyList.reduce((sum, u) => sum + u.currentCost, 0);

    doc.setFontSize(18);
    doc.text(`Ma.K. Ground Assault Army List`, 105, y, { align: 'center' });
    y += 10;
    doc.setFontSize(12);
    doc.text(`${faction} - ${totalPoints} / ${armySize} Points`, 105, y, { align: 'center' });
    y += 15;

    armyList.forEach(unit => {
        if (y > 280) { // Add new page if content overflows
            doc.addPage();
            y = 20;
        }

        doc.setFontSize(12).setFont(undefined, 'bold');
        doc.text(`${unit.name} - ${unit.currentCost} pts`, 14, y);
        y += 6;
        
        doc.setFontSize(10).setFont(undefined, 'normal');
        let details = `  ${unit.rarity} ${unit.type} | Training: ${unit.training}`;
        if (unit.isCommander) details += " | Commander";
        if (unit.hasPanzerfaust) details += ` | +Panzerfausts`;
        
        doc.text(details, 14, y);
        y += 10;
    });

    doc.save(`ground-assault-${faction}-${totalPoints}pts.pdf`);
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    elements.gameSizeSelector.addEventListener('change', (e) => {
        gameState.gameSize = parseInt(e.target.value, 10);
        rerender();
    });

    elements.factionSelector.addEventListener('change', (e) => {
        gameState.faction = e.target.value;
        armyList = []; // Clear army list on faction change
        rerender();
    });

    elements.unitSearch.addEventListener('input', renderAvailableUnits);

    elements.availableUnitsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-btn')) {
            addUnit(e.target.dataset.unitName);
        }
    });

    elements.yourArmyList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            removeUnit(parseInt(e.target.dataset.index, 10));
        }
    });

    elements.yourArmyList.addEventListener('change', (e) => {
        const index = parseInt(e.target.parentElement.dataset.index, 10);
        if (e.target.classList.contains('training-select')) {
            updateUnit(index, 'training', e.target.value);
        }
        if (e.target.classList.contains('panzerfaust-check')) {
            updateUnit(index, 'hasPanzerfaust', e.target.checked);
        }
        if (e.target.classList.contains('commander-check')) {
            updateUnit(index, 'isCommander', e.target.checked);
        }
    });

    elements.exportPdfButton.addEventListener('click', exportToPDF);
}

// --- INITIALIZE APP ---
function init() {
    setupEventListeners();
    rerender();
}

// Run the application
init();
