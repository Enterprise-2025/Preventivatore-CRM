document.addEventListener("DOMContentLoaded", () => {
  const calculateBtn = document.getElementById("calculate-btn");
  const checkBtn = document.getElementById("check-btn");
  const generatePdfBtn = document.getElementById("generate-pdf-btn");
  const popup = document.getElementById("pdf-popup");
  const confirmBtn = document.getElementById("popup-confirm-btn");
  const cancelBtn = document.getElementById("popup-cancel-btn");

  const defaultMonthly = document.getElementById("default-monthly-price");
  const setupFee = document.getElementById("setup-fee");
  const originalMonthly = document.getElementById("original-monthly-price");
  const promoMonthly = document.getElementById("promo-monthly-price");
  const originalSetup = document.getElementById("original-setup-fee");
  const promoSetup = document.getElementById("promo-setup-fee");
  const salesCommissions = document.getElementById("sales-commissions");
  const discountDate = document.getElementById("discount-date");
  const discountPanel = document.getElementById("discount-panel");
  const resultsSection = document.querySelector(".results");
  const checkSection = document.getElementById("check-section");
  const ctrPanel = document.getElementById("ctr-panel");
  const ctrValue = document.getElementById("calculator-icon");
  const countdown = document.getElementById("countdown");

  let promoTimeout;

  calculateBtn.addEventListener("click", () => {
    const rooms = parseInt(document.getElementById("rooms").value) || 0;
    const doctors = parseInt(document.getElementById("doctors").value) || 0;
    const cpl = parseInt(document.getElementById("cpl").value) || 0;
    const additionalLocations = parseInt(document.getElementById("additional-locations").value) || 0;
    const noa = parseInt(document.getElementById("noa").value) || 0;
    const noaPrice = parseFloat(document.getElementById("noa-price").value) || 0;

    const setupFeeTable = [500, 500, 500, 500, 500, 600, 600, 750, 750, 750, 1000];
    const pricePerRoomTable = [269, 170, 153, 117, 96, 88, 80, 75, 72, 67, 62];
    const index = rooms >= 11 ? 10 : Math.max(rooms - 1, 0);

    const setupFeeDefault = setupFeeTable[index];
    const setupFeeDisplayedValue = setupFeeDefault * 2;

    const monthlyPrice = pricePerRoomTable[index] * rooms;
    const locationsCost = additionalLocations * 99;
    const noaTotalPrice = noa * noaPrice;

    const totalMonthlyPrice = monthlyPrice + locationsCost + noaTotalPrice;
    const defaultMonthlyPriceValue = totalMonthlyPrice * 1.25;

    const commissionCpl = doctors * (cpl === 17 ? 8 : 6);
    const totalCommission = monthlyPrice + commissionCpl + locationsCost + noaTotalPrice + setupFeeDefault / 12;
    const ctr = Math.round((rooms + doctors + additionalLocations + noa) * 1.5);

    defaultMonthly.textContent = defaultMonthlyPriceValue.toFixed(2) + " €";
    setupFee.textContent = setupFeeDisplayedValue.toFixed(2) + " €";
    ctrValue.textContent = ctr + " punti CTR";

    resultsSection.style.display = "block";
    ctrPanel.style.display = "block";
    discountPanel.style.display = "none";
    checkSection.style.display = "none";
    clearTimeout(promoTimeout);
  });

  checkBtn.addEventListener("click", () => {
    resultsSection.style.display = "none";
    checkSection.style.display = "block";
    discountPanel.style.display = "none";

    let seconds = 15;
    countdown.textContent = "Attendere " + seconds + " secondi...";
    const interval = setInterval(() => {
      seconds--;
      countdown.textContent = "Attendere " + seconds + " secondi...";
      if (seconds <= 0) {
        clearInterval(interval);
        showPromo();
      }
    }, 1000);
  });

  function showPromo() {
    checkSection.style.display = "none";
    discountPanel.style.display = "block";

    const defaultPrice = parseFloat(defaultMonthly.textContent) || 0;
    const defaultSetup = parseFloat(setupFee.textContent) || 0;

    const newPrice = defaultPrice * 0.8;
    const newSetup = defaultSetup * 0.6;
    const commission = (defaultPrice - newPrice) + (defaultSetup - newSetup);

    originalMonthly.textContent = defaultPrice.toFixed(2) + " €";
    promoMonthly.textContent = newPrice.toFixed(2) + " €";
    originalSetup.textContent = defaultSetup.toFixed(2) + " €";
    promoSetup.textContent = newSetup.toFixed(2) + " €";
    salesCommissions.textContent = commission.toFixed(2) + " €";

    const scadenza = new Date();
    scadenza.setDate(scadenza.getDate() + 10);
    discountDate.textContent = scadenza.toLocaleDateString("it-IT");
  }

  generatePdfBtn.addEventListener("click", () => {
    popup.style.display = "flex";
  });

  cancelBtn.addEventListener("click", () => {
    popup.style.display = "none";
  });

  confirmBtn.addEventListener("click", async () => {
    const struttura = document.getElementById("popup-structure-name").value;
    const referente = document.getElementById("popup-referent-name").value;
    const venditore = document.getElementById("popup-sales-name").value;

    const existingPdfBytes = await fetch("Modello-preventivo-crm.pdf").then(res => res.arrayBuffer());
    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    firstPage.drawText("Struttura: " + struttura, { x: 50, y: height - 100, size: 12 });
    firstPage.drawText("Referente: " + referente, { x: 50, y: height - 120, size: 12 });
    firstPage.drawText("Venditore: " + venditore, { x: 50, y: height - 140, size: 12 });
    firstPage.drawText("Prezzo promo: " + promoMonthly.textContent, { x: 50, y: height - 180, size: 12 });
    firstPage.drawText("Setup fee promo: " + promoSetup.textContent, { x: 50, y: height - 200, size: 12 });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "preventivo.pdf";
    link.click();

    popup.style.display = "none";
  });

  function updateViewers() {
    const count = Math.floor(10 + Math.random() * 30);
    const viewerCount = document.getElementById("viewer-count");
    if (viewerCount) viewerCount.textContent = count;
  }
  setInterval(updateViewers, 5000);
});
