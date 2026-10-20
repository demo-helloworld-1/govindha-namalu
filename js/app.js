// State Variables
let currentIndex = 0;       // 0 to 131 (corresponds to 132 namas)
let malaCounter = 1;        // 1 to 132
let malaRounds = 0;
let totalChants = 0;
let isAutoPlay = false;
let autoInterval = null;
let currentLanguage = 'te'; // 'te' or 'en'
let currentMode = 'japa';   // 'japa' or 'parayanam'

// UI Elements
const elTeluguNama = document.getElementById('currentNamaTelugu');
const elEnglishNama = document.getElementById('currentNamaEnglish');
const elMeaning = document.getElementById('currentNamaMeaning');
const elNamaCard = document.getElementById('namaCard');
const elNamaIndexMetric = document.getElementById('metricNamaIndex');
const elMalaRoundsMetric = document.getElementById('metricMalaRounds');
const elTotalChantsMetric = document.getElementById('metricTotalChants');
const elBeadCounterText = document.getElementById('beadCounterText');
const elMalaProgressRing = document.getElementById('malaProgressRing');
const elChantRipple = document.getElementById('chantRipple');
const elAutoBtn = document.getElementById('autoChantBtn');
const elAutoText = document.getElementById('autoChantText');
const elAutoIcon = document.getElementById('autoChantIcon');

// Bell and Shankh Action Buttons
const elBellBtn = document.getElementById('bellBtn');
const elShankhBtn = document.getElementById('shankhBtn');

// Drawer Elements
const namasDrawer = document.getElementById('namasDrawer');
const openDirectoryBtn = document.getElementById('openDirectoryBtn');
const closeDrawerBtn = document.getElementById('closeDrawerBtn');
const drawerListContainer = document.getElementById('drawerListContainer');
const searchNamaInput = document.getElementById('searchNamaInput');

// Mode & Language Switchers
const modeJapaBtn = document.getElementById('modeJapa');
const modeParayanamBtn = document.getElementById('modeParayanam');
const langTeluguBtn = document.getElementById('langTelugu');
const langEnglishBtn = document.getElementById('langEnglish');

// Localization Elements
const elAppSubtitle = document.getElementById('appSubtitle');
const elDirectoryBtnText = document.getElementById('directoryBtnText');
const elMetricNamaLabel = document.getElementById('metricNamaLabel');
const elMetricMalaLabel = document.getElementById('metricMalaLabel');
const elMetricTotalLabel = document.getElementById('metricTotalLabel');
const elResponseChorus = document.getElementById('responseChorus');
const elLabelMeaning = document.getElementById('labelMeaning');
const elPrevNamaBtn = document.getElementById('prevNamaBtn');
const elNextNamaBtn = document.getElementById('nextNamaBtn');
const elChantBeadMainText = document.getElementById('chantBeadMainText');
const elChantBeadSubText = document.getElementById('chantBeadSubText');
const elChantHintText = document.getElementById('chantHintText');
const elResetMalaText = document.getElementById('resetMalaText');
const elDrawerTitle = document.getElementById('drawerTitle');
const elDrawerFooterText = document.getElementById('drawerFooterText');
const elCompletionTitle = document.getElementById('completionTitle');
const elCompletionSub = document.getElementById('completionSub');

function renderCurrentNama() {
  const total = GOVINDA_NAMALU.length; // 132
  const data = GOVINDA_NAMALU[currentIndex];

  elNamaCard.classList.add('scale-[0.98]');
  setTimeout(() => elNamaCard.classList.remove('scale-[0.98]'), 150);

  elTeluguNama.textContent = data.telugu;
  elEnglishNama.textContent = data.english;
  elMeaning.textContent = data.meaning;

  elNamaIndexMetric.textContent = (currentIndex + 1);
  const elDenom = document.getElementById('metricTotalDenominator');
  if (elDenom) elDenom.textContent = `/${total}`;
  const elBadge = document.getElementById('directoryCountBadge');
  if (elBadge) elBadge.textContent = total;
  elMalaRoundsMetric.textContent = malaRounds;
  elTotalChantsMetric.textContent = totalChants;

  const beadDisplay = currentMode === 'japa' ? malaCounter : (currentIndex + 1);
  elBeadCounterText.textContent = `${beadDisplay} / ${total}`;

  const progressRatio = beadDisplay / total;
  const ringOffset = 440 - progressRatio * 440;
  elMalaProgressRing.style.strokeDashoffset = ringOffset;
}

function handleChant() {
  const total = GOVINDA_NAMALU.length;
  playTempleBell(1050 + (malaCounter % 12) * 25);

  elChantRipple.classList.remove('opacity-0', 'scale-0');
  elChantRipple.classList.add('scale-150', 'opacity-100');
  setTimeout(() => {
    elChantRipple.classList.remove('scale-150', 'opacity-100');
    elChantRipple.classList.add('opacity-0', 'scale-0');
  }, 300);

  totalChants++;

  if (currentMode === 'japa') {
    // If finishing the 132nd chant, trigger completion gesture
    if (malaCounter >= total) {
      malaCounter = 1;
      malaRounds++;
      triggerGrandCelebrationShower();
      playShankhamSound();
    } else {
      malaCounter++;
      triggerPetalShower(3);
    }
    currentIndex = (currentIndex + 1) % total;
  } else {
    // Parayanam mode
    if (currentIndex >= total - 1) {
      currentIndex = 0;
      malaRounds++;
      triggerGrandCelebrationShower();
      playShankhamSound();
    } else {
      currentIndex++;
      triggerPetalShower(3);
    }
  }

  renderCurrentNama();
}

function toggleAutoChant() {
  isAutoPlay = !isAutoPlay;
  const s = UI_STRINGS[currentLanguage] || UI_STRINGS.te;
  if (isAutoPlay) {
    elAutoBtn.classList.remove('bg-temple-maroon');
    elAutoBtn.classList.add('bg-temple-gold', 'text-temple-deepWine', 'font-bold');
    elAutoIcon.textContent = '⏸';
    elAutoText.textContent = s.autoPause;
    autoInterval = setInterval(() => {
      handleChant();
    }, 2200);
  } else {
    clearInterval(autoInterval);
    elAutoBtn.classList.remove('bg-temple-gold', 'text-temple-deepWine', 'font-bold');
    elAutoBtn.classList.add('bg-temple-maroon', 'text-temple-goldLight');
    elAutoIcon.textContent = '▶';
    elAutoText.textContent = s.autoPlay;
  }
}

function populateDirectory(filterText = '') {
  drawerListContainer.innerHTML = '';
  const filter = filterText.toLowerCase().trim();

  GOVINDA_NAMALU.forEach((item, index) => {
    if (
      filter === '' ||
      item.telugu.includes(filter) ||
      item.english.toLowerCase().includes(filter) ||
      item.meaning.toLowerCase().includes(filter) ||
      String(item.id).includes(filter)
    ) {
      const row = document.createElement('div');
      const isCurrent = index === currentIndex;
      row.className = `p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${isCurrent
        ? 'bg-temple-gold/25 border-temple-gold text-white shadow-md'
        : 'bg-black/30 border-temple-gold/15 text-stone-300 hover:bg-temple-gold/10'
        }`;

      row.innerHTML = `
        <div class="flex items-center space-x-3">
          <span class="w-7 h-7 rounded-full flex items-center justify-center font-cinzel text-xs font-bold ${isCurrent ? 'bg-temple-gold text-temple-deepWine' : 'bg-temple-maroon text-temple-gold'
        }">
            ${item.id}
          </span>
          <div>
            <p class="font-telugu font-semibold text-sm ${isCurrent ? 'text-temple-gold' : 'text-stone-100'}">${item.telugu}</p>
            <p class="text-[11px] text-stone-400 font-cinzel">${item.english}</p>
          </div>
        </div>
        <span class="text-xs ${isCurrent ? 'text-temple-gold font-bold' : 'text-stone-500'}">🪷</span>
      `;

      row.addEventListener('click', () => {
        currentIndex = index;
        malaCounter = index + 1; // Sync bead counter with chosen nama
        renderCurrentNama();
        namasDrawer.classList.add('translate-y-full');
        playTempleBell(1300);
      });

      drawerListContainer.appendChild(row);
    }
  });
}

function applyLanguage(lang) {
  currentLanguage = lang;
  const s = UI_STRINGS[lang] || UI_STRINGS.te;

  if (lang === 'te') {
    langTeluguBtn.className = "text-[11px] font-bold text-temple-gold bg-temple-gold/20 px-2 py-0.5 rounded transition-all";
    langEnglishBtn.className = "text-[11px] text-stone-300 hover:text-white px-2 py-0.5 rounded transition-all";
  } else {
    langEnglishBtn.className = "text-[11px] font-bold text-temple-gold bg-temple-gold/20 px-2 py-0.5 rounded transition-all";
    langTeluguBtn.className = "text-[11px] text-stone-300 hover:text-white px-2 py-0.5 rounded transition-all";
  }

  if (elAppSubtitle) elAppSubtitle.textContent = s.appSubtitle;
  if (elDirectoryBtnText) elDirectoryBtnText.textContent = s.directoryBtn;
  if (modeJapaBtn) modeJapaBtn.textContent = s.modeJapa;
  if (modeParayanamBtn) modeParayanamBtn.textContent = s.modeParayanam;
  if (elMetricNamaLabel) elMetricNamaLabel.textContent = s.metricOrder;
  if (elMetricMalaLabel) elMetricMalaLabel.textContent = s.metricRounds;
  if (elMetricTotalLabel) elMetricTotalLabel.textContent = s.metricTotal;
  if (elResponseChorus) elResponseChorus.textContent = s.chorus;
  if (elLabelMeaning) elLabelMeaning.textContent = s.meaningLabel;
  if (elPrevNamaBtn) elPrevNamaBtn.title = s.prevTitle;
  if (elNextNamaBtn) elNextNamaBtn.title = s.nextTitle;
  if (elAutoText) elAutoText.textContent = isAutoPlay ? s.autoPause : s.autoPlay;
  if (elChantBeadMainText) elChantBeadMainText.textContent = s.chantCenter;
  if (elChantBeadSubText) elChantBeadSubText.textContent = s.chantSub;
  if (elChantHintText) elChantHintText.innerHTML = `<span>${s.chantHint}</span>`;
  if (elResetMalaText) elResetMalaText.textContent = s.resetMala;
  if (elDrawerTitle) elDrawerTitle.textContent = s.drawerTitle;
  if (searchNamaInput) searchNamaInput.placeholder = s.searchPlaceholder;
  if (elDrawerFooterText) elDrawerFooterText.textContent = s.drawerFooter;
  if (elCompletionTitle) elCompletionTitle.textContent = s.completionTitle;
  if (elCompletionSub) elCompletionSub.textContent = s.completionSub;
  if (elShankhBtn) elShankhBtn.title = s.shankhTitle;
  updateBellButton();
}

function triggerTactilePulse(heavy = false) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(heavy ? [30, 50, 30] : 15);
    } catch (e) {}
  }
}

function updateBellButton() {
  if (!elBellBtn) return;
  const s = UI_STRINGS[currentLanguage] || UI_STRINGS.te;
  if (isBellMuted) {
    elBellBtn.title = s.bellUnmute;
    elBellBtn.setAttribute('aria-label', s.bellUnmute);
    elBellBtn.className = "w-8 h-8 rounded-full bg-stone-900/90 border border-red-500/50 flex items-center justify-center text-stone-400 hover:text-stone-200 active:scale-90 transition-all shadow-md relative";
    elBellBtn.innerHTML = `
      <svg class="w-4 h-4 text-stone-400 opacity-60" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2a2 2 0 0 0-2 2c0 .74.4 1.39 1 1.73V7h-1C6.24 7 3.5 9.74 3.5 13.5v2.83l-1.62 1.62A1 1 0 0 0 2.59 20H21.4a1 1 0 0 0 .71-1.71L20.5 16.33V13.5C20.5 9.74 17.76 7 14 7h-1V5.73c.6-.34 1-.99 1-1.73a2 2 0 0 0-2-2zm0 19a3 3 0 0 1-3-3h6a3 3 0 0 1-3 3z"/>
      </svg>
      <span class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span class="w-5 h-[2px] bg-red-500 rotate-45 rounded-full shadow-sm"></span>
      </span>
    `;
  } else {
    elBellBtn.title = s.bellMute;
    elBellBtn.setAttribute('aria-label', s.bellMute);
    elBellBtn.className = "w-8 h-8 rounded-full bg-temple-cardBg/90 border border-temple-gold/40 flex items-center justify-center text-temple-gold hover:text-white active:scale-90 transition-all shadow-md";
    elBellBtn.innerHTML = `
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2a2 2 0 0 0-2 2c0 .74.4 1.39 1 1.73V7h-1C6.24 7 3.5 9.74 3.5 13.5v2.83l-1.62 1.62A1 1 0 0 0 2.59 20H21.4a1 1 0 0 0 .71-1.71L20.5 16.33V13.5C20.5 9.74 17.76 7 14 7h-1V5.73c.6-.34 1-.99 1-1.73a2 2 0 0 0-2-2zm0 19a3 3 0 0 1-3-3h6a3 3 0 0 1-3 3z"/>
      </svg>
    `;
  }
}

function toggleBellMute() {
  isBellMuted = !isBellMuted;
  updateBellButton();
  triggerTactilePulse(false);
  if (!isBellMuted) playTempleBell(1250);
}

// Mode change listeners
modeJapaBtn.addEventListener('click', () => {
  currentMode = 'japa';
  modeJapaBtn.className = 'px-2.5 py-1 rounded-full font-medium text-[11px] bg-temple-gold text-temple-deepWine font-bold shadow-sm';
  modeParayanamBtn.className = 'px-2.5 py-1 rounded-full font-medium text-[11px] text-temple-goldLight/70 hover:text-white';
  renderCurrentNama();
});

modeParayanamBtn.addEventListener('click', () => {
  currentMode = 'parayanam';
  modeParayanamBtn.className = 'px-2.5 py-1 rounded-full font-medium text-[11px] bg-temple-gold text-temple-deepWine font-bold shadow-sm';
  modeJapaBtn.className = 'px-2.5 py-1 rounded-full font-medium text-[11px] text-temple-goldLight/70 hover:text-white';
  renderCurrentNama();
});

// Language switch listeners
langTeluguBtn.addEventListener('click', () => applyLanguage('te'));
langEnglishBtn.addEventListener('click', () => applyLanguage('en'));

// Bell mute/unmute
if (elBellBtn) elBellBtn.addEventListener('click', toggleBellMute);

// Shankham sound trigger
if (elShankhBtn) {
  elShankhBtn.addEventListener('click', () => {
    playShankhamSound();
    triggerPetalShower(15);
  });
}

// Reset Mala button
document.getElementById('resetMalaBtn').addEventListener('click', () => {
  malaCounter = 1;
  currentIndex = 0;
  renderCurrentNama();
  triggerTactilePulse(true);
});

// Previous & Next navigation with circular wrapping
document.getElementById('prevNamaBtn').addEventListener('click', () => {
  const total = GOVINDA_NAMALU.length; // 132
  currentIndex = (currentIndex - 1 + total) % total;

  if (malaCounter <= 1) {
    malaCounter = total;
  } else {
    malaCounter--;
  }

  renderCurrentNama();
  triggerTactilePulse(false);
  playTempleBell(1100);
});

document.getElementById('nextNamaBtn').addEventListener('click', () => {
  const total = GOVINDA_NAMALU.length;
  currentIndex = (currentIndex + 1) % total;

  if (malaCounter >= total) {
    malaCounter = 1;
  } else {
    malaCounter++;
  }

  renderCurrentNama();
  triggerTactilePulse(false);
  playTempleBell(1100);
});

// Direct Chant Tap
document.getElementById('chantBeadBtn').addEventListener('click', handleChant);

// Auto Play Button
elAutoBtn.addEventListener('click', toggleAutoChant);

// Directory Drawer Controls
openDirectoryBtn.addEventListener('click', () => {
  populateDirectory();
  namasDrawer.classList.remove('translate-y-full');
});

closeDrawerBtn.addEventListener('click', () => {
  namasDrawer.classList.add('translate-y-full');
});

searchNamaInput.addEventListener('input', (e) => {
  populateDirectory(e.target.value);
});

// Keyboard controls
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
    e.preventDefault();
    handleChant();
  }
});

// Initial load
window.addEventListener('DOMContentLoaded', () => {
  renderCurrentNama();
  applyLanguage(currentLanguage);
});
