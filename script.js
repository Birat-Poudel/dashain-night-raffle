const winnerDisplay = document.getElementById('winnerDisplay');
const drawButton = document.getElementById('drawButton');
const resetButton = document.getElementById('resetButton');
const statusText = document.getElementById('statusText');
const startInput = document.getElementById('startNumber');
const endInput = document.getElementById('endNumber');
const confettiLayer = document.getElementById('confettiLayer');

let rollingInterval = null;

function getRange() {
  const start = Number(startInput.value);
  const end = Number(endInput.value);

  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    statusText.textContent = 'Please enter valid numbers.';
    statusText.style.color = '#f7d781';
    return null;
  }

  if (start === end) {
    statusText.textContent = 'Start and end numbers cannot be the same.';
    statusText.style.color = '#f7d781';
    return null;
  }

  return {
    start: Math.min(start, end),
    end: Math.max(start, end),
  };
}

function getRandomNumber(start, end) {
  return Math.floor(Math.random() * (end - start + 1)) + start;
}

function stopRolling() {
  if (rollingInterval) {
    clearInterval(rollingInterval);
    rollingInterval = null;
  }
}

function launchConfetti() {
  const colors = ['#f7d781', '#ef5a45', '#fff4df', '#f1b54e'];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pieceCount = prefersReducedMotion ? 36 : 112;

  for (let i = 0; i < pieceCount; i += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    const fromLeft = i % 2 === 0;
    const burstX = (fromLeft ? 1 : -1) * (100 + Math.random() * 330);
    const burstY = -(window.innerHeight * (0.3 + Math.random() * 0.38));
    const driftX = burstX + (fromLeft ? 1 : -1) * (Math.random() * 230);
    const fallY = window.innerHeight * (0.55 + Math.random() * 0.45);
    const spin = (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 720);

    piece.style.left = fromLeft ? '8%' : '92%';
    piece.style.top = `${window.innerHeight * (0.67 + Math.random() * 0.16)}px`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty('--burst-x', `${burstX}px`);
    piece.style.setProperty('--burst-y', `${burstY}px`);
    piece.style.setProperty('--drift-x', `${driftX}px`);
    piece.style.setProperty('--fall-y', `${fallY}px`);
    piece.style.setProperty('--spin-early', `${spin * 0.2}deg`);
    piece.style.setProperty('--spin-middle', `${spin * 0.55}deg`);
    piece.style.setProperty('--spin-late', `${spin * 0.8}deg`);
    piece.style.setProperty('--spin', `${spin}deg`);
    piece.style.setProperty('--duration', `${prefersReducedMotion ? 2.2 : 3.6 + Math.random() * 1.8}s`);
    piece.style.setProperty('--delay', `${Math.random() * 0.45}s`);
    piece.style.setProperty('--piece-width', `${6 + Math.random() * 6}px`);
    piece.style.setProperty('--piece-height', `${10 + Math.random() * 10}px`);
    if (Math.random() > 0.72) {
      piece.classList.add('confetti-ribbon');
    }
    confettiLayer.appendChild(piece);

    setTimeout(() => {
      piece.remove();
    }, 6500);
  }
}

function animateDraw() {
  const range = getRange();

  if (!range) {
    return;
  }

  stopRolling();
  let counter = 0;

  rollingInterval = setInterval(() => {
    const currentValue = getRandomNumber(range.start, range.end);
    winnerDisplay.textContent = currentValue;
    counter += 1;

    if (counter >= 20) {
      const finalNumber = getRandomNumber(range.start, range.end);
      winnerDisplay.textContent = finalNumber;
      statusText.textContent = `Winner: ${finalNumber}! Congratulations!`;
      statusText.style.color = '#f7d781';
      launchConfetti();
      stopRolling();
      drawButton.disabled = true;
      drawButton.style.opacity = '0.7';
    }
  }, 80);
}

function resetDraw() {
  stopRolling();
  winnerDisplay.textContent = '--';
  statusText.textContent = 'Press the button to reveal tonight’s lucky number.';
  statusText.style.color = 'rgba(255, 244, 223, 0.82)';
  drawButton.disabled = false;
  drawButton.style.opacity = '1';
  confettiLayer.innerHTML = '';
}

drawButton.addEventListener('click', animateDraw);
resetButton.addEventListener('click', resetDraw);
