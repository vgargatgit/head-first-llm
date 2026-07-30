# Chapter 21 Graphics Scene Plan

## Chapter

**Chapter 21 — Open Book, Closed Book, or Tool Belt?**  
**Subtitle:** Parametric memory, prompts, retrieval-augmented generation, citations, external memory, and tools

## Status

This document is the canonical production specification for all Chapter 21 graphics. Final artwork belongs under `assets/chapter-21/`.

---

# 1. Chapter visual objective

Trace evidence and actions through weights, prompt context, retrieval, and external tools.

```text
weights -> broad statistical support
prompt  -> temporary supplied context
RAG     -> external evidence
tools   -> external computation or action
```

Central lesson:

> Reliable applications keep information sources and execution authority separate, preserve provenance, and evaluate retrieval, generation, citations, and tool safety independently.

---

# 2. Style and continuity locks

- Use one exam desk with four clearly distinct support mechanisms.
- Retrieved text always carries immutable source IDs and access labels.
- Similarity means ranking, never truth.
- Retrieved content is visually boxed as untrusted data, not instructions.
- Tool requests are proposals until validated by the application.
- Read tools and write tools use different risk colours and controls.
- The handoff introduces Chapter 22’s image and audio inputs.

---

# 3. Reusable design elements

## Exam candidate

The deployed language model producing the final response.

## Retrieval Librarian

Chunks, indexes, filters, ranks, and supplies passages; distinct from the training Data Librarian.

## Provenance ledger

Records passage IDs, citations, tool calls, results, permissions, and final claims.

## Execution gatekeeper

Validates tool schema, authority, arguments, confirmation, and consequences.

---

# 4. Scene inventory

The planned Chapter 21 set contains **11 artwork files**.

## Scene 01 — Chapter hero: four ways to support an answer

**Asset:** `assets/chapter-21/01_chapter_hero_four_support_sources.png`  
**Placement:** Chapter opening.  
**Learning objective:** Introduce closed book, notes, open book, and tool belt.

**Composition:** One model sits an exam with four lanes: sealed parameter memory, temporary prompt notes, retrieved source book, and a tool request routed through an application proctor.

**Alt text draft:** A language model can answer from parameter patterns, supplied prompt notes, retrieved evidence, or validated external tool results.

## Scene 02 — Parametric memory versus context

**Asset:** `assets/chapter-21/02_parametric_memory_vs_context.png`  
**Placement:** Across the first two sections.  
**Learning objective:** Contrast distributed weight memory with temporary working context.

**Composition:** A fact influences many connected parameter knobs with no neat provenance row; a removable context tray holds explicit supplied facts and disappears after the request.

**Do not show:** precise database records inside weights or prompt facts persisting automatically.  
**Alt text draft:** Parametric memory is distributed and hard to trace, while prompt context is explicit working memory available only for the current request.

## Scene 03 — End-to-end RAG pipeline

**Asset:** `assets/chapter-21/03_rag_preparation_and_question_pipeline.png`  
**Placement:** At “Retrieval-augmented generation.”  
**Learning objective:** Show offline document preparation and online question flow.

**Composition:** Top lane: parse, clean, structurally chunk, embed, and store text plus metadata. Bottom lane: represent query, retrieve, permission-filter, rerank, assemble context, generate, verify citations.

**Do not show:** a vector database feeding unchecked text directly to the model.  
**Alt text draft:** RAG prepares indexed chunks in advance, then retrieves, filters, reranks, and assembles evidence before answer generation and citation verification.

## Scene 04 — Chunk-size tradeoff

**Asset:** `assets/chapter-21/04_chunking_tradeoffs.png`  
**Placement:** Beside “Why split documents into chunks?”  
**Learning objective:** Explain precision versus preserved context.

**Composition:** A structured document is cut three ways. Tiny pieces lose definitions and table context; giant pieces contain distracting text; structure-aware chunks preserve headings, paragraphs, tables, and code blocks.

**Alt text draft:** Chunks that are too small lose context, chunks that are too large dilute relevance, and structure-aware boundaries balance meaning and retrieval precision.

## Scene 05 — Exact embedding similarity calculation

**Asset:** `assets/chapter-21/05_exact_retrieval_similarity.png`  
**Placement:** Beside the tiny retrieval calculation.  
**Learning objective:** Anchor dense retrieval in exact arithmetic and its limitation.

**Required values:** `q=[0.8,0.6]`; scores `d1=0.8`, `d2=0.96`, `d3=-0.28`; rank `d2` first.

**Composition:** Unit-vector arrows and coordinate dot products feed a ranking podium. A banner states `CLOSEST CANDIDATE ≠ VERIFIED ANSWER`.

**Alt text draft:** Dot products rank the second document first with similarity 0.96, but that ranking does not prove its contents are correct.

## Scene 06 — Hybrid retrieval and staged reranking

**Asset:** `assets/chapter-21/06_hybrid_retrieval_reranking.png`  
**Placement:** Across dense, lexical, hybrid, and ranking sections.  
**Learning objective:** Show complementary retrieval signals and narrowing stages.

**Composition:** Keyword and embedding lanes merge; top 100 pass through metadata and permission filters to 30, a reranker selects 8, and deduplication builds the final context.

**Do not show:** filters after protected text reaches the prompt.  
**Alt text draft:** Lexical and dense retrieval produce candidates that are permission-filtered, reranked, and deduplicated before prompt assembly.

## Scene 07 — Source-aware context and citation verification

**Asset:** `assets/chapter-21/07_context_assembly_and_citations.png`  
**Placement:** Across context assembly and citations.  
**Learning objective:** Separate citation validity from evidentiary support.

**Composition:** Source blocks have immutable IDs, title, date, and passage. Generated claims cite only supplied IDs; a validator checks that IDs exist, then an entailment inspector checks whether each passage supports its claim.

**Alt text draft:** Citation validation confirms a cited source was supplied, while a separate support check asks whether that source actually entails the associated claim.

## Scene 08 — Retrieval evaluation and query transformation

**Asset:** `assets/chapter-21/08_retrieval_evaluation_and_query_rewriting.png`  
**Placement:** Across evaluation, rewriting, and decomposition.  
**Learning objective:** Diagnose retrieval separately and preserve original intent.

**Composition:** A dashboard splits recall, precision, rank, permission filtering from correctness, groundedness, citation support, completeness, and abstention. A vague query is rewritten with conversation context while the original is retained; a complex query branches into subqueries.

**Alt text draft:** Retrieval and generation receive separate metrics, while rewritten and decomposed searches retain the original question for answering and audit.

## Scene 09 — External memory with ownership controls

**Asset:** `assets/chapter-21/09_external_memory_governance.png`  
**Placement:** At “External memory.”  
**Learning objective:** Treat application memory as governed stored data.

**Composition:** User preferences, task state, summaries, and conversation facts enter an external vault with owner, retention, correction, deletion, sensitivity, provenance, and relevance controls.

**Do not show:** automatic unlimited remembering.  
**Alt text draft:** External memory stores selected application facts under explicit ownership, retention, correction, deletion, sensitivity, relevance, and provenance controls.

## Scene 10 — Tool proposal, validation, and execution

**Asset:** `assets/chapter-21/10_tool_call_safety_pipeline.png`  
**Placement:** Across tool use, safety, and read/write tools.  
**Learning objective:** Locate authority outside the model.

**Composition:** Show the exact calculator request and `8661.84` result. The Execution Gatekeeper checks schema, user and tool permission, arguments, confirmation, reversibility, rate limits, exposure, and logging. Read tools use a green lane; write tools enter an orange confirmation chamber.

**Do not show:** the model directly transferring, deleting, booking, or sending.  
**Alt text draft:** A model proposes a structured calculator call, the application validates and executes it, and stronger confirmation protects tools that change the outside world.

## Scene 11 — Prompt-injection defence and multimodal handoff

**Asset:** `assets/chapter-21/11_prompt_injection_and_handoff.png`  
**Placement:** Across injection, combined architecture, mistakes, and “Coming next.”  
**Learning objective:** Treat retrieved instructions as untrusted and combine sources safely.

**Composition:** A malicious line inside a retrieved page is sealed in a `DATA, NOT AUTHORITY` box. Instruction hierarchy, access checks, restricted tools, confirmation, and output validation form independent barriers. The provenance ledger joins weights, system prompt, retrieval, and tools, then receives image and audio evidence at the next desk.

**Alt text draft:** Retrieved prompt-injection text remains untrusted data behind layered controls as the evidence system prepares to accept image and audio modalities.

---

# 5. Production checklist

- [ ] Similarity ranking is never presented as truth.
- [ ] Access control happens before protected text reaches model context.
- [ ] Source IDs survive retrieval, generation, and rendering.
- [ ] Citation validity and citation support are separate checks.
- [ ] Tool calls are untrusted proposals validated by the application.
- [ ] Write actions receive stronger confirmation and audit controls.

