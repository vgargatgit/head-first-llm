# Automated manuscript and renderer audit
Audited 24 chapter files.
## High-confidence book-wide findings
- Found **103** custom callout blocks; **103** contain Markdown syntax inside raw HTML and are at risk of displaying literal `**`, `##`, lists, or equation delimiters.
- The reader strips YAML front matter but does not render its `title` or `subtitle`; chapters whose first H1 is “The question this chapter answers” open without the chapter name.
- Found **6** missing local image reference(s).
- Found **0** matrices with inconsistent row widths.

## Per-chapter static findings

### chapter-01.md — Chapter 1 — A Token Enters the Dating World
- Body lines: 511; explicit matrices: 5.
- **Review:** Front-matter chapter title is not emitted by the reader and the first H1 is a section heading; the rendered article therefore opens without its chapter title.
- **Review:** 5 raw HTML callout block(s) contain Markdown that Marked will not reliably parse.

### chapter-02.md — Chapter 2 — Meet the Question Coach
- Body lines: 711; explicit matrices: 13.
- **Review:** Front-matter chapter title is not emitted by the reader and the first H1 is a section heading; the rendered article therefore opens without its chapter title.
- **Review:** 6 raw HTML callout block(s) contain Markdown that Marked will not reliably parse.
- **Review:** Missing referenced image: `chapter_2_graphics/01_chapter_hero.png` (Chapter 2 — Meet the Question Coach).
- **Review:** Missing referenced image: `chapter_2_graphics/02_question_coach_story.png` (The Question Coach pipeline).
- **Review:** Missing referenced image: `chapter_2_graphics/03_exact_query_calculation.png` (Exact query calculation).
- **Review:** Missing referenced image: `chapter_2_graphics/04_shared_coach.png` (One shared Question Coach creates different token queries).
- **Review:** Missing referenced image: `chapter_2_graphics/05_different_heads.png` (Different heads employ different Question Coaches).
- **Review:** Missing referenced image: `chapter_2_graphics/06_handoff_to_keys.png` (SAT now has a query, but matching requires Keys).

### chapter-03.md — Chapter 3 — Meet the Profile Writer
- Body lines: 865; explicit matrices: 17.
- **Review:** Front-matter chapter title is not emitted by the reader and the first H1 is a section heading; the rendered article therefore opens without its chapter title.
- **Review:** 7 raw HTML callout block(s) contain Markdown that Marked will not reliably parse.

### chapter-04.md — Chapter 4 — When Queries Meet Keys
- Body lines: 824; explicit matrices: 16.
- **Review:** Front-matter chapter title is not emitted by the reader and the first H1 is a section heading; the rendered article therefore opens without its chapter title.
- **Review:** 6 raw HTML callout block(s) contain Markdown that Marked will not reliably parse.

### chapter-05.md — Chapter 5 — Meet the Information Courier
- Body lines: 1070; explicit matrices: 22.
- **Review:** Front-matter chapter title is not emitted by the reader and the first H1 is a section heading; the rendered article therefore opens without its chapter title.
- **Review:** 6 raw HTML callout block(s) contain Markdown that Marked will not reliably parse.

### chapter-06.md — Chapter 6 — Many Specialists at Work
- Body lines: 847; explicit matrices: 26.
- **Review:** Front-matter chapter title is not emitted by the reader and the first H1 is a section heading; the rendered article therefore opens without its chapter title.
- **Review:** 5 raw HTML callout block(s) contain Markdown that Marked will not reliably parse.

### chapter-07.md — Chapter 7 — The Team Lead Combines the Reports
- Body lines: 780; explicit matrices: 18.
- **Review:** Front-matter chapter title is not emitted by the reader and the first H1 is a section heading; the rendered article therefore opens without its chapter title.
- **Review:** 5 raw HTML callout block(s) contain Markdown that Marked will not reliably parse.

### chapter-08.md — Chapter 8 — The Private Thinking Room
- Body lines: 982; explicit matrices: 23.
- **Review:** Front-matter chapter title is not emitted by the reader and the first H1 is a section heading; the rendered article therefore opens without its chapter title.
- **Review:** 5 raw HTML callout block(s) contain Markdown that Marked will not reliably parse.

### chapter-09.md — Chapter 9 — Every Token Needs an Address
- Body lines: 863; explicit matrices: 22.
- **Review:** Front-matter chapter title is not emitted by the reader and the first H1 is a section heading; the rendered article therefore opens without its chapter title.
- **Review:** 7 raw HTML callout block(s) contain Markdown that Marked will not reliably parse.

### chapter-10.md — Chapter 10 — The Residual Stream Climbs the Stack
- Body lines: 904; explicit matrices: 19.
- **Review:** Front-matter chapter title is not emitted by the reader and the first H1 is a section heading; the rendered article therefore opens without its chapter title.
- **Review:** 6 raw HTML callout block(s) contain Markdown that Marked will not reliably parse.

### chapter-11.md — Chapter 11 — The Final Audition
- Body lines: 939; explicit matrices: 11.
- **Review:** Front-matter chapter title is not emitted by the reader and the first H1 is a section heading; the rendered article therefore opens without its chapter title.
- **Review:** 4 raw HTML callout block(s) contain Markdown that Marked will not reliably parse.

### chapter-12.md — Chapter 12 — The Answer Key Moves One Step Ahead
- Body lines: 559; explicit matrices: 0.
- **Review:** Front-matter chapter title is not emitted by the reader and the first H1 is a section heading; the rendered article therefore opens without its chapter title.
- **Review:** 5 raw HTML callout block(s) contain Markdown that Marked will not reliably parse.

### chapter-13.md — Chapter 13 — Meet the Scorekeeper
- Body lines: 601; explicit matrices: 3.
- **Review:** Front-matter chapter title is not emitted by the reader and the first H1 is a section heading; the rendered article therefore opens without its chapter title.
- **Review:** 4 raw HTML callout block(s) contain Markdown that Marked will not reliably parse.

### chapter-14.md — Chapter 14 — The Blame Travels Backward
- Body lines: 973; explicit matrices: 8.
- **Review:** Front-matter chapter title is not emitted by the reader and the first H1 is a section heading; the rendered article therefore opens without its chapter title.
- **Review:** 5 raw HTML callout block(s) contain Markdown that Marked will not reliably parse.

### chapter-15.md — Chapter 15 — The Training Factory Never Sees the Whole Library
- Body lines: 630; explicit matrices: 0.
- **Review:** Front-matter chapter title is not emitted by the reader and the first H1 is a section heading; the rendered article therefore opens without its chapter title.
- **Review:** 4 raw HTML callout block(s) contain Markdown that Marked will not reliably parse.

### chapter-16.md — Chapter 16 — The Model Outgrows One Machine
- Body lines: 675; explicit matrices: 9.
- **Review:** Front-matter chapter title is not emitted by the reader and the first H1 is a section heading; the rendered article therefore opens without its chapter title.
- **Review:** 3 raw HTML callout block(s) contain Markdown that Marked will not reliably parse.

### chapter-17.md — Chapter 17 — From Completion Machine to Helpful Assistant
- Body lines: 667; explicit matrices: 0.
- **Review:** Front-matter chapter title is not emitted by the reader and the first H1 is a section heading; the rendered article therefore opens without its chapter title.
- **Review:** 4 raw HTML callout block(s) contain Markdown that Marked will not reliably parse.

### chapter-18.md — Chapter 18 — Three Transformer Families Move In
- Body lines: 463; explicit matrices: 2.
- **Review:** Front-matter chapter title is not emitted by the reader and the first H1 is a section heading; the rendered article therefore opens without its chapter title.
- **Review:** 3 raw HTML callout block(s) contain Markdown that Marked will not reliably parse.

### chapter-19.md — Chapter 19 — The Decoder Borrows the Encoder’s Notes
- Body lines: 682; explicit matrices: 16.
- **Review:** Front-matter chapter title is not emitted by the reader and the first H1 is a section heading; the rendered article therefore opens without its chapter title.
- **Review:** 2 raw HTML callout block(s) contain Markdown that Marked will not reliably parse.

### chapter-20.md — Chapter 20 — From Pretraining to Specialisation
- Body lines: 592; explicit matrices: 0.
- **Review:** Front-matter chapter title is not emitted by the reader and the first H1 is a section heading; the rendered article therefore opens without its chapter title.
- **Review:** 3 raw HTML callout block(s) contain Markdown that Marked will not reliably parse.

### chapter-21.md — Chapter 21 — Open Book, Closed Book, or Tool Belt?
- Body lines: 665; explicit matrices: 4.
- **Review:** Front-matter chapter title is not emitted by the reader and the first H1 is a section heading; the rendered article therefore opens without its chapter title.
- **Review:** 2 raw HTML callout block(s) contain Markdown that Marked will not reliably parse.

### chapter-22.md — Chapter 22 — Pictures, Audio, and Other Modalities
- Body lines: 645; explicit matrices: 4.
- **Review:** Front-matter chapter title is not emitted by the reader and the first H1 is a section heading; the rendered article therefore opens without its chapter title.
- **Review:** 2 raw HTML callout block(s) contain Markdown that Marked will not reliably parse.

### chapter-23.md — Chapter 23 — Smaller, Faster, Cheaper
- Body lines: 611; explicit matrices: 0.
- **Review:** Front-matter chapter title is not emitted by the reader and the first H1 is a section heading; the rendered article therefore opens without its chapter title.
- **Review:** 2 raw HTML callout block(s) contain Markdown that Marked will not reliably parse.

### chapter-24.md — Chapter 24 — Trust, but Verify
- Body lines: 797; explicit matrices: 2.
- **Review:** Front-matter chapter title is not emitted by the reader and the first H1 is a section heading; the rendered article therefore opens without its chapter title.
- **Review:** 2 raw HTML callout block(s) contain Markdown that Marked will not reliably parse.

## Scope and limitations
This automated pass checks structural Markdown/HTML, missing local assets, delimiter balance, table consistency, explicit matrix row widths, and simple nearby vector-size statements. It does not prove semantic correctness of every equation. The concatenated manuscript is emitted separately for expert line-by-line review.
