document.addEventListener("DOMContentLoaded", () => {
  // Elementi principali
  const calculateBtn = document.getElementById("calculate-btn");
  const checkBtn = document.getElementById("check-btn");
  const procediBtn = document.querySelector(".btn-procedi");
  const defaultMonthlyPriceField = document.getElementById("default-monthly-price");
  const setupFeeField = document.getElementById("setup-fee");
  const monthlyPriceField = document.getElementById("monthly-price"); // ora richiesto nell'HTML
  const salesCommissionsField = document.getElementById("sales-commissions");
  const resultsBox = document.getElementById("results");
  const checkSection = document.getElementById("check-section");
  const discountPanel = document.getElementById("discount-panel");
  const discountMessage = document.getElementById("discount-message");
  const discountDate = document.getElementById("discount-date");
  const calculatorIcon = document.getElementById("calculator-icon");
  const ctrPanel = document.getElementById("ctr-panel");
  const loadingSpinner = document.getElementById("loading-spinner");
  const countdown = document.getElementById("countdown");
  const viewerBox = document.getElementById("live-viewers");
  const viewerCountSpan = document.getElementById("viewer-count");
  const noaInput = document.getElementById("noa");

  // Toggle CTR
  calculatorIcon?.addEventListener("click", () => {
    ctrPanel.style.display = ctrPanel.style.display === "none" ? "block" : "none";
  });

  // Calcolo costi
  calculateBtn?.addEventListener("click", () => {
    const rooms = parseInt(document.getElementById("rooms")?.value) || 0;
    const doctors = parseInt(document.getElementById("doctors")?.value) || 0;
    const cpl = parseInt(document.getElementById("cpl")?.value) || 0;
    const additionalLocations = parseInt(document.getElementById("additional-locations")?.value) || 0;
    const noa = parseInt(noaInput?.value) || 0;
    const noaPrice = parseInt(document.getElementById("noa-price")?.value) || 0;

    const setupFeeTable = [500, 500, 500, 500, 500, 600, 600, 750, 750, 750, 1000];
    const pricePerRoomTable = [269, 170, 153, 117, 96, 88, 80, 75, 72, 67, 62];
    const index = rooms >= 11 ? 10 : Math.max(rooms - 1, 0);

    const setupFee = setupFeeTable[index] * 1.5;
    const baseMonthly = pricePerRoomTable[index] * rooms;
    const locationCost = additionalLocations * 99;
    const noaTotal = noa * noaPrice;

    const totalMonthly = baseMonthly + locationCost + noaTotal;
    const defaultMonthly = totalMonthly * 1.25;
    const commissionCpl = doctors * (cpl === 17 ? 8 : 6);
    const totalCommission = baseMonthly + commissionCpl + locationCost + noaTotal + setupFee / 12;

    // Visualizza risultati
    if (defaultMonthlyPriceField) defaultMonthlyPriceField.textContent = `${defaultMonthly.toFixed(2)} €`;
    if (setupFeeField) setupFeeField.textContent = `${setupFee.toFixed(2)} €`;
    if (monthlyPriceField) monthlyPriceField.textContent = `${totalMonthly.toFixed(2)} €`;
    if (salesCommissionsField) salesCommissionsField.textContent = `${totalCommission.toFixed(2)} €`;

    resultsBox.style.display = "block";
    discountPanel.style.display = "none";
    calculatorIcon.style.display = "none";
    discountMessage.style.display = "none";
    viewerBox.style.display = "none";
    ctrPanel.style.display = "none";

    procediBtn.style.display = "inline-block";
    checkBtn.style.display = noa >= 1 ? "inline-block" : "none";
  });

  // Verifica promozione
  checkBtn?.addEventListener("click", () => {
    loadingSpinner.style.display = "block";
    countdown.textContent = "Attendere 15 secondi...";
    let seconds = 15;

    const interval = setInterval(() => {
      seconds--;
      countdown.textContent = `Attendere ${seconds} secondi...`;

      if (seconds <= 0) {
        clearInterval(interval);
        loadingSpinner.style.display = "none";

        discountPanel.style.display = "block";
        calculatorIcon.style.display = "block";
        discountMessage.textContent = "Sono presenti sconti clicca qui";
        discountMessage.style.display = "inline-block";

        const today = new Date();
        today.setDate(today.getDate() + 10);
        discountDate.textContent = `Valido fino al: ${today.toLocaleDateString("it-IT")}`;

        viewerBox.style.display = "flex";
        updateViewerCount();
        setInterval(updateViewerCount, 20000);

        // Prezzi promozionali
        const originalMonthly = parseFloat(defaultMonthlyPriceField?.textContent.replace(" €", "") || 0);
        const promoMonthly = parseFloat(monthlyPriceField?.textContent.replace(" €", "") || 0);
        const originalSetup = parseFloat(setupFeeField?.textContent.replace(" €", "") || 0);
        const promoSetup = originalSetup / 1.5;

        document.getElementById("original-monthly-price").textContent = `${originalMonthly.toFixed(2)} €`;
        document.getElementById("promo-monthly-price").textContent = `${promoMonthly.toFixed(2)} €`;
        document.getElementById("original-setup-fee").textContent = `${originalSetup.toFixed(2)} €`;
        document.getElementById("promo-setup-fee").textContent = `${promoSetup.toFixed(2)} €`;

        discountPanel.scrollIntoView({ behavior: "smooth" });
      }
    }, 1000);
  });

  // Click su messaggio sconto
  discountMessage?.addEventListener("click", () => {
    discountPanel.scrollIntoView({ behavior: "smooth" });
  });

  // Aggiorna numero visitatori finti
  function updateViewerCount() {
    const randomViewers = Math.floor(Math.random() * 5) + 1;
    viewerCountSpan.textContent = randomViewers;
  }
});
