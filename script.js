// 1. Firebase Konfiguratsiyasi
const firebaseConfig = {
    apiKey: "AIzaSyCDgzdUF3n8rI_9zxs-cFyODn0Df5vxC_U",
    authDomain: "bgburger-savdo.firebaseapp.com",
    databaseURL: "https://bgburger-savdo-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "bgburger-savdo",
    storageBucket: "bgburger-savdo.firebasestorage.app",
    messagingSenderId: "916871756784",
    appId: "1:916871756784:web:dc992046e491da5500bb35"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// 2. Menyu ma'lumotlari
const menuData = {
    "Burgerlar": [
        { name: "Gamburger", price: 20000 }, { name: "Big Burger", price: 30000 },
        { name: "Chisburger", price: 25000 }, { name: "Chisburger 2 kotlet", price: 30000 },
        { name: "Nonburger", price: 32000 }, { name: "Nonburger dobriy", price: 35000 },
        { name: "Danar", price: 28000 }, { name: "Xaggi", price: 28000 }, { name: "Nonkabob", price: 35000 }
    ],
    "Lavashlar": [
        { name: "Lavash mini", price: 28000 }, { name: "Lavash tovuq", price: 25000 },
        { name: "Lavash standart", price: 32000 }, { name: "Lavash dobriy", price: 35000 },
        { name: "Lavash tandir", price: 38000 }, { name: "Lavash sirli", price: 38000 },
        { name: "Lavashda hotdog", price: 20000 }, { name: "Lavash s kotletoy", price: 35000 }
    ],
    "Hotdoglar": [
        { name: "Hotdog 1 sasiska", price: 10000 }, { name: "Hotdog kanada", price: 13000 },
        { name: "Hotdog 2 sasiska", price: 16000 }, { name: "Big hotdog", price: 20000 },
        { name: "Hotdog qazili", price: 35000 }
    ],
    "Pitsalar": [
        { name: "Pepperoni", price: 70000 }, { name: "Go`shtlik", price: 80000 }, { name: "Asarti", price: 90000 }
    ],
    "Tovuq": [
        { name: "Grill", price: 55000 },
        { name: "Tandir tovuq 1", price: 50000 },
        { name: "Tandir tovuq 0.5", price: 25000 },
        { name: "Kfs (tovuq) 500GR", price: 43000 },
        { name: "Kfs (tovuq) 50000 so'm", price: 50000 },
        { name: "Kfs (tovuq) 60000 so'm", price: 60000 },
        { name: "Kfs (tovuq) 70000 so'm", price: 70000 },
        { name: "Kfs (tovuq) 1KG", price: 85000 }
    ],
    "Ichimliklar": [
        { name: "Tara 0.25L", price: 5000 },
        { name: "Suv gazsiz 0.5L", price: 3000 },
        { name: "Kofe 1 stakan", price: 5000 },
        { name: "Choy 1 stakan", price: 2000 },
        { name: "Choy 1 choynak", price: 5000 }
    ],
    "Shirinliklar": [
        { name: "Shirinlik 1 kusok", price: 10000 },
        { name: "Kartoshka fri 1 porsya", price: 10000 }
    ]
};

// 3. Global holat (State)
let orders = {
    "1-stol": [],
    "2-stol": [],
    "3-stol": [],
    "4-stol": [],
    "5-stol": [],
    "Olib ketish": []
};
let activeTable = "1-stol";
const adminPassword = "volk1111";

const menuDiv = document.getElementById('menu-items');
const categoryDiv = document.getElementById('category-tabs');

// --- SAVDO QISMI ---
function switchTable() {
    const tableSelect = document.getElementById('table-number');
    activeTable = tableSelect.value;
    updateTotal();
}

function renderCategories() {
    if (!categoryDiv) return;
    categoryDiv.innerHTML = "";
    let allBtn = document.createElement('button');
    allBtn.innerText = "Barchasi";
    allBtn.className = "cat-btn active";
    allBtn.onclick = (e) => {
        document.querySelectorAll('#category-tabs .cat-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderMenu("all");
    };
    categoryDiv.appendChild(allBtn);

    for (let cat in menuData) {
        let btn = document.createElement('button');
        btn.innerText = cat;
        btn.className = "cat-btn";
        btn.onclick = (e) => {
            document.querySelectorAll('#category-tabs .cat-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderMenu(cat);
        };
        categoryDiv.appendChild(btn);
    }
}

function renderMenu(category = "all") {
    if (!menuDiv) return;
    menuDiv.innerHTML = "";
    let itemsToShow = [];
    if (category === "all") {
        for (let cat in menuData) itemsToShow = itemsToShow.concat(menuData[cat]);
    } else {
        itemsToShow = menuData[category];
    }
    itemsToShow.forEach(item => {
        let btn = document.createElement('button');
        btn.className = 'menu-btn';
        btn.innerText = `${item.name}\n${item.price.toLocaleString()} so'm`;
        btn.onclick = () => addToOrder(item);
        menuDiv.appendChild(btn);
    });
}

function addToOrder(item) {
    const orderItem = { ...item, orderId: Date.now() + Math.random() };
    orders[activeTable].push(orderItem); 
    updateTotal();
}

function removeFromOrder(id) {
    orders[activeTable] = orders[activeTable].filter(item => item.orderId !== id);
    updateTotal();
}

function clearCart() {
    orders[activeTable] = [];
    updateTotal();
}

function updateTotal() {
    const cartList = document.getElementById('cart-list');
    const totalSumLabel = document.getElementById('total-sum');
    if (!cartList) return;
    
    cartList.innerHTML = "";
    let sum = 0;
    
    orders[activeTable].forEach((item) => {
        let li = document.createElement('li');
        li.className = "cart-item";
        li.innerHTML = `<span>${item.name}</span><span><b>${item.price.toLocaleString()}</b> <button onclick="removeFromOrder(${item.orderId})" style="color:red; border:none; background:none; cursor:pointer; font-size:18px;">✖</button></span>`;
        cartList.appendChild(li);
        sum += item.price;
    });
    totalSumLabel.innerText = sum.toLocaleString();
    updateTableIndicator();
}

function updateTableIndicator() {
    const select = document.getElementById('table-number');
    for (let i = 0; i < select.options.length; i++) {
        let val = select.options[i].value;
        if (orders[val] && orders[val].length > 0) {
            select.options[i].text = val + " (⏳)";
        } else {
            select.options[i].text = val;
        }
    }
}

function completeSale() {
    const tableSelect = document.getElementById('table-number');
    activeTable = tableSelect.value; 

    const currentTableOrder = orders[activeTable];
    const paymentMethod = document.getElementById('payment-method').value;

    if (!currentTableOrder || currentTableOrder.length === 0) {
        return alert("Savat bo'sh!");
    }
    
    if (confirm(`${activeTable} uchun ${paymentMethod} orqali to'lov qabul qilindimi?`)) {
        let saleData = {
            time: new Date().toISOString(),
            items: [...currentTableOrder],
            total: currentTableOrder.reduce((a, b) => a + b.price, 0),
            tableName: activeTable, 
            paymentMethod: paymentMethod 
        };
        
        database.ref('sales').push(saleData).then(() => {
            alert("Sotuv muvaffaqiyatli saqlandi! ✅");
            orders[activeTable] = []; 
            updateTotal();
            if(typeof showStats === "function") showStats('today'); 
        }).catch(err => alert("Xato: " + err.message));
    }
}

// --- ADMIN VA HISOBOT QISMI ---
function toggleAdmin() {
    let pass = prompt("Admin parolini kiriting:");
    if (pass === adminPassword) {
        document.getElementById('admin-data').classList.remove('hidden');
        showStats('today');
    } else {
        alert("Parol noto'g'ri!");
    }
}

function showStats(filter = 'today', showAll = false) {
    const statsOutput = document.getElementById('stats-output');
    if (!statsOutput) return;

    // Klas to'g'rilandi: .filters barcha tugmalarni topadi
    const filterButtons = document.querySelectorAll('.filters button');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${filter}'`)) {
            btn.classList.add('active');
        }
    });

    let now = new Date();
    let startTime = null;

    if (filter === 'today') {
        startTime = new Date(now.setHours(0,0,0,0)).toISOString();
    } else if (filter === 'week') {
        let lastWeek = new Date();
        lastWeek.setDate(now.getDate() - 7);
        startTime = lastWeek.toISOString();
    } else if (filter === 'month') {
        startTime = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    }

    let salesRef = database.ref('sales');
    let expensesRef = database.ref('expenses');

    let salesQuery = (filter === 'all' || !startTime) ? salesRef : salesRef.orderByChild('time').startAt(startTime);
    let expQuery = (filter === 'all' || !startTime) ? expensesRef : expensesRef.orderByChild('time').startAt(startTime);

    salesQuery.once('value', (salesSnapshot) => {
        const salesData = salesSnapshot.val() || {};
        let sales = Object.keys(salesData).map(key => ({ id: key, ...salesData[key] }));

        expQuery.once('value', (expSnapshot) => {
            const expData = expSnapshot.val() || {};
            let expenses = Object.keys(expData).map(key => ({ id: key, ...expData[key] }));
            
            renderStatsUI(sales, expenses, filter, showAll);
        });
    });
}

function renderStatsUI(filteredSales, filteredExpenses, filter, showAll) {
    const statsOutput = document.getElementById('stats-output');
    
    let totalCash = filteredSales
        .filter(s => s.paymentMethod === 'naqd' || !s.paymentMethod)
        .reduce((sum, s) => sum + s.total, 0);

    let totalCard = filteredSales
        .filter(s => s.paymentMethod === 'karta')
        .reduce((sum, s) => sum + s.total, 0);

    let totalSales = totalCash + totalCard;
    let totalExp = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    let netProfit = totalSales - totalExp;

    const filterNames = { 'today': 'BUGUNGI', 'week': 'HAFTALIK', 'month': 'OYLIK', 'all': 'UMUMIY' };
    let currentFilterName = filterNames[filter] || filter.toUpperCase();

    // 1. Qisqa hisobot bloki
    let output = `
        <div style="background: #f8f9fa; padding: 15px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #eee;">
            <div style="font-size: 11px; color: #888; margin-bottom: 10px; text-align: center; font-weight:bold;">${currentFilterName} QISQA HISOBOT</div>
            <div style="display:flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #444;">💵 Naqd pul:</span>
                <b>${totalCash.toLocaleString()} so'm</b>
            </div>
            <div style="display:flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #007bff;">💳 Karta orqali:</span>
                <b>${totalCard.toLocaleString()} so'm</b>
            </div>
            <div style="display:flex; justify-content: space-between; margin-bottom: 8px; border-top: 1px solid #ddd; pt-5; margin-top:5px;">
                <span style="color: #28a745; font-weight:bold;">💰 Jami Savdo:</span>
                <b style="color: #28a745;">${totalSales.toLocaleString()}</b>
            </div>
            <div style="display:flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #dc3545;">💸 Jami Rasxod:</span>
                <b style="color: #dc3545;">${totalExp.toLocaleString()}</b>
            </div>
            <hr style="border: 0; border-top: 1px dashed #ccc;">
            <div style="display:flex; justify-content: space-between; font-size: 18px; margin-top: 5px;">
                <span style="font-weight:bold;">💵 Sof Foyda:</span>
                <b style="color: #007bff;">${netProfit.toLocaleString()} so'm</b>
            </div>
        </div>
    `;

    // 2. XARAJAТLAR QISMI (Yangi limit va tugma mantig'i qo'shildi)
    output += `<h4 style="margin-bottom:10px;">Xarajatlar tafsiloti:</h4>`;
    if (filteredExpenses.length === 0) {
        output += `<p style="color:#888; font-size:12px;">Rasxodlar yo'q.</p>`;
    } else {
        let displayExpenses = filteredExpenses.slice().reverse();
        let expLimit = 10;
        // Agar showAll true bo'lsa hammasini, aks holda faqat dastlabki 10 tasini oladi
        let expListToRender = (!showAll && displayExpenses.length > expLimit) ? displayExpenses.slice(0, expLimit) : displayExpenses;

        expListToRender.forEach(e => {
            output += `
                <div style="background: #fff5f5; border: 1px solid #ffebeb; padding: 10px; border-radius: 8px; margin-bottom: 8px; border-left: 4px solid #dc3545; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <b style="font-size:14px;">${e.reason}</b><br>
                        <small style="color:#999;">${new Date(e.time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</small>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <b style="color:#dc3545;">-${e.amount.toLocaleString()}</b>
                        <button onclick="deleteExpense('${e.id}')" style="background:none; border:none; cursor:pointer; font-size:16px;">🗑️</button>
                    </div>
                </div>`;
        });

        // Agar xarajatlar 10 tadan ko'p bo'lsa, "Hammasini ko'rish" tugmasi chiqadi
        if (filteredExpenses.length > expLimit) {
            let btnText = showAll ? "Xarajatlarni qisqartirish ↑" : `Barcha xarajatlarni ko'rsatish (${filteredExpenses.length} ta) ↓`;
            output += `<button onclick="showStats('${filter}', ${!showAll})" style="width:100%; padding:10px; margin-top:5px; margin-bottom:15px; cursor:pointer; background:#fff0f0; border:1px solid #ffe3e3; color:#dc3545; border-radius:8px; font-weight:500;">${btnText}</button>`;
        }
    }

    // 3. SAVDOLAR QISMI (Bu qism ham showAll parametridan foydalanadi)
    output += `<h4 style="margin-top:20px;">Savdolar tafsiloti:</h4>`;
    let displaySales = filteredSales.slice().reverse();
    let salesLimit = 10;
    let salesListToRender = (!showAll && displaySales.length > salesLimit) ? displaySales.slice(0, salesLimit) : displaySales;

    salesListToRender.forEach(s => {
        let timeStr = new Date(s.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let pMethodIcon = s.paymentMethod === 'karta' ? '💳' : '💵';
        
        output += `
            <div style="background: #fff; border: 1px solid #eee; border-radius: 10px; padding: 12px; margin-bottom: 8px; border-left: 4px solid #007bff; display:flex; justify-content:space-between; align-items:center;">
                <div style="flex:1;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                        <span style="font-size: 12px; color: #aaa;">${timeStr} - <b>${s.tableName}</b> ${pMethodIcon}</span>
                        <b style="color:#333;">${s.total.toLocaleString()} so'm</b>
                    </div>
                    <div style="font-size: 12px; color: #777;">${s.items ? s.items.map(i => i.name).join(", ") : "Noma'lum"}</div>
                </div>
                <button onclick="deleteSale('${s.id}')" style="background:none; border:none; cursor:pointer; font-size:18px; margin-left:10px;">🗑️</button>
            </div>`;
    });

    // Savdolar uchun "Barchasini ko'rsatish" tugmasi
    if (filteredSales.length > salesLimit) {
        let btnText = showAll ? "Savdolarni qisqartirish ↑" : `Barcha savdolarni ko'rsatish (${filteredSales.length} ta) ↓`;
        output += `<button onclick="showStats('${filter}', ${!showAll})" style="width:100%; padding:10px; margin-top:5px; cursor:pointer; background:#e6f4ff; border:1px solid #bae7ff; color:#0050b3; border-radius:8px; font-weight:500;">${btnText}</button>`;
    }

    statsOutput.innerHTML = output;
}

// Dublikat to'g'rilandi: bitta funksiya qoldi
function deleteSale(id) {
    if (confirm("Ushbu savdo tarixdan o'chirilsinmi?")) {
        database.ref('sales/' + id).remove().then(() => showStats());
    }
}

function deleteExpense(id) {
    if (confirm("Ushbu xarajat o'chirilsinmi?")) {
        database.ref('expenses/' + id).remove().then(() => showStats());
    }
}

function clearHistory() {
    if (confirm("DIQQAT! Barcha sotuvlar tarixi butunlay o'chib ketadi. Rozimisiz?")) {
        database.ref('sales').remove()
            .then(() => {
                alert("Barcha tarix tozalandi!");
                showStats('today'); 
            })
            .catch(err => alert("Xato: " + err.message));
    }
}

function filterMenu() {
    let text = document.getElementById('search-input').value.toLowerCase();
    let allItems = [];
    for (let cat in menuData) allItems = allItems.concat(menuData[cat]);
    let filtered = allItems.filter(item => item.name.toLowerCase().includes(text));
    menuDiv.innerHTML = "";
    filtered.forEach(item => {
        let btn = document.createElement('button');
        btn.className = 'menu-btn';
        btn.innerText = `${item.name}\n${item.price.toLocaleString()} so'm`;
        btn.onclick = () => addToOrder(item);
        menuDiv.appendChild(btn);
    });
}

function openExpenseModal() {
    document.getElementById('expense-modal').style.display = 'flex';
}
function closeExpenseModal() {
    document.getElementById('expense-modal').style.display = 'none';
    document.getElementById('exp-amount').value = '';
    document.getElementById('exp-reason').value = '';
}

function saveExpense() {
    const amount = document.getElementById('exp-amount').value;
    const reason = document.getElementById('exp-reason').value;

    if (!amount || !reason) return alert("Hamma maydonni toldiring!");

    const expenseData = {
        amount: parseInt(amount),
        reason: reason,
        time: new Date().toISOString()
    };

    database.ref('expenses').push(expenseData).then(() => {
        alert("Xarajat saqlandi!");
        closeExpenseModal();
        showStats('today');
    }).catch(err => alert("Xato: " + err.message));
}

// XOMASHYO HISOB-KITOBI (Interfeys bilan to'liq bog'landi)
let calculatedEmergencyRevenue = 0;

function autoCalculateIngredients() {
    const inLavash = parseFloat(document.getElementById('ing-in-lavash').value) || 0;
    const outLavash = parseFloat(document.getElementById('ing-out-lavash').value) || 0;

    const inBurger = parseFloat(document.getElementById('ing-in-burger').value) || 0;
    const outBurger = parseFloat(document.getElementById('ing-out-burger').value) || 0;

    const inHotdog = parseFloat(document.getElementById('ing-in-hotdog').value) || 0;
    const outHotdog = parseFloat(document.getElementById('ing-out-hotdog').value) || 0;

    const inSasiska = parseFloat(document.getElementById('ing-in-sasiska').value) || 0;
    const outSasiska = parseFloat(document.getElementById('ing-out-sasiska').value) || 0;

    const PRICE_LAVASH = 32000;  
    const PRICE_BURGER = 20000;  
    const PRICE_HOTDOG = 15000;  

    let soldLavash = Math.max(0, inLavash - outLavash);
    let soldBurger = Math.max(0, inBurger - outBurger);
    
    let soldHotdogByBread = Math.max(0, inHotdog - outHotdog);
    let soldHotdogBySasiska = Math.max(0, inSasiska - outSasiska);
    let soldHotdog = Math.max(soldHotdogByBread, soldHotdogBySasiska);

    let revLavash = soldLavash * PRICE_LAVASH;
    let revBurger = soldBurger * PRICE_BURGER;
    let revHotdog = soldHotdog * PRICE_HOTDOG;

    calculatedEmergencyRevenue = revLavash + revBurger + revHotdog;

    const resultBox = document.getElementById('ingredient-result-box');
    resultBox.classList.remove('hidden');
    resultBox.style.display = 'block';

    // LatEx strelkasi oddiy strelkaga almashtirildi
    resultBox.innerHTML = `
        <h4 style="margin: 0 0 10px 0; color: #2b6cb0;">📊 Hisob-kitob natijasi:</h4>
        <div style="font-size: 14px; line-height: 1.6; color: #2d3748;">
            🫓 <b>Sotilgan Lavash:</b> ${soldLavash} ta ➔ <span style="color:#2f855a; font-weight:bold;">+${revLavash.toLocaleString()} so'm</span><br>
            🍞 <b>Sotilgan Burger:</b> ${soldBurger} ta ➔ <span style="color:#2f855a; font-weight:bold;">+${revBurger.toLocaleString()} so'm</span><br>
            🌭 <b>Sotilgan Hotdog:</b> ${soldHotdog} ta ➔ <span style="color:#2f855a; font-weight:bold;">+${revHotdog.toLocaleString()} so'm</span>
            <hr style="margin: 10px 0; border: 0; border-top: 1px solid #e2e8f0;">
            <div style="font-size: 16px; font-weight: bold; margin-bottom: 12px;">
                💰 Jami tiklanadigan tushum: <span style="color: #c53030;">${calculatedEmergencyRevenue.toLocaleString()} so'm</span>
            </div>
            ${calculatedEmergencyRevenue > 0 ? `
                <button onclick="saveEmergencyRevenueToFirebase()" style="background: #48bb78; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; width: 100%; cursor: pointer;">
                    📥 Ushbu pulni Bugungi Savdoga qo'shish
                </button>
            ` : '<p style="color:#718096; font-size:12px; margin:0;">Kamomad yoki sotuv aniqlanmadi.</p>'}
        </div>
    `;
}

function saveEmergencyRevenueToFirebase() {
    if (calculatedEmergencyRevenue <= 0) return;

    if (confirm(`Rostdan ham ${calculatedEmergencyRevenue.toLocaleString()} so'm pulni bugungi umumiy savdoga qo'shmoqchimisiz?`)) {
        let saleData = {
            time: new Date().toISOString(),
            items: [{ name: "Xomashyo balansi orqali tiklangan savdo", price: calculatedEmergencyRevenue }],
            total: calculatedEmergencyRevenue,
            tableName: "Xomashyo hisobi", 
            paymentMethod: "naqd" 
        };

        database.ref('sales').push(saleData).then(() => {
            alert("Pul muvaffaqiyatli qo'shildi va Sof Foyda qayta hisoblandi! ✅");
            document.getElementById('ingredient-result-box').style.display = 'none';
            
            document.getElementById('ing-in-lavash').value = 0;
            document.getElementById('ing-out-lavash').value = 0;
            document.getElementById('ing-in-burger').value = 0;
            document.getElementById('ing-out-burger').value = 0;
            document.getElementById('ing-in-hotdog').value = 0;
            document.getElementById('ing-out-hotdog').value = 0;
            document.getElementById('ing-in-sasiska').value = 0;
            document.getElementById('ing-out-sasiska').value = 0;

            showStats('today');
        }).catch(err => alert("Xato yuz berdi: " + err.message));
    }
}

// Boshlang'ich yuklash
renderCategories();
renderMenu("all");

// 1. Sahifa yuklanganda yoki har safar tugma bosilganda yangi qator qo'shish funksiyasi
function addIngredientRow(name = "", incoming = 0, remaining = 0, price = 0) {
    const tbody = document.getElementById('ing-rows');
    if (!tbody) return;

    const rowId = 'ing-row-' + Date.now() + Math.random().toString(36).substr(2, 5);
    const tr = document.createElement('tr');
    tr.id = rowId;

    tr.innerHTML = `
        <td><input type="text" class="ing-name" placeholder="Masalan: Lavash xmiri" value="${name}" style="width:100%;"></td>
        <td><input type="number" class="ing-in" placeholder="0" value="${incoming}" style="width:100%;"></td>
        <td><input type="number" class="ing-out" placeholder="0" value="${remaining}" style="width:100%;"></td>
        <td><input type="number" class="ing-price" placeholder="Narxi" value="${price}" style="width:100%;"></td>
        <td style="text-align:center;"><button onclick="document.getElementById('${rowId}').remove()" style="background:none; border:none; color:#dc2626; cursor:pointer; font-size:16px;">🗑️</button></td>
    `;
    tbody.appendChild(tr);
}

// 2. Barcha qatorlarni aylanib chiqib, umumiy tushumni hisoblash funksiyasi
function calcIngredients() {
    const tbody = document.getElementById('ing-rows');
    const rows = tbody.querySelectorAll('tr');
    const resultBox = document.getElementById('ingredient-result-box');

    if (rows.length === 0) {
        alert("Sotilganni hisoblash uchun oldin xomashyo qo'shing!");
        return;
    }

    let totalRevenue = 0;
    let detailHTML = `<h4 style="margin: 0 0 10px 0; color: #166534;">📊 Dinamik hisob-kitob natijasi:</h4>`;
    let hasValidData = false;

    rows.forEach(row => {
        const name = row.querySelector('.ing-name').value.trim() || "Noma'lum xomashyo";
        const incoming = parseFloat(row.querySelector('.ing-in').value) || 0;
        const remaining = parseFloat(row.querySelector('.ing-out').value) || 0;
        const price = parseFloat(row.querySelector('.ing-price').value) || 0;

        // Sotilgan miqdor = Kelgan - Qoldi (0 dan kichik bo'lib ketmasligi ta'minlanadi)
        let sold = Math.max(0, incoming - remaining);
        let rowRevenue = sold * price;

        if (incoming > 0) {
            hasValidData = true;
            totalRevenue += rowRevenue;
            detailHTML += `
                <div style="font-size: 14px; margin-bottom: 6px; color: #374151;">
                    📦 <b>${name}:</b> ${sold} ta sotilgan ➔ <span style="color:#166534; font-weight:bold;">+${rowRevenue.toLocaleString()} so'm</span>
                </div>
            `;
        }
    });

    if (!hasValidData) {
        alert("Kamida bitta xomashyoning 'Kelgan' miqdorini kiriting!");
        return;
    }

    calculatedEmergencyRevenue = totalRevenue;

    detailHTML += `
        <hr style="margin: 12px 0; border: 0; border-top: 1px dashed #cbd5e1;">
        <div style="font-size: 16px; font-weight: bold; margin-bottom: 12px; color: #1e293b;">
            💰 Jami tiklanadigan tushum: <span style="color: #b91c1c;">${calculatedEmergencyRevenue.toLocaleString()} so'm</span>
        </div>
        ${calculatedEmergencyRevenue > 0 ? `
            <button class="btn-success" onclick="saveEmergencyRevenueToFirebase()" style="width: 100%; padding: 10px; font-weight: bold;">
                📥 Ushbu pulni Bugungi Savdoga qo'shish
            </button>
        ` : '<p style="color:#64748b; font-size:12px; margin:0;">Sotuv tushumi 0 so\'m deb hisoblandi.</p>'}
    `;

    resultBox.innerHTML = detailHTML;
    resultBox.classList.remove('hidden');
    resultBox.style.display = 'block';
}

// 3. Hisoblangan pulni Firebase bazasiga yozish va jadvalni tozalash
function saveEmergencyRevenueToFirebase() {
    if (calculatedEmergencyRevenue <= 0) return;

    if (confirm(`Rostdan ham ${calculatedEmergencyRevenue.toLocaleString()} so'm pulni bugungi umumiy savdoga qo'shmoqchimisiz?`)) {
        let saleData = {
            time: new Date().toISOString(),
            items: [{ name: "Xomashyo balansi orqali tiklangan dinamik savdo", price: calculatedEmergencyRevenue }],
            total: calculatedEmergencyRevenue,
            tableName: "Xomashyo hisobi", 
            paymentMethod: "naqd"
        };

        database.ref('sales').push(saleData).then(() => {
            alert("Pul muvaffaqiyatli qo'shildi! ✅");
            document.getElementById('ingredient-result-box').style.display = 'none';
            
            // Inputlarni tozalaymiz
            document.getElementById('ing-rows').innerHTML = "";
            
            // Standart qatorlarni qaytadan yaratish (ixtiyoriy)
            initDefaultIngredients();

            if (typeof showStats === "function") showStats('today');
        }).catch(err => alert("Xato yuz berdi: " + err.message));
    }
}

// Dastur boshlanganda foydalanuvchiga qulay bo'lishi uchun standart 4 ta qatorni avtomat yaratish
function initDefaultIngredients() {
    addIngredientRow("🫓 Lavash xmiri", 0, 0, 32000);
    addIngredientRow("🍞 Burger noni", 0, 0, 20000);
    addIngredientRow("🌭 Hotdog noni", 0, 0, 15000);
    addIngredientRow("🌭 Sasiska", 0, 0, 5000);
}

// Skript yuklanganda standart elementlarni chiqarish
initDefaultIngredients();