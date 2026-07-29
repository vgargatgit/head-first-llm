(() => {
  'use strict';

  const TOTAL_STAGES = 11;

  function shapeLabel(item) {
    if (Array.isArray(item.shape)) return item.shape.join(' × ');
    return item.shapeLabel || '';
  }

  function normaliseItem(item) {
    return {
      id: item.id,
      label: item.label,
      kind: item.ledgerKey ? 'tensor' : 'concept',
      shape: shapeLabel(item)
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

  function createObjectList(items) {
    const list = element('ul', 'workbook-object-list');

    items.forEach(item => {
      const row = element('li', `workbook-object is-${item.kind}`);
      const name = element(item.kind === 'tensor' ? 'code' : 'span', 'workbook-object-name', item.label);
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

  function createHandoff(label, text, className) {
    const group = element('div', `workbook-handoff-item ${className}`);
    group.append(element('dt', 'workbook-handoff-label', label));
    group.append(element('dd', 'workbook-handoff-text', text));
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
    operation.append(document.createTextNode(model.operation));
    card.append(operation);

    const handoff = element('dl', 'workbook-handoff');
    handoff.append(createHandoff('Checkpoint', model.checkpoint, 'workbook-checkpoint'));
    handoff.append(createHandoff('Next question', model.nextQuestion, 'workbook-next-question'));
    card.append(handoff);

    return card;
  }

  function injectWorkbookCard() {
    const article = document.getElementById('chapter');
    if (!article || article.hidden || article.dataset.workbookCard === 'ready') return;

    const params = new URLSearchParams(window.location.search);
    const chapterNumber = Number(params.get('chapter') || 1);
    const model = buildModel(window.BOOK_DATA, chapterNumber);

    if (!model) {
      article.dataset.workbookCard = 'absent';
      return;
    }

    const title = article.querySelector('h1');
    const card = createCard(model);
    if (title) title.insertAdjacentElement('afterend', card);
    else article.prepend(card);
    article.dataset.workbookCard = 'ready';
  }

  window.WORKBOOK_CARD = Object.freeze({ buildModel });

  const article = document.getElementById('chapter');
  if (!article) return;

  const observer = new MutationObserver(injectWorkbookCard);
  observer.observe(article, {
    childList: true,
    attributes: true,
    attributeFilter: ['hidden']
  });
  injectWorkbookCard();
})();
