(() => {
  'use strict';

  const parts = [
    { id: 'part-1', number: 1, numeral: 'I', title: 'Build One Transformer Block', summary: 'Follow token states through attention, residual paths, normalisation, and the position-wise MLP.', learningOutcome: 'Trace the complete data flow through one simplified decoder-style Transformer block.', chapterNumbers: [1, 2, 3, 4, 5, 6, 7, 8] },
    { id: 'part-2', number: 2, numeral: 'II', title: 'From Position to Prediction', summary: 'Add positional information, stack Transformer blocks, reuse KV caches, and generate the next token.', learningOutcome: 'Explain how a trained decoder-only Transformer turns an ordered token sequence into a next-token distribution.', chapterNumbers: [9, 10, 11] },
    { id: 'part-3', number: 3, numeral: 'III', title: 'How the Model Learns', summary: 'Create training targets and loss, propagate gradients, run large training jobs, and shape assistant behaviour.', learningOutcome: 'Connect one next-token error to parameter updates, distributed training, and post-training methods.', chapterNumbers: [12, 13, 14, 15, 16, 17] },
    { id: 'part-4', number: 4, numeral: 'IV', title: 'Transformer Families and Applications', summary: 'Compare Transformer families and extend the core model through cross-attention, adaptation, retrieval, tools, and other modalities.', learningOutcome: 'Choose and explain the architecture and adaptation pattern behind common language and multimodal systems.', chapterNumbers: [18, 19, 20, 21, 22] },
    { id: 'part-5', number: 5, numeral: 'V', title: 'Efficient and Trustworthy Systems', summary: 'Reduce serving cost and evaluate the capability, reliability, safety, and operational behaviour of the complete system.', learningOutcome: 'Reason about the trade-offs required to deploy and continuously evaluate an LLM system.', chapterNumbers: [23, 24] }
  ];

  const tensor = (ledgerKey, label, shape) => ({ id: ledgerKey, label, ledgerKey, shape });
  const concept = (id, label, shapeLabel = '') => ({ id, label, kind: 'concept', ...(shapeLabel ? { shapeLabel } : {}) });
  const slugifyHeading = heading => heading
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  const makeStage = (number, name, available, creates, operation, checkpoint, nextQuestion, detailHeading) => ({
    number,
    name,
    available,
    creates,
    operation,
    checkpoint,
    nextQuestion,
    detailHeading,
    detailAnchor: `#${slugifyHeading(detailHeading)}`
  });

  const stages = {
    1: makeStage(
      1,
      'Prepare Hidden States',
      [concept('sequence', 'THE CAT SAT', '3 tokens')],
      [tensor('X', 'X', [3, 4])],
      'Represent each token position with one prepared model-width hidden-state row.',
      'The sequence now has one 4-coordinate hidden state per token position.',
      'How does each token decide what to look for?',
      'One vector per token'
    ),
    2: makeStage(
      2,
      'Form Queries',
      [tensor('X', 'X', [3, 4]), tensor('WQ1', 'W^Q_1', [4, 2])],
      [tensor('Q1', 'Q_1', [3, 2])],
      "Project every hidden-state row into Head 1's Query space: Q_1 = XW^Q_1.",
      'Each token has a 2-coordinate search request for Head 1.',
      'How can other tokens advertise what they contain?',
      'One coach, many clients'
    ),
    3: makeStage(
      3,
      'Form Keys',
      [tensor('X', 'X', [3, 4]), tensor('WK1', 'W^K_1', [4, 2])],
      [tensor('K1', 'K_1', [3, 2])],
      "Project every hidden-state row into Head 1's Key space: K_1 = XW^K_1.",
      'Each token has a 2-coordinate searchable profile for Head 1.',
      'How are Queries and Keys turned into attention weights?',
      'One Profile Writer, many tokens'
    ),
    4: makeStage(
      4,
      'Score and Weight',
      [tensor('Q1', 'Q_1', [3, 2]), tensor('K1', 'K_1', [3, 2])],
      [
        tensor('S1', 'S_1', [3, 3]),
        tensor('scaledS1', 'S_1 / sqrt(d_k)', [3, 3]),
        tensor('M', 'M', [3, 3]),
        tensor('L1', 'L_1', [3, 3]),
        tensor('A1', 'A_1', [3, 3])
      ],
      'Compare Queries with Keys, scale, apply the causal mask, and run row-wise softmax.',
      'A_1 contains one causal attention distribution for every token position.',
      'What information flows through those weights?',
      'The complete attention-weight matrix'
    ),
    5: makeStage(
      5,
      'Retrieve Values',
      [tensor('X', 'X', [3, 4]), tensor('A1', 'A_1', [3, 3]), tensor('WV1', 'W^V_1', [4, 2])],
      [tensor('V1', 'V_1', [3, 2]), tensor('Z1', 'Z_1', [3, 2])],
      'Create Value payloads and combine them with the attention weights: Z_1 = A_1V_1.',
      'Head 1 returns one retrieved 2-coordinate result for every token.',
      'Why run more than one attention head?',
      'All weighted sums in one matrix multiplication'
    ),
    6: makeStage(
      6,
      'Run Multiple Heads',
      [
        tensor('X', 'X', [3, 4]),
        tensor('Z1', 'Z_1', [3, 2]),
        tensor('WQ2', 'W^Q_2', [4, 2]),
        tensor('WK2', 'W^K_2', [4, 2]),
        tensor('WV2', 'W^V_2', [4, 2])
      ],
      [
        tensor('Q2', 'Q_2', [3, 2]),
        tensor('K2', 'K_2', [3, 2]),
        tensor('V2', 'V_2', [3, 2]),
        tensor('A2', 'A_2', [3, 3]),
        tensor('Z2', 'Z_2', [3, 2]),
        tensor('H', 'H', [3, 4])
      ],
      'Run an independent second attention system, then concatenate both head outputs by feature.',
      'H preserves the three token rows while restoring a 4-coordinate feature width.',
      'How are the head reports combined with the residual stream?',
      'Put the two head outputs side by side'
    ),
    7: makeStage(
      7,
      'Mix and Normalise',
      [tensor('X', 'X', [3, 4]), tensor('H', 'H', [3, 4]), tensor('WO', 'W^O', [4, 4])],
      [tensor('Y', 'Y', [3, 4]), tensor('R1', 'R_1', [3, 4]), tensor('N', 'N', [3, 4])],
      'Mix head features with W^O, add the input residual, and normalise each token row.',
      'N is the normalised attention-sublayer output in model space.',
      'What does the position-wise MLP add?',
      'Normalise every token row'
    ),
    8: makeStage(
      8,
      'Transform Features',
      [
        tensor('N', 'N', [3, 4]),
        tensor('W1', 'W_1', [4, 6]),
        tensor('b1', 'b_1', [1, 6]),
        tensor('W2', 'W_2', [6, 4]),
        tensor('b2', 'b_2', [1, 4])
      ],
      [
        tensor('Pmlp', 'P_mlp', [3, 6]),
        tensor('U', 'U', [3, 6]),
        tensor('F', 'F', [3, 4]),
        tensor('R2', 'R_2', [3, 4]),
        tensor('O', 'O = X^(1)', [3, 4])
      ],
      'Expand, apply ReLU, contract, add the second residual, and normalise again.',
      'O is the completed first-block state and remains 3 x 4.',
      'How did positional information enter the prepared state?',
      'The second normalisation'
    ),
    9: makeStage(
      9,
      'Open the Position Box',
      [tensor('X', 'X', [3, 4]), tensor('Epos', 'E_pos', [3, 4]), tensor('Ppos', 'P_pos', [3, 4])],
      [concept('position-methods', 'Explicit comparison of additive, sinusoidal, and rotary position mechanisms')],
      'Unpack one additive E_pos + P_pos = X example, then compare other position mechanisms.',
      'X was prepared before the block; different architectures make position available differently.',
      'How does the residual stream change across a deep stack?',
      'Unpacking one additive version of our running matrix'
    ),
    10: makeStage(
      10,
      'Climb the Stack',
      [tensor('O', 'X^(1)', [3, 4])],
      [
        tensor('xSat2', 'x_sat^(2)', [1, 4]),
        tensor('xSat3', 'x_sat^(3)', [1, 4]),
        tensor('hFinalSat', 'h_tilde_sat', [1, 4]),
        concept('per-layer-kv-cache', 'Per-layer Key and Value cache layout')
      ],
      'Apply illustrative later-block updates, then final normalisation before vocabulary projection.',
      'SAT ends with one final 4-coordinate hidden state ready for the language-model head.',
      'How does the final hidden state become a token distribution?',
      'The final normalisation'
    ),
    11: makeStage(
      11,
      'Project to Vocabulary',
      [
        tensor('hFinalSat', 'h_tilde_sat', [1, 4]),
        tensor('Wvocab', 'W_vocab', [4, 5]),
        tensor('bvocab', 'b_vocab', [1, 5])
      ],
      [
        tensor('logitsSat', 'ell_sat', [1, 5]),
        tensor('probabilitiesSat', 'p_sat', [1, 5]),
        concept('selected-token', 'Selected next token: .')
      ],
      'Project the final hidden state into vocabulary logits and apply vocabulary softmax.',
      'The five probabilities form the next-token distribution; greedy decoding selects the period token.',
      'How does training score the prediction against the next-token target?',
      'Softmax over the vocabulary'
    )
  };

  function makeChapter(number, title, navLabel, summary, partId, partPosition, options = {}) {
    return {
      number,
      title,
      navLabel,
      summary,
      source: `src/chapter-${String(number).padStart(2, '0')}.md`,
      partId,
      partPosition,
      stage: null,
      assetFrom: [],
      assetTo: '',
      assetAliases: {},
      artwork: [],
      ...options
    };
  }

  const chapters = [
    makeChapter(1, 'A Token Enters the Dating World', 'Context', 'Hidden states, context, and why a token needs attention.', 'part-1', 1, { stage: stages[1], assetFrom: ['chapter_1_graphics/', 'chapter-1-graphics/', '../assets/chapter-01/', '/assets/chapter-01/'], assetTo: 'assets/chapter-01/' }),
    makeChapter(2, 'Meet the Question Coach', 'Queries', 'How a token converts its current state into a Query.', 'part-1', 2, {
      stage: stages[2],
      assetFrom: ['chapter_2_graphics/', 'chapter-2-graphics/', '../assets/chapter-02/', '/assets/chapter-02/'],
      assetTo: 'assets/chapter-02/',
      assetAliases: {
        'assets/chapter-02/02_question_coach_story.png': 'assets/chapter-02/02_question_coach_pipeline.png',
        'assets/chapter-02/04_shared_coach.png': 'assets/chapter-02/04_shared_question_coach.png',
        'assets/chapter-02/06_handoff_to_keys.png': 'assets/chapter-02/07_handoff_to_keys.png'
      }
    }),
    makeChapter(3, 'Meet the Profile Writer', 'Keys', 'How every token creates a searchable Key.', 'part-1', 3, { stage: stages[3], assetFrom: ['chapter_3_graphics/', 'chapter-3-graphics/', '../assets/chapter-03/', '/assets/chapter-03/'], assetTo: 'assets/chapter-03/' }),
    makeChapter(4, 'When Queries Meet Keys', 'Attention', 'Dot products, scaling, causal masking, and row-wise softmax.', 'part-1', 4, { stage: stages[4], assetFrom: ['../assets/chapter-04/', '/assets/chapter-04/'], assetTo: 'assets/chapter-04/' }),
    makeChapter(5, 'Meet the Information Courier', 'Values', "How Values and attention weights create one head's output.", 'part-1', 5, { stage: stages[5], assetFrom: ['../assets/chapter-05/', '/assets/chapter-05/'], assetTo: 'assets/chapter-05/' }),
    makeChapter(6, 'Many Specialists at Work', 'Multi-head', 'How multiple attention heads learn different matching and retrieval systems.', 'part-1', 6, { stage: stages[6], assetFrom: ['../assets/chapter-06/', '/assets/chapter-06/'], assetTo: 'assets/chapter-06/' }),
    makeChapter(7, 'The Team Lead Combines the Reports', 'Residuals', 'Output projection, residual connections, LayerNorm, and pre-norm variants.', 'part-1', 7, { stage: stages[7], assetFrom: ['../assets/chapter-07/', '/assets/chapter-07/'], assetTo: 'assets/chapter-07/' }),
    makeChapter(8, 'The Private Thinking Room', 'MLP', 'How the position-wise MLP completes one Transformer block.', 'part-1', 8, { stage: stages[8] }),
    makeChapter(9, 'Every Token Needs an Address', 'Position', 'Absolute positions, sinusoidal encodings, and RoPE geometry.', 'part-2', 1, {
      stage: stages[9],
      assetFrom: ['../assets/chapter-09/', '/assets/chapter-09/'],
      assetTo: 'assets/chapter-09/'
    }),
    makeChapter(10, 'The Residual Stream Climbs the Stack', 'Deep stack', 'How deep blocks refine hidden states and maintain per-layer KV caches.', 'part-2', 2, {
      stage: stages[10],
      assetFrom: ['../assets/chapter-10/', '/assets/chapter-10/'],
      assetTo: 'assets/chapter-10/',
      artwork: [
        { placement: 'start', src: 'assets/chapter-10/01_the_transformer_tower_explained.png', alt: 'THE, CAT, and SAT enter a tower whose identically shaped floors have separate parameters and repeatedly refine same-width residual-stream case files.' },
        { afterHeading: 'One block is one refinement step', src: 'assets/chapter-10/02_one_floor_at_a_time_transformer_layer.png', alt: 'A three-by-four residual stream passes through attention, two residual additions, two LayerNorm operations, and an MLP, then exits with the same outer shape.' },
        { afterHeading: "SAT's evolving case file", src: 'assets/chapter-10/03_sat_state_evolution_cartoon_diagram.png', alt: 'SAT keeps the same token identity and four-coordinate width while exact numerical values change from stack input through Blocks 1, 2, and 3.' },
        { afterHeading: 'Every layer owns different parameters', src: 'assets/chapter-10/04_layers_and_parameters_explained_visually.png', alt: 'Two Transformer floors share an architectural plan but use separately learned attention, MLP, and LayerNorm parameters without guaranteed human-readable roles.' },
        { afterHeading: 'What repeated contextualisation buys the model', src: 'assets/chapter-10/05_context_grows_with_visible_tokens.png', alt: 'Later layers derive Queries, Keys, and Values from already contextualised states while SAT remains causally blocked from future tokens.' },
        { afterHeading: 'One KV cache per layer', src: 'assets/chapter-10/06_key_value_memory_in_neural_layers.png', alt: 'Every Transformer layer stores its own cached Key and Value vectors for previous token positions.' },
        { afterHeading: 'Generation processes one new position at a time', src: 'assets/chapter-10/07_decoding_with_cached_keys_and_values.png', alt: 'Prefill caches Keys and Values at every layer; decoding computes a new Query, Key, and Value, uses old and new cache entries, and appends the new Key and Value.' },
        { afterHeading: 'Why model depth costs memory and computation', src: 'assets/chapter-10/08_token_generation_growth_in_transformers.png', alt: 'The number of Transformer layers remains fixed while every layer’s Key and Value shelves lengthen with cached sequence positions.' },
        { afterHeading: 'The final hidden state is still not a token', src: 'assets/chapter-10/09_final_output_path_diagram_with_mascot.png', alt: 'SAT’s final state is normalised, projected into vocabulary logits, and passed through a separate vocabulary softmax to produce the Chapter 11 probability distribution.' },
        { afterHeading: 'Coming next: the final audition', src: 'assets/chapter-10/10_chapter_11_from_final_state_to_next_token.png', alt: 'Chapter 10 hands the final hidden state to Chapter 11 and the vocabulary head.' }
      ]
    }),
    makeChapter(11, 'The Final Audition', 'Prediction', 'Vocabulary logits, softmax, temperature, sampling, and next-token generation.', 'part-2', 3, { stage: stages[11] }),
    makeChapter(12, 'The Answer Key Moves One Step Ahead', 'Targets', 'Shifted labels, teacher forcing, masks, padding, and packed sequences.', 'part-3', 1),
    makeChapter(13, 'Meet the Scorekeeper', 'Loss', 'Negative log-likelihood, cross-entropy, masked means, and perplexity.', 'part-3', 2, {
      assetFrom: ['../assets/chapter-13/', '/assets/chapter-13/'],
      assetTo: 'assets/chapter-13/'
    }),
    makeChapter(14, 'The Blame Travels Backward', 'Backprop', 'Chain-rule gradients through the output head, blocks, attention, and optimiser updates.', 'part-3', 3),
    makeChapter(15, 'The Training Factory Never Sees the Whole Library', 'Training run', 'Effective batches, data mixtures, schedules, validation, and resumable checkpoints.', 'part-3', 4, {
      assetFrom: ['../assets/chapter-15/', '/assets/chapter-15/'],
      assetTo: 'assets/chapter-15/'
    }),
    makeChapter(16, 'The Model Outgrows One Machine', 'Scale', 'Data parallelism, state sharding, tensor parallelism, pipelines, and memory trade-offs.', 'part-3', 5, {
      assetFrom: ['../assets/chapter-16/', '/assets/chapter-16/'],
      assetTo: 'assets/chapter-16/'
    }),
    makeChapter(17, 'From Completion Machine to Helpful Assistant', 'Post-training', 'Supervised fine-tuning, preference optimisation, RLHF, DPO, and LoRA.', 'part-3', 6, {
      assetFrom: ['../assets/chapter-17/', '/assets/chapter-17/'],
      assetTo: 'assets/chapter-17/'
    }),
    makeChapter(18, 'Three Transformer Families Move In', 'Families', 'Encoder-only, decoder-only, and encoder–decoder models compared by information flow and real-world use.', 'part-4', 1, {
      assetFrom: ['../assets/chapter-18/', '/assets/chapter-18/'],
      assetTo: 'assets/chapter-18/'
    }),
    makeChapter(19, 'The Decoder Borrows the Encoder’s Notes', 'Cross-attention', 'A full cross-attention calculation from decoder Query to encoder-side retrieval.', 'part-4', 2, {
      assetFrom: ['../assets/chapter-19/', '/assets/chapter-19/'],
      assetTo: 'assets/chapter-19/'
    }),
    makeChapter(20, 'From Pretraining to Specialisation', 'Adaptation', 'Foundation models, base checkpoints, continued pretraining, tuning, adapters, and runtime conditioning.', 'part-4', 3, {
      assetFrom: ['../assets/chapter-20/', '/assets/chapter-20/'],
      assetTo: 'assets/chapter-20/'
    }),
    makeChapter(21, 'Open Book, Closed Book, or Tool Belt?', 'RAG & tools', 'Parametric memory, RAG, citations, external memory, and safe tool use.', 'part-4', 4, {
      assetFrom: ['../assets/chapter-21/', '/assets/chapter-21/'],
      assetTo: 'assets/chapter-21/'
    }),
    makeChapter(22, 'Pictures, Audio, and Other Modalities', 'Multimodality', 'Vision and audio encoders, projectors, cross-attention, and multimodal alignment.', 'part-4', 5, {
      assetFrom: ['../assets/chapter-22/', '/assets/chapter-22/'],
      assetTo: 'assets/chapter-22/'
    }),
    makeChapter(23, 'Smaller, Faster, Cheaper', 'Efficiency', 'Quantisation, distillation, MoE, batching, caching, and serving trade-offs.', 'part-5', 1, {
      assetFrom: ['../assets/chapter-23/', '/assets/chapter-23/'],
      assetTo: 'assets/chapter-23/'
    }),
    makeChapter(24, 'Trust, but Verify', 'Evaluation', 'Evaluation, calibration, hallucination, bias, privacy, safety, and production monitoring.', 'part-5', 2)
  ];

  function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.freeze(value);
    Object.values(value).forEach(deepFreeze);
    return value;
  }

  function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  function validateWorkbookItem(item, location, errors) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      errors.push(`${location} must be an object.`);
      return;
    }
    if (!isNonEmptyString(item.id) || !isNonEmptyString(item.label)) {
      errors.push(`${location} must define non-empty id and label strings.`);
    }
    if (item.ledgerKey !== undefined && !isNonEmptyString(item.ledgerKey)) {
      errors.push(`${location}.ledgerKey must be a non-empty string when present.`);
    }
    if (item.shape !== undefined && item.shape !== null) {
      if (!Array.isArray(item.shape) || item.shape.length === 0 || item.shape.some(size => !Number.isInteger(size) || size < 1)) {
        errors.push(`${location}.shape must be null or a non-empty array of positive integers.`);
      }
    }
    if (item.shapeLabel !== undefined && !isNonEmptyString(item.shapeLabel)) {
      errors.push(`${location}.shapeLabel must be a non-empty string when present.`);
    }
  }

  function validateWorkbookStage(stage, location, errors) {
    if (stage === null) return;
    if (!stage || typeof stage !== 'object' || Array.isArray(stage)) {
      errors.push(`${location} must be null or an object.`);
      return;
    }
    if (!Number.isInteger(stage.number) || stage.number < 1) errors.push(`${location}.number must be a positive integer.`);
    for (const field of ['name', 'operation', 'checkpoint', 'nextQuestion', 'detailHeading', 'detailAnchor']) {
      if (!isNonEmptyString(stage[field])) errors.push(`${location}.${field} must be a non-empty string.`);
    }
    for (const field of ['available', 'creates']) {
      if (!Array.isArray(stage[field])) {
        errors.push(`${location}.${field} must be an array.`);
      } else {
        stage[field].forEach((item, index) => validateWorkbookItem(item, `${location}.${field}[${index}]`, errors));
      }
    }
  }

  function validateBookData(rawParts, rawChapters) {
    const errors = [];
    const partIds = new Set();
    const partNumbers = new Set();

    rawParts.forEach((part, index) => {
      const location = `parts[${index}]`;
      if (!part || typeof part !== 'object') {
        errors.push(`${location} must be an object.`);
        return;
      }
      if (!part.id || typeof part.id !== 'string') errors.push(`${location}.id must be a non-empty string.`);
      if (partIds.has(part.id)) errors.push(`Duplicate part id: ${part.id}.`);
      partIds.add(part.id);
      if (!Number.isInteger(part.number) || part.number < 1) errors.push(`${location}.number must be a positive integer.`);
      if (partNumbers.has(part.number)) errors.push(`Duplicate part number: ${part.number}.`);
      partNumbers.add(part.number);
      if (!part.numeral || !part.title || !part.summary || !part.learningOutcome) errors.push(`${location} is missing numeral, title, summary, or learningOutcome.`);
      if (!Array.isArray(part.chapterNumbers) || part.chapterNumbers.length === 0) errors.push(`${location}.chapterNumbers must be a non-empty array.`);
    });

    const chapterNumbers = new Set();
    const sourcePaths = new Set();
    rawChapters.forEach((chapter, index) => {
      const location = `chapters[${index}]`;
      if (!chapter || typeof chapter !== 'object') {
        errors.push(`${location} must be an object.`);
        return;
      }
      if (!Number.isInteger(chapter.number) || chapter.number < 1) errors.push(`${location}.number must be a positive integer.`);
      if (chapterNumbers.has(chapter.number)) errors.push(`Duplicate chapter number: ${chapter.number}.`);
      chapterNumbers.add(chapter.number);
      if (!chapter.title || !chapter.navLabel || !chapter.summary || !chapter.source) errors.push(`${location} is missing title, navLabel, summary, or source.`);
      if (sourcePaths.has(chapter.source)) errors.push(`Duplicate chapter source: ${chapter.source}.`);
      sourcePaths.add(chapter.source);
      if (!partIds.has(chapter.partId)) errors.push(`${location}.partId does not reference a known part: ${chapter.partId}.`);
      if (!Number.isInteger(chapter.partPosition) || chapter.partPosition < 1) errors.push(`${location}.partPosition must be a positive integer.`);
      validateWorkbookStage(chapter.stage, `${location}.stage`, errors);
      if (!Array.isArray(chapter.assetFrom)) errors.push(`${location}.assetFrom must be an array.`);
      if (typeof chapter.assetTo !== 'string') errors.push(`${location}.assetTo must be a string.`);
      if (!chapter.assetAliases || typeof chapter.assetAliases !== 'object' || Array.isArray(chapter.assetAliases)) errors.push(`${location}.assetAliases must be an object.`);
      if (!Array.isArray(chapter.artwork)) errors.push(`${location}.artwork must be an array.`);
    });

    if (rawChapters.length !== 24) errors.push(`Expected 24 chapters but found ${rawChapters.length}.`);
    for (let number = 1; number <= rawChapters.length; number += 1) {
      if (!chapterNumbers.has(number)) errors.push(`Missing chapter number ${number}; chapter numbers must be contiguous.`);
    }

    rawParts.forEach(part => {
      if (!Array.isArray(part.chapterNumbers)) return;
      const actual = rawChapters.filter(chapter => chapter.partId === part.id).sort((left, right) => left.partPosition - right.partPosition);
      const actualNumbers = actual.map(chapter => chapter.number);
      if (actualNumbers.length !== part.chapterNumbers.length || actualNumbers.some((number, index) => number !== part.chapterNumbers[index])) {
        errors.push(`Part ${part.id} chapterNumbers do not match chapter part membership and positions.`);
      }
      actual.forEach((chapter, index) => {
        if (chapter.partPosition !== index + 1) errors.push(`Chapter ${chapter.number} has partPosition ${chapter.partPosition}; expected ${index + 1}.`);
      });
    });

    return errors;
  }

  const validationErrors = validateBookData(parts, chapters);
  if (validationErrors.length > 0) {
    console.error('BOOK_DATA validation failed:', validationErrors);
    window.BOOK_DATA = Object.freeze({
      valid: false,
      errors: Object.freeze([...validationErrors]),
      parts: Object.freeze([]),
      chapters: Object.freeze([]),
      getChapter: () => null,
      getPart: () => null,
      getPartForChapter: () => null,
      getPartChapters: () => Object.freeze([]),
      getPreviousChapter: () => null,
      getNextChapter: () => null,
      getWorkbookStage: () => null,
      getArtworkForChapter: () => Object.freeze([])
    });
    return;
  }

  deepFreeze(parts);
  deepFreeze(chapters);
  const chapterByNumber = new Map(chapters.map(chapter => [chapter.number, chapter]));
  const partById = new Map(parts.map(part => [part.id, part]));
  const parseChapterNumber = number => Number.isInteger(Number(number)) ? Number(number) : null;
  const getChapter = number => chapterByNumber.get(parseChapterNumber(number)) || null;
  const getPart = partId => typeof partId === 'string' ? partById.get(partId) || null : null;
  const getPartForChapter = number => {
    const chapter = getChapter(number);
    return chapter ? getPart(chapter.partId) : null;
  };
  const getPartChapters = partId => {
    const part = getPart(partId);
    return part ? Object.freeze(part.chapterNumbers.map(getChapter)) : Object.freeze([]);
  };
  const getPreviousChapter = number => {
    const parsed = parseChapterNumber(number);
    return parsed === null ? null : getChapter(parsed - 1);
  };
  const getNextChapter = number => {
    const parsed = parseChapterNumber(number);
    return parsed === null ? null : getChapter(parsed + 1);
  };
  const getWorkbookStage = number => getChapter(number)?.stage || null;
  const getArtworkForChapter = number => getChapter(number)?.artwork || Object.freeze([]);

  window.BOOK_DATA = Object.freeze({
    valid: true,
    errors: Object.freeze([]),
    parts,
    chapters,
    getChapter,
    getPart,
    getPartForChapter,
    getPartChapters,
    getPreviousChapter,
    getNextChapter,
    getWorkbookStage,
    getArtworkForChapter
  });
})();
