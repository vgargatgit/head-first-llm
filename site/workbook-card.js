(() => {
  'use strict';

  const TOTAL_STAGES = 11;
  const TENSOR_TEX = Object.freeze({
    X: 'X',
    WQ1: 'W^Q_1',
    Q1: 'Q_1',
    WK1: 'W^K_1',
    K1: 'K_1',
    S1: 'S_1',
    scaledS1: '\\frac{S_1}{\\sqrt{d_k}}',
    M: 'M',
    L1: 'L_1',
    A1: 'A_1',
    WV1: 'W^V_1',
    V1: 'V_1',
    Z1: 'Z_1',
    WQ2: 'W^Q_2',
    WK2: 'W^K_2',
    WV2: 'W^V_2',
    Q2: 'Q_2',
    K2: 'K_2',
    V2: 'V_2',
    A2: 'A_2',
    Z2: 'Z_2',
    H: 'H',
    WO: 'W^O',
    Y: 'Y',
    R1: 'R_1',
    N: 'N',
    W1: 'W_1',
    b1: 'b_1',
    Pmlp: 'P_{\\mathrm{MLP}}',
    U: 'U',
    W2: 'W_2',
    b2: 'b_2',
    F: 'F',
    R2: 'R_2',
    O: 'O = X^{(1)}',
    Epos: 'E_{\\mathrm{pos}}',
    Ppos: 'P_{\\mathrm{pos}}',
    xSat2: 'x_{\\mathrm{SAT}}^{(2)}',
    xSat3: 'x_{\\mathrm{SAT}}^{(3)}',
    hFinalSat: '\\widetilde{h}_{\\mathrm{SAT}}',
    Wvocab: 'W_{\\mathrm{vocab}}',
    bvocab: 'b_{\\mathrm{vocab}}',
    logitsSat: '\\ell_{\\mathrm{SAT}}',
    probabilitiesSat: 'p_{\\mathrm{SAT}}'
  });

  const COPY_OVERRIDES = Object.freeze({
    2: {
      operation: [
        "Project every hidden-state row into Head 1's Query space: ",
        { tex: 'Q_1 = XW^Q_1', label: 'Q one equals X times W Q one' },
        '.'
      ]
    },
    3: {
      operation: [
        "Project every hidden-state row into Head 1's Key space: ",
        { tex: 'K_1 = XW^K_1', label: 'K one equals X times W K one' },
        '.'
      ]
    },
    4: {
      checkpoint: [
        { tex: 'A_1', label: 'A one' },
        ' contains one causal attention distribution for every token position.'
      ]
    },
    5: {
      operation: [
        'Create Value payloads and combine them using the attention weights: ',
        { tex: 'Z_1 = A_1V_1', label: 'Z one equals A one times V one' },
        '.'
      ]
    },
    7: {
      operation: [
        'Mix the head features with ',
        { tex: 'W^O', label: 'W O' },
        ', add the input residual, and normalise each token row.'
      ],
      checkpoint: [
        { tex: 'N', label: 'N' },
        ' is the normalised attention-sublayer output in model space.'
      ]
    },
    8: {
      checkpoint: [
        { tex: 'O', label: 'O' },
        ' is the completed first-block state and remains ',
        { tex: '3 \\times 4', label: '3 by 4' },
        '.'
      ]
    },
    9: {
      operation: [
        'Unpack one additive example, ',
        { tex: 'E_{\\mathrm{pos}} + P_{\\mathrm{pos}} = X', label: 'E position plus P position equals X' },
        ', then compare other position mechanisms.'
      ],
      checkpoint: [
        { tex: 'X', label: 'X' },
        ' was prepared before the block; different architectures make position available differently.'
      ]
    }
  });

  function shapeLabel(item) {
    if (Array.isArray(item.shape)) return item.shape.join(' × ');
    return item.shapeLabel || '';
  }

  function normaliseItem(item) {
    const tex = item.ledgerKey ? TENSOR_TEX[item.ledgerKey] : '';
    if (item.ledgerKey && !tex) {
      throw new Error(`Workbook tensor ${item.ledgerKey} has no TeX display mapping.`);
    }

    return {
      id: item.id,
      label: item.label,
      kind: item.ledgerKey ? 'tensor' : 'concept',
      shape: shapeLabel(item),
      tex
    };
  }

  function buildModel(bookData, chapterNumber) {
    const stage = bookData?.getWorkbookStage?.(chapterNumber);
    if (!stage) return null;

    const progress = Array.from({ length: TOTAL_STAGES }, (_, index) => {
      const number = index + 1;
      const progressStage = bookData.getWorkbookStage(number);
      return {
        number,
        name: progressStage?.name || `Stage ${number}`,
        state: number < stage.number ? 'complete' : number === stage.number ? 'current' : 'upcoming'
      };
    });

    return {
      chapterNumber,
      stageNumber: stage.number,
      stageName: stage.name,
      totalStages: TOTAL_STAGES,
      available: stage.available.map(normaliseItem),
      creates: stage.creates.map(normaliseItem),
      operation: stage.operation,
      checkpoint: stage.checkpoint,
      nextQuestion: stage.nextQuestion,
      detailHref: stage.detailAnchor,
      progress
    };
  }

  function element(tagName, className, text) {
    const node = document.createElement(tagName);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function chapterUrl(number) {
    const params = new URLSearchParams(window.location.search);
    const version = params.get('v');
    return `chapter.html?chapter=${number}${version ? `&v=${encodeURIComponent(version)}` : ''}`;
  }

  function createProgress(model) {
    const list = element('ol', 'workbook-progress');
    list.setAttribute('aria-label', `Inference workbook progress: stage ${model.stageNumber} of ${model.totalStages}`);

    model.progress.forEach(stage => {
      const item = element('li', `workbook-progress-item is-${stage.state}`);
      const label = `Stage ${stage.number}: ${stage.name}`;
      let marker;

      if (stage.state === 'current') {
        marker = element('span', 'workbook-progress-marker', String(stage.number));
        marker.setAttribute('aria-current', 'step');
      } else {
        marker = element('a', 'workbook-progress-marker', String(stage.number));
        marker.href = chapterUrl(stage.number);
      }

      marker.setAttribute('aria-label', label);
      marker.title = label;
      item.append(marker);
      list.append(item);
    });

    return list;
  }

  function createMathSpan(tex, label, className = 'workbook-inline-math') {
    const node = element('span', className, `\\(${tex}\\)`);
    node.setAttribute('aria-label', label || tex);
    return node;
  }

  function createObjectList(items) {
    const list = element('ul', 'workbook-object-list');

    items.forEach(item => {
      const row = element('li', `workbook-object is-${item.kind}`);
      const name = item.kind === 'tensor'
        ? createMathSpan(item.tex, item.label, 'workbook-object-name is-math')
        : element('span', 'workbook-object-name', item.label);
      row.append(name);

      if (item.shape) {
        row.append(element('span', 'workbook-object-shape', item.shape));
      }

      list.append(row);
    });

    return list;
  }

  function createObjectPanel(className, title, items) {
    const panel = element('section', `workbook-panel ${className}`);
    panel.append(element('h3', 'workbook-panel-title', title));
    panel.append(createObjectList(items));
    return panel;
  }

  function appendCopy(target, model, field) {
    const parts = COPY_OVERRIDES[model.stageNumber]?.[field] || [model[field]];
    parts.forEach(part => {
      if (typeof part === 'string') {
        target.append(document.createTextNode(part));
      } else {
        target.append(createMathSpan(part.tex, part.label));
      }
    });
  }

  function createHandoff(label, model, field, className) {
    const group = element('div', `workbook-handoff-item ${className}`);
    group.append(element('dt', 'workbook-handoff-label', label));
    const description = element('dd', 'workbook-handoff-text');
    appendCopy(description, model, field);
    group.append(description);
    return group;
  }

  function createCard(model) {
    const card = element('section', 'workbook-card');
    const titleId = `workbook-stage-${model.stageNumber}`;
    card.setAttribute('aria-labelledby', titleId);
    card.dataset.stage = String(model.stageNumber);

    const header = element('header', 'workbook-card-header');
    const headingGroup = element('div', 'workbook-heading-group');
    headingGroup.append(element('p', 'workbook-eyebrow', 'TRANSFORMER WORKBOOK'));
    const title = element(
      'h2',
      'workbook-title',
      `Stage ${model.stageNumber} of ${model.totalStages} — ${model.stageName}`
    );
    title.id = titleId;
    headingGroup.append(title);
    header.append(headingGroup);

    const detailLink = element('a', 'workbook-detail-link', 'Jump to the detailed calculation ↓');
    detailLink.href = model.detailHref;
    header.append(detailLink);
    card.append(header);
    card.append(createProgress(model));

    const objectGrid = element('div', 'workbook-object-grid');
    objectGrid.append(createObjectPanel('workbook-available', 'Already available', model.available));
    objectGrid.append(createObjectPanel('workbook-creates', 'Created or made explicit here', model.creates));
    card.append(objectGrid);

    const operation = element('p', 'workbook-operation');
    operation.append(element('strong', '', 'Operation: '));
    appendCopy(operation, model, 'operation');
    card.append(operation);

    const handoff = element('dl', 'workbook-handoff');
    handoff.append(createHandoff('Checkpoint', model, 'checkpoint', 'workbook-checkpoint'));
    handoff.append(createHandoff('Next question', model, 'nextQuestion', 'workbook-next-question'));
    card.append(handoff);

    return card;
  }

  async function typesetCard(card) {
    try {
      if (window.MathJax?.startup?.promise) await window.MathJax.startup.promise;
      if (window.MathJax?.typesetPromise) {
        await window.MathJax.typesetPromise([card]);
        card.classList.add('is-typeset');
      }
    } catch (error) {
      console.error('MathJax could not typeset the Transformer Workbook card.', error);
    }
  }

  function injectWorkbookCard() {
    const article = document.getElementById('chapter');
    if (!article || article.dataset.workbookCard === 'ready' || article.dataset.workbookCard === 'absent') return;

    const title = article.querySelector('h1');
    if (!title && !article.firstElementChild) return;

    const params = new URLSearchParams(window.location.search);
    const chapterNumber = Number(params.get('chapter') || 1);
    const model = buildModel(window.BOOK_DATA, chapterNumber);

    if (!model) {
      article.dataset.workbookCard = 'absent';
      return;
    }

    const card = createCard(model);
    if (title) title.insertAdjacentElement('afterend', card);
    else article.prepend(card);
    article.dataset.workbookCard = 'ready';
    void typesetCard(card);
  }

  window.WORKBOOK_CARD = Object.freeze({
    buildModel,
    inject: injectWorkbookCard
  });

  const article = document.getElementById('chapter');
  if (!article) return;

  const observer = new MutationObserver(injectWorkbookCard);
  observer.observe(article, {
    childList: true,
    attributes: true,
    attributeFilter: ['hidden']
  });
  document.addEventListener('DOMContentLoaded', injectWorkbookCard, { once: true });
  injectWorkbookCard();
})();