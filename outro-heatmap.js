(() => {
  const scene = document.querySelector('.scene[data-scene="6"]');
  if (!scene || scene.querySelector('.outro-heatmap')) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

  const style = document.createElement('style');
  style.dataset.outroHeatmap = 'true';
  style.textContent = `
    .scene[data-scene="6"] .intro-grid{opacity:0}
    .scene[data-scene="6"]{background:#090a0c}
    .scene[data-scene="6"] .scene-shade{pointer-events:none}
    .outro-heatmap{
      position:absolute;
      z-index:4;
      left:50%;
      top:50%;
      width:min(92vw,1280px);
      transform:translate(-50%,-50%);
      pointer-events:none;
      opacity:.82;
      mask-image:linear-gradient(90deg,transparent 0,#000 7%,#000 93%,transparent 100%);
      -webkit-mask-image:linear-gradient(90deg,transparent 0,#000 7%,#000 93%,transparent 100%)
    }
    .outro-heatmap-grid{
      display:grid;
      grid-template-rows:repeat(7,1fr);
      grid-auto-flow:column;
      grid-auto-columns:1fr;
      gap:clamp(4px,.48vw,7px);
      width:100%
    }
    .outro-heatmap-cell{
      aspect-ratio:1;
      min-width:0;
      border:1px solid rgba(255,255,255,.04);
      border-radius:clamp(2px,.28vw,4px);
      background:rgb(16,20,17);
      box-shadow:inset 0 1px 0 rgba(255,255,255,.018);
      will-change:background-color,border-color,box-shadow
    }
    @media(max-width:760px){
      .outro-heatmap{width:112vw;top:38%;opacity:.7}
      .outro-heatmap-grid{gap:4px}
    }
    @media(prefers-reduced-motion:reduce){
      .outro-heatmap{z-index:2;opacity:.5}
      .outro-heatmap-cell{background:rgb(16,20,17)!important;border-color:rgba(255,255,255,.035)!important;box-shadow:none!important}
    }
  `;
  document.head.appendChild(style);

  const heatmap = document.createElement('div');
  heatmap.className = 'outro-heatmap';
  heatmap.setAttribute('aria-hidden', 'true');
  const grid = document.createElement('div');
  grid.className = 'outro-heatmap-grid';
  heatmap.appendChild(grid);

  const content = scene.querySelector('.scene-content');
  scene.insertBefore(heatmap, content || null);

  const rows = 7;
  let columns = 0;
  let cells = [];
  let activeRow = -1;
  let activeCol = -1;
  let activeSince = 0;
  let lastFrame = performance.now();
  let raf = 0;

  let sceneWasVisible = false;
  let entryPlayed = false;
  let entryPendingAt = 0;
  let entryReleaseAt = 0;
  let entryPulseActive = false;
  let pointerMovedInScene = false;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const mix = (a, b, t) => Math.round(a + (b - a) * t);

  function columnCount() {
    if (window.innerWidth < 600) return 24;
    if (window.innerWidth < 980) return 38;
    return 52;
  }

  function buildGrid() {
    const nextColumns = columnCount();
    if (nextColumns === columns && cells.length) return;

    columns = nextColumns;
    grid.replaceChildren();
    cells = [];

    for (let col = 0; col < columns; col++) {
      for (let row = 0; row < rows; row++) {
        const node = document.createElement('span');
        node.className = 'outro-heatmap-cell';
        node.dataset.row = String(row);
        node.dataset.col = String(col);
        grid.appendChild(node);
        cells.push({ node, row, col, energy: 0, rendered: -1 });
      }
    }

    activeRow = -1;
    activeCol = -1;
  }

  function activateCell(row, col, now = performance.now()) {
    if (row === activeRow && col === activeCol) return;
    activeRow = row;
    activeCol = col;
    activeSince = now;
  }

  function sceneOpacity() {
    return Number.parseFloat(scene.style.opacity || getComputedStyle(scene).opacity || '0');
  }

  function nearestCellFromPointer(event) {
    const rect = grid.getBoundingClientRect();
    const computed = getComputedStyle(grid);
    const gap = parseFloat(computed.columnGap) || 0;
    const cellWidth = (rect.width - gap * (columns - 1)) / columns;
    const cellHeight = (rect.height - gap * (rows - 1)) / rows;

    const x = clamp(event.clientX - rect.left, cellWidth / 2, rect.width - cellWidth / 2);
    const y = clamp(event.clientY - rect.top, cellHeight / 2, rect.height - cellHeight / 2);
    const col = clamp(
      Math.round((x - cellWidth / 2) / Math.max(1, cellWidth + gap)),
      0,
      columns - 1
    );
    const row = clamp(
      Math.round((y - cellHeight / 2) / Math.max(1, cellHeight + gap)),
      0,
      rows - 1
    );

    return { row, col };
  }

  function setActiveFromPointer(event) {
    if (reduced || coarsePointer || sceneOpacity() < .18) return;

    const sceneRect = scene.getBoundingClientRect();
    const insideScene =
      event.clientX >= sceneRect.left &&
      event.clientX <= sceneRect.right &&
      event.clientY >= sceneRect.top &&
      event.clientY <= sceneRect.bottom;

    if (!insideScene) {
      activeRow = -1;
      activeCol = -1;
      return;
    }

    pointerMovedInScene = true;
    if (entryPendingAt) {
      entryPendingAt = 0;
      entryPlayed = true;
    }
    if (entryPulseActive) {
      entryPulseActive = false;
      entryReleaseAt = 0;
    }

    const nearest = nearestCellFromPointer(event);
    activateCell(nearest.row, nearest.col);
  }

  function colorFor(energy) {
    const e = clamp(energy);
    const base = [16, 20, 17];
    const low = [27, 78, 39];
    const mid = [46, 145, 67];
    const bright = [151, 243, 166];

    if (e <= .34) {
      const t = e / .34;
      return [mix(base[0], low[0], t), mix(base[1], low[1], t), mix(base[2], low[2], t)];
    }

    if (e <= .7) {
      const t = (e - .34) / .36;
      return [mix(low[0], mid[0], t), mix(low[1], mid[1], t), mix(low[2], mid[2], t)];
    }

    const t = (e - .7) / .3;
    return [mix(mid[0], bright[0], t), mix(mid[1], bright[1], t), mix(mid[2], bright[2], t)];
  }

  function updateEntryDiscovery(now) {
    const visible = sceneOpacity() >= .55;

    if (visible && !sceneWasVisible) {
      pointerMovedInScene = false;
      if (!entryPlayed) entryPendingAt = now + 420;
    }

    if (!visible && sceneWasVisible) {
      entryPendingAt = 0;
      entryReleaseAt = 0;
      entryPulseActive = false;
      if (!pointerMovedInScene) {
        activeRow = -1;
        activeCol = -1;
      }
    }

    sceneWasVisible = visible;

    if (visible && entryPendingAt && !pointerMovedInScene && now >= entryPendingAt) {
      entryPendingAt = 0;
      entryPlayed = true;
      entryPulseActive = true;
      entryReleaseAt = now + 880;
      activateCell(Math.floor(rows / 2), Math.round(columns * .68), now);
    }

    if (entryPulseActive && now >= entryReleaseAt) {
      entryPulseActive = false;
      entryReleaseAt = 0;
      activeRow = -1;
      activeCol = -1;
    }
  }

  function render(now) {
    const dt = Math.min(40, now - lastFrame);
    lastFrame = now;
    updateEntryDiscovery(now);

    const hasActive = activeRow >= 0 && activeCol >= 0;
    const elapsed = hasActive ? now - activeSince : 0;
    const waveRadius = .45 + elapsed / 28;

    cells.forEach(cell => {
      let target = 0;
      if (hasActive) {
        const dx = (cell.col - activeCol) * .9;
        const dy = cell.row - activeRow;
        const distance = Math.hypot(dx, dy);

        if (distance <= waveRadius) {
          const falloff = clamp(1 - distance / 4.8);
          target = Math.pow(falloff, 1.55);
          if (distance < .56) target = 1;
        }
      }

      const rising = target > cell.energy;
      const speed = rising ? Math.min(1, dt / 68) : Math.min(1, dt / 290);
      cell.energy += (target - cell.energy) * speed;
      if (!hasActive && cell.energy < .006) cell.energy = 0;

      const quantized = Math.round(cell.energy * 100) / 100;
      if (quantized === cell.rendered) return;
      cell.rendered = quantized;

      const [r, g, b] = colorFor(quantized);
      cell.node.style.backgroundColor = `rgb(${r},${g},${b})`;
      cell.node.style.borderColor = `rgba(156,241,170,${.04 + quantized * .18})`;
      cell.node.style.boxShadow = quantized > .68
        ? `0 0 ${4 + quantized * 10}px rgba(92,221,119,${(quantized - .68) * .4}),inset 0 1px 0 rgba(255,255,255,.09)`
        : 'inset 0 1px 0 rgba(255,255,255,.018)';
    });

    raf = requestAnimationFrame(render);
  }

  buildGrid();

  if (!reduced && !coarsePointer) {
    window.addEventListener('pointermove', setActiveFromPointer, { passive: true });
    window.addEventListener('resize', buildGrid, { passive: true });
    raf = requestAnimationFrame(render);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else {
        lastFrame = performance.now();
        raf = requestAnimationFrame(render);
      }
    });
  }
})();
