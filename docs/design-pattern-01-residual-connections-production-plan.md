# Design Pattern 01 — Residual Connections

## Production plan

**Standard ML-community name:** Residual connection  
**More specific name when the bypass is unchanged:** Identity skip connection  
**Broader family:** Skip connections  
**Book teaching subtitle:** **Learn an Update, Keep the State**

---

## 1. Why this qualifies as a full design pattern

Residual connections are an established neural-network architecture pattern rather than a Transformer-specific trick. The same structural decision appears in residual networks, Transformer attention and MLP sublayers, and many modern vision and generative architectures.

The recurring problem is:

> A deep learned transformation must improve a useful representation without being forced to reconstruct that entire representation at every stage.

The standard response is:

$$
y=x+F(x)
$$

The learned branch produces a **residual update** $F(x)$ while the input $x$ retains a direct route to the output.

This pattern deserves a dedicated section because it has:

- a recognised community name;
- a recurring architectural form;
- a clear failure mode and decision rule;
- strong examples both inside and outside LLMs;
- important trade-offs and common misconceptions.

---

## 2. Terminology guardrails

The book should use the following terms precisely.

### Residual connection

An additive connection of the form:

$$
y=x+F(x)
$$

or, when dimensions must change:

$$
y=P(x)+F(x)
$$

where $P$ is a projection or other shape-matching transform.

### Identity skip connection

A residual connection in which the bypass is exactly $x$.

### Skip connection

The broader family of architectures in which information bypasses one or more transformations. Not every skip connection is additive.

### Related but distinct

- **U-Net skip connections** often concatenate encoder features with decoder features.
- **DenseNet connections** concatenate features from many earlier layers.
- **Highway networks** use learned gates to control the bypass and transformed paths.

These should be mentioned as relatives, not presented as exact synonyms for the Transformer residual stream.

---

## 3. Primary placement in the book

### Full pattern section: Chapter 7

**Chapter:** `src/chapter-07.md`  
**Insertion point:** after **Residual addition requires matching shapes** and before **Why normalise after the residual sum?**

This placement preserves the teaching sequence:

1. calculate the attention update;
2. add it to the incoming state;
3. verify shape compatibility;
4. zoom out to the general residual-connection pattern;
5. return to the Transformer-specific need for normalisation.

### Pattern trail elsewhere

#### Chapter 1 — teaser only

After the first high-level equation:

$$
X_{\text{updated}}=X+\Delta X_{\text{attention}}
$$

add a compact **Pattern Preview** callout:

> This “keep the state and add an update” structure is a standard residual connection. Chapter 7 develops the full design pattern.

Do not explain gradients or ResNet here.

#### Chapter 8 — recurrence

When the MLP output is added back to the token state, add a one-line **Pattern Trail**:

> The MLP uses the same residual pattern as attention: transform a normalised view, then write an update into the shared stream.

#### Chapter 10 — depth and repeated refinement

Show how the same-width residual stream becomes the stable interface carried through many blocks. Emphasise repeated refinement rather than repeated reconstruction.

#### Chapter 14 — backward-path deep dive

Use the established residual pattern to explain that backward contributions follow both the identity path and the learned branch, then add at the shared input.

---

## 4. Learning objectives

After the Chapter 7 pattern section, the reader should be able to:

1. recognise $y=x+F(x)$ as a residual connection;
2. explain why the learned branch can focus on an update rather than reconstructing the entire state;
3. explain why input and update normally need compatible shapes;
4. distinguish a residual connection from the broader category of skip connections;
5. identify the same pattern in a ResNet block;
6. state that residual connections improve optimisation routes but do not guarantee stable gradients;
7. predict that if $F(x)=0$, the block returns the input unchanged.

The Chapter 14 revisit should add one more objective:

8. explain why gradients from the identity and learned branches are added at their shared source.

---

## 5. Proposed Chapter 7 content structure

The full section should occupy approximately one substantial section or a two-page visual spread in the rendered book.

## Design Pattern: Residual Connections

### Teaching subtitle

**Learn an Update, Keep the State**

### A. The recurring problem

A deep network receives a representation that is already useful. A new sublayer should improve it, but a replacement-only design asks the sublayer to rebuild everything worth preserving.

Replacement form:

$$
y=F(x)
$$

Questions for the reader:

- What happens to information that $F$ does not reproduce?
- What should a layer do when no change is currently useful?
- How does a correction signal travel through dozens of transformations?

### B. The pattern

Keep a direct path and learn only the residual update:

$$
y=x+F(x)
$$

One-sentence rule:

> Preserve the current representation as a sensible default and let the learned branch contribute a correction.

### C. Why the name “residual”?

If the desired mapping is $H(x)$, the learned branch can model the difference:

$$
F(x)=H(x)-x
$$

Then:

$$
H(x)=x+F(x)
$$

Keep this explanation short. Do not imply that the model explicitly calculates a target residual during inference.

### D. In our Transformer

For the attention sublayer:

$$
R=X+Y
$$

where:

- $X$ is the incoming residual-stream state;
- $Y=\operatorname{MHA}(X)W^O$ is the attention update in the same model width;
- $R$ is the state passed onward in the book’s post-norm worked example.

The important interpretation is:

> Attention writes into the token’s evolving state; it does not replace the token with the attention report.

### E. What the pattern buys us

#### 1. Identity is an easy default

If the learned branch produces zero:

$$
F(x)=0
$$

then:

$$
y=x
$$

The block can initially behave like “do no harm” and learn useful deviations.

#### 2. Useful information has a direct route

The input does not depend entirely on every coordinate being reconstructed by the learned branch.

#### 3. Deep stacks become easier to optimise

The backward computation has a direct contribution around the learned branch. Use cautious wording:

> Residual connections provide additional signal and gradient routes through deep compositions. They often improve trainability, but the branch can still amplify, attenuate, or cancel contributions.

#### 4. The architecture gains a stable interface

When every sublayer reads and writes $d_{\text{model}}$-wide states, many different transformations can be stacked while preserving one shared representation format.

### F. The same pattern in a ResNet

A ResNet block uses:

$$
y=x+F_{\text{conv}}(x)
$$

The convolutional branch learns a feature correction while the feature map travels along the bypass.

The comparison should focus on the shared structural decision:

| Transformer block | ResNet block |
|---|---|
| token-state matrix $X$ | image feature map $x$ |
| attention or MLP branch | convolutional branch |
| learned contextual or feature update | learned visual-feature update |
| element-wise addition | element-wise addition |
| usually stable model width | usually stable channel and spatial shape inside an identity block |

### G. Use this pattern when

- the input representation is already useful;
- the desired operation is naturally an amendment or refinement;
- a deep sequence of transformations must preserve information;
- identity is a sensible fallback behaviour;
- the branch can return a compatible shape, or a deliberate projection can make it compatible.

### H. Watch out for

- residual addition requires compatible shapes;
- a projection bypass is no longer a pure identity route;
- large or poorly scaled updates can still destabilise the stream;
- residual connections do not replace normalisation, suitable initialisation, or optimisation choices;
- the direct and branch gradient contributions can reinforce or cancel each other;
- an additive residual connection is not the same as every architecture called a “skip connection.”

### I. Pattern trail footer

```text
Standard name: Residual connection
First preview: Chapter 1
Full pattern: Chapter 7
Reappears: Chapters 8 and 10
Backward-path deep dive: Chapter 14
Non-LLM analogue: ResNet identity block
```

---

## 6. Worked-example plan

The pattern should reuse the book’s existing numbers rather than introducing a disconnected Transformer example.

### Example 1 — Existing SAT residual calculation

Use the Chapter 7 values:

$$
x_{\text{sat}}
=
\begin{bmatrix}
0.14 & -0.22 & 0.67 & -0.31
\end{bmatrix}
$$

$$
y_{\text{sat}}
=
\begin{bmatrix}
-0.102905 & 0.152723 & 0.053205 & -0.123094
\end{bmatrix}
$$

$$
r_{\text{sat}}
=x_{\text{sat}}+y_{\text{sat}}
=
\begin{bmatrix}
0.037095 & -0.067277 & 0.723205 & -0.433094
\end{bmatrix}
$$

#### Visual treatment

Use three aligned cards:

```text
incoming SAT state
        +
attention amendment
        =
updated SAT state
```

Use matching coordinate positions and arrows so the reader sees element-wise addition.

### Example 2 — Counterfactual replacement

Directly compare:

```text
Replacement-only: output = Y
Residual:         output = X + Y
```

Do not claim that $Y$ is meaningless. The lesson is that $Y$ was designed as an update and therefore should not be interpreted as a complete replacement state.

Ask:

> If the attention branch temporarily produced a near-zero update, which architecture would preserve SAT’s current state?

Expected answer: the residual form.

### Example 3 — The zero-update sanity check

Use a tiny vector:

$$
x=
\begin{bmatrix}
2 & -1 & 0.5
\end{bmatrix},
\qquad
F(x)=
\begin{bmatrix}
0 & 0 & 0
\end{bmatrix}
$$

Replacement:

$$
y=F(x)=0
$$

Residual:

$$
y=x+F(x)=x
$$

This is the fastest demonstration of why identity is an easy default.

### Example 4 — Small ResNet feature-map analogy

Use a deliberately tiny $2\times2$ feature map:

$$
x=
\begin{bmatrix}
1.0 & 0.8\\
0.2 & 0.0
\end{bmatrix}
$$

Suppose the convolutional branch learns:

$$
F_{\text{conv}}(x)=
\begin{bmatrix}
0.1 & -0.1\\
0.3 & 0.2
\end{bmatrix}
$$

Then:

$$
y=x+F_{\text{conv}}(x)
=
\begin{bmatrix}
1.1 & 0.7\\
0.5 & 0.2
\end{bmatrix}
$$

The arithmetic should be presented as a toy feature-map example, not as a literal hand calculation performed by a particular trained ResNet.

### Example 5 — Backward route, reserved for Chapter 14

For:

$$
y=x+F(x)
$$

show:

$$
\frac{\partial\mathcal L}{\partial x}
=
\frac{\partial\mathcal L}{\partial y}
+
\frac{\partial\mathcal L}{\partial y}
\frac{\partial F}{\partial x}
$$

Pedagogical wording:

> The shared input receives one contribution through the direct addition and another through the learned branch. Backpropagation adds the contributions.

Caveat box:

> The identity term creates a direct route; it does not guarantee that the total gradient is large, small, or well behaved. The branch contribution can reinforce or oppose it.

---

## 7. Cartoon-image plan

The images should use the established Head First LLM visual grammar: expressive token characters, clean line art, limited visual clutter, technically meaningful props, and a direct mapping from metaphor to tensor operation.

Avoid a single overcrowded poster. Build the pattern from distinct scenes that can be generated, reviewed, and replaced independently.

## Scene 1 — The Replacement Factory

**Purpose:** establish the problem before showing the solution.

**Story:** SAT enters carrying its current case file. A machine labelled only with a simple transformation symbol takes the file and produces a completely new file. The old file falls toward a discard bin. SAT looks worried because useful notes may disappear unless the machine recreates them.

**Technical mapping:**

```text
x -> F -> y
```

**Composition:**

- left: SAT with original four-number card;
- centre: transformation machine;
- bottom: old card heading toward discard;
- right: replacement card;
- strong left-to-right reading order;
- no residual bypass lane.

**Avoid:** depicting the transformation as inherently bad. The caption should say that full replacement can be a harder job in a deep stack, not that ordinary layers never work.

**Proposed asset:**

`assets/chapter-07/04b_residual_pattern_replacement_factory.webp`

**Alt text:**

> SAT’s original state enters a replacement-only transformation; the old case file has no direct route to the output, so the learned branch must produce the complete next state.

## Scene 2 — The Residual Amendment Highway

**Purpose:** deliver the core metaphor and standard pattern.

**Story:** SAT’s original case file travels on a straight main lane. A copy enters an Attention Specialist side office, which produces a smaller amendment sheet. At a clearly marked addition junction, the original file and amendment merge into the updated file.

**Technical mapping:**

```text
              -> F(x) --\
x ---------------------- + -> y
```

**Composition:**

- thick straight identity lane;
- thinner learned-branch detour;
- amendment should be visibly different from the full case file;
- a plus-junction, not concatenation or stapling side by side;
- final card retains the original card motif with marked updates.

**Proposed action:** upgrade the existing Chapter 7 residual-highway artwork rather than adding a visually competing highway metaphor.

**Existing asset to replace during implementation:**

`assets/chapter-07/04_residual_highway.webp`

**Replacement alt text:**

> SAT’s current token-state card travels along an identity highway while an attention branch produces an amendment; the two are added to form the updated residual-stream state.

## Scene 3 — One Pattern, Two Domains

**Purpose:** prove that this is a standard ML pattern, not only an LLM mechanism.

**Story:** split-panel composition.

### Left panel: Transformer

- SAT’s token-state card takes the identity lane;
- Attention Specialist produces a contextual amendment;
- addition creates the updated token state.

### Right panel: ResNet

- an image feature-map tile takes the identity lane;
- two convolution workers produce an edge/texture correction tile;
- addition creates the updated feature map.

A shared visual brace or small badge reads **Residual connection** outside the generated artwork if possible, so the image itself does not depend on perfectly rendered text.

**Proposed asset:**

`assets/chapter-07/04c_residual_pattern_transformer_resnet.webp`

**Alt text:**

> A Transformer token state and a ResNet image feature map use the same residual pattern: the input bypasses a learned branch and is added to the branch’s update.

## Scene 4 — The Correction Travels Two Routes

**Primary home:** Chapter 14, not Chapter 7.

**Purpose:** reinforce the same pattern during backpropagation.

**Story:** a red correction memo arrives at the output junction. One copy travels directly back along the identity highway; another travels backward through the specialist office. At SAT’s earlier state, the two correction reports are added.

**Technical mapping:**

```text
g_y -> direct contribution --------\
       branch backward contribution + -> g_x
```

**Proposed asset:**

`assets/chapter-14/XX_residual_gradient_two_routes.webp`

The exact numeric prefix should be chosen after reviewing Chapter 14’s final asset order.

**Alt text:**

> A residual block sends the backward correction through both the identity path and the learned branch; the gradient contributions add at their shared input.

---

## 8. Image-generation constraints

Each generated scene must satisfy all of the following:

- match the existing cartoon character proportions and line quality;
- keep SAT recognisable across scenes;
- use the same visual appearance for token-state cards as existing chapters;
- show addition, not concatenation, at the residual merge;
- keep the identity route visually uninterrupted;
- avoid decorative arrows that imply the wrong direction;
- leave equations and detailed labels to the HTML/Markdown where practical;
- avoid tiny in-image text;
- reserve clean negative space for an external caption;
- use a wide composition compatible with the book’s existing chapter art;
- export each scene as an individual WebP asset;
- review hands, mouths, hats, arrows, plus signs, card values, and cropping before integration.

---

## 9. Interaction between prose and images

The cartoon should provide the intuition. The surrounding content must make the mapping explicit.

Immediately below Scene 2, add a short translation table:

| Cartoon element | ML meaning |
|---|---|
| original case file | input representation $x$ |
| straight highway | identity skip path |
| specialist office | learned branch $F$ |
| amendment sheet | residual update $F(x)$ |
| addition junction | element-wise sum |
| updated case file | output $y=x+F(x)$ |

Immediately below Scene 3, include the Transformer/ResNet comparison table from Section 5F.

Do not leave the reader to infer whether the side lane carries a copy, a replacement, or a different token.

---

## 10. Exercise and checkpoint plan

### Quick check 1 — Identity default

If $F(x)=0$, what is $y$?

Expected answer:

$$
y=x
$$

### Quick check 2 — Shape compatibility

Can a $3\times4$ token-state matrix be directly added to a $3\times6$ branch output?

Expected answer: no. The branch or bypass must be projected to a compatible shape.

### Quick check 3 — Pattern recognition

Which is a residual connection?

A. $y=F(x)$  
B. $y=x+F(x)$  
C. $y=\operatorname{Concat}(x,F(x))$

Expected answer: B. C is a skip-style concatenation but not an additive residual connection.

### Quick check 4 — Transformer interpretation

In Chapter 7, is $Y$ a second token sequence that replaces $X$?

Expected answer: no. It is a model-width attention update added to the existing token-state matrix.

### Chapter 14 check — Branch gradients

When one activation feeds the identity path and a learned branch, what happens to the backward contributions at the shared source?

Expected answer: they are added.

---

## 11. Common misconceptions to pre-empt

### “Residual means the update must be small”

Not necessarily. The term describes the additive architecture. The learned update may be small or large.

### “The identity path freezes the input”

No. The output changes after addition, and subsequent layers can transform it further.

### “Residual connections prevent vanishing gradients”

Use more careful language. They create direct gradient contributions and usually make deep optimisation easier, but do not guarantee non-vanishing or stable total gradients.

### “Every skip connection is a residual connection”

No. Concatenative and gated skips belong to the broader skip-connection family but have different merge rules and consequences.

### “Attention returns a finished replacement token state”

In the architecture taught here, attention produces an update that is projected to model width and written into the residual stream.

### “The bypass always has no parameters”

Identity blocks have parameter-free bypasses. Shape-changing blocks may use a learned projection on the skip path.

---

## 12. Editorial tone

Keep the section intuitive but technically conservative.

Preferred language:

- “learn an update”;
- “retain a direct route”;
- “often improves trainability”;
- “gradient contributions add”;
- “identity is a sensible fallback.”

Avoid:

- “gradients always shrink without residuals”;
- “residuals solve vanishing gradients”;
- “the original representation is preserved unchanged forever”;
- “skip connection” and “residual connection” used as exact synonyms without qualification;
- implying that a ResNet and Transformer branch perform the same computation.

---

## 13. Implementation sequence

### Stage 1 — Content draft

1. Add the Chapter 1 Pattern Preview.
2. Draft the full Chapter 7 pattern section at the specified insertion point.
3. Add the Chapter 8 and Chapter 10 Pattern Trail callouts.
4. Expand the Chapter 14 residual-backprop section with the guarded explanation.

### Stage 2 — Illustration production

1. Generate Scene 1 independently.
2. Replace and improve the existing residual-highway image with Scene 2.
3. Generate Scene 3 independently.
4. Generate Scene 4 for Chapter 14.
5. Review every image against the technical mapping before integration.

### Stage 3 — Integration

1. Add images and alt text to the source chapters.
2. Add the residual-pattern translation table.
3. Add exercises and checkpoint answers.
4. Render the HTML chapters.
5. Inspect desktop and narrow/mobile layouts.
6. Confirm equations render through the existing MathJax/KaTeX path.
7. Verify that no artwork overlaps adjacent content.

---

## 14. Definition of done

The first pattern is complete only when:

- the standard term **Residual connection** is prominent;
- the teaching subtitle remains secondary;
- Chapter 7 contains the full reusable pattern, not only a Transformer explanation;
- the running SAT example is reused correctly;
- a ResNet identity block provides the non-LLM example;
- the broader skip-connection family is distinguished accurately;
- the gradient claim is correct and non-absolute;
- each cartoon scene has a precise technical mapping;
- all images match the existing book style;
- image labels, arrows, merge operations, and cropping have been reviewed;
- Chapter 1, 8, 10, and 14 contain concise pattern-trail references;
- rendered equations and responsive layout have been checked.
