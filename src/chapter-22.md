---
title: "Chapter 22 — Pictures, Audio, and Other Modalities"
subtitle: "How modality encoders, projectors, shared token spaces, and cross-attention connect the world to a language model"
lang: en
---

# The question this chapter answers

A text model begins with token IDs.

An image is a grid of pixel values. Audio is a waveform that changes over time. Video adds both space and time. A document can combine text, layout, tables, diagrams, handwriting, and photographs.

How can one model accept such different inputs and still produce useful language?

<div class="big-idea">

**Multimodal systems first turn each modality into vectors, then build a learnable bridge into a shared reasoning or generation system. The bridge may be a projector, a cross-attention module, a shared token space, or an encoder–decoder interface.**

</div>

# The Senses Department

Imagine the language model working in a control room.

It cannot directly accept a photograph or a pressure waveform. Specialised departments prepare reports first.

```text
image
  -> vision encoder
  -> visual features

speech
  -> audio encoder
  -> acoustic features

text
  -> tokenizer and embeddings
  -> language features
```

A connector then translates those features into a form the language system can use.

The connector is not always the same.

# Modality is about representation

A modality is a way information is measured or expressed.

Examples include:

- text;
- images;
- audio;
- video;
- depth;
- point clouds;
- sensor streams;
- molecular structures;
- documents with layout;
- actions or robot states.

A multimodal model combines at least two such information types.

The model may consume several modalities, produce several modalities, or both.

# Images become sequences of vectors

A vision Transformer commonly divides an image into patches.

Suppose an image has height $H$, width $W$, and patch size $P\mathbin{×}P$.

The number of non-overlapping patches is:

$$
N
=
\frac{H}{P}
\frac{W}{P}
$$

For a $224\mathbin{×}224$ image with $16\mathbin{×}16$ patches:

$$
N
=
\frac{224}{16}
\frac{224}{16}
=14\cdot14
=196
$$

Each patch is flattened and projected into a vector.

The image can then be processed as a sequence of 196 visual tokens, often with positional information.

```text
pixels
  -> patches
  -> patch vectors
  -> vision Transformer
  -> contextual visual features
```

# Audio becomes time–frequency features

Raw audio is a one-dimensional waveform.

Many speech systems transform it into a time–frequency representation such as a log-Mel spectrogram.

Conceptually:

```text
waveform
  -> overlapping time windows
  -> frequency analysis
  -> spectrogram frames
  -> audio encoder
```

The encoder produces a sequence of acoustic hidden states.

A text decoder can then generate transcription tokens while cross-attending to those audio features.

This is an encoder–decoder pattern with different input and output modalities.

# Four common connection patterns

## Pattern 1: projector into language-token space

A modality encoder produces features:

$$
H_{\mathrm{mod}}
\in
\mathbb{R}^{N\mathbin{×}d_{\mathrm{mod}}}
$$

A learned projector maps them to the language-model width:

$$
H_{\mathrm{bridge}}
=
H_{\mathrm{mod}}W_P+b_P
$$

where:

$$
W_P
\in
\mathbb{R}^{d_{\mathrm{mod}}\mathbin{×}d_{\mathrm{model}}}
$$

The projected vectors can be inserted as pseudo-tokens in a decoder context.

## Pattern 2: cross-attention

Language hidden states create Queries, while modality features create Keys and Values.

$$
Q=H_{\mathrm{text}}W^Q
$$

$$
K=H_{\mathrm{mod}}W^K
$$

$$
V=H_{\mathrm{mod}}W^V
$$

The language stream retrieves visual or acoustic information through cross-attention.

## Pattern 3: learned query bottleneck

A small set of learned query vectors attends to a large modality representation.

```text
many image patches
  -> learned query tokens inspect them
  -> compact set of visual tokens
  -> language model
```

This can reduce the amount of modality information passed into a frozen or expensive language model.

## Pattern 4: unified token or latent space

A model may encode several modalities into one shared sequence or latent representation and process them with a common Transformer.

The details can include modality-type embeddings, separate input stems, shared blocks, or modality-specific output heads.

# A tiny projector calculation

Suppose a vision encoder produces one feature vector:

$$
v
=
\begin{bmatrix}
0.6&-0.2&0.5
\end{bmatrix}
$$

A learned projection matrix is:

$$
W_P
=
\begin{bmatrix}
0.5&0.1\\
-0.3&0.7\\
0.4&-0.2
\end{bmatrix}
$$

Ignoring bias:

$$
p=vW_P
$$

First output coordinate:

$$
0.6(0.5)+(-0.2)(-0.3)+0.5(0.4)
$$

$$
=0.30+0.06+0.20
=0.56
$$

Second coordinate:

$$
0.6(0.1)+(-0.2)(0.7)+0.5(-0.2)
$$

$$
=0.06-0.14-0.10
=-0.18
$$

Therefore:

$$
p
=
\begin{bmatrix}
0.56&-0.18
\end{bmatrix}
$$

The projector has converted a three-dimensional visual feature into a two-dimensional vector compatible with the receiving system in this toy example.

A real bridge may use a deeper MLP, normalisation, resampling, multiple tokens, or cross-attention.

# Projecting dimensions is not enough

A matrix can make the shapes compatible without making the meanings compatible.

Training must align the representations so that useful visual or acoustic distinctions affect language behaviour.

The bridge must learn questions such as:

- Which visual features correspond to objects and attributes?
- Which acoustic features correspond to phonemes or speakers?
- Which regions support a caption or answer?
- Which modality details can be compressed safely?
- Which features should remain separate?

Shape compatibility is necessary. Semantic alignment is learned.

# Multimodal training objectives

A multimodal system may combine several objectives.

## Contrastive alignment

Matched image–text pairs should have similar representations, while mismatched pairs should be less similar.

For a batch, a simplified image-to-text contrastive loss can be written as:

$$
\mathcal{L}_{i\rightarrow t}
=
-\frac{1}{B}
\sum_{i=1}^{B}
\log
\frac{
\exp(s(v_i,t_i)/\tau)
}{
\sum_{j=1}^{B}\exp(s(v_i,t_j)/\tau)
}
$$

where $s$ is a similarity function and $\tau$ is a temperature.

## Captioning or sequence generation

The model predicts text conditioned on modality features:

$$
\mathcal{L}_{\mathrm{caption}}
=
-\sum_t
\log p_\theta(y_t\mid y_{<t},H_{\mathrm{image}})
$$

## Matching

A classifier predicts whether an image and text belong together.

## Reconstruction

The model reconstructs masked or corrupted portions of one modality.

## Instruction tuning

Examples teach the system to answer questions, describe scenes, transcribe audio, follow document instructions, or use modality-aware tools.

No single objective guarantees every multimodal capability.

# Frozen and trainable components

A practical system may begin with strong pretrained parts.

```text
frozen vision encoder
        +
trainable bridge
        +
frozen or partly trainable language model
```

Training only the bridge is cheaper than updating everything, but it limits adaptation capacity.

Other recipes unfreeze selected layers or train the full system end to end.

The choice affects memory, data requirements, representation alignment, and catastrophic forgetting.

# BLIP-2 as a bridge example

BLIP-2 connects a frozen image encoder and a frozen large language model with a lightweight Querying Transformer.

Learned query tokens extract a compact visual representation, and training aligns that representation with language generation.

The important lesson is architectural, not brand-specific:

> A small trainable bridge can connect two large pretrained systems when its objective teaches the interface successfully.

# Flamingo as a cross-attention example

Flamingo connects vision and language components and introduces gated cross-attention layers so language representations can consult visual features.

It supports interleaved images, videos, and text.

Again, the broader lesson is that modality information can enter a language model through repeated cross-attention rather than only through one projected prefix.

# Whisper as an audio encoder–text decoder example

Whisper processes audio features with an encoder and generates text with a decoder.

The decoder uses causal self-attention over generated text and cross-attention over encoded audio.

This is the same information-flow pattern studied in Chapter 19, with acoustic source positions instead of source-language words.

# Early, middle, and late fusion

## Early fusion

Modalities are combined near the input.

Example:

```text
visual tokens + text tokens
  -> shared Transformer
```

This permits deep interaction but can be computationally expensive.

## Middle fusion

Separate encoders process modalities first, then hidden representations interact through shared layers or cross-attention.

## Late fusion

Independent models produce predictions or scores that are combined near the output.

Late fusion is modular but may miss fine-grained cross-modal relationships.

# Spatial information is fragile

An image encoder must preserve enough information about location and relationships.

Questions such as:

- What is left of the cup?
- Which arrow points to the valve?
- Is the label inside the box?
- Which row belongs to this heading?

require spatial or layout reasoning, not only object recognition.

Patch order, position encodings, image resolution, crops, and connector design all affect performance.

# Documents are more than images

A scanned report contains:

- visual layout;
- machine-readable text;
- typography;
- tables;
- charts;
- page order;
- footnotes;
- handwriting or stamps.

A document system may combine OCR, layout encoders, vision features, text tokens, and structural parsers.

Simply shrinking the page into a low-resolution image can destroy small text and table detail.

# Video adds time

Video contains many highly redundant frames.

Processing every frame at full resolution can be prohibitively expensive.

Systems may use:

- frame sampling;
- temporal pooling;
- clip encoders;
- motion features;
- learned resamplers;
- hierarchical attention;
- separate audio tracks.

Temporal order matters. A model that recognises objects in individual frames may still misunderstand which event happened first.

# Audio is not only speech

Audio models may need to represent:

- words;
- speaker identity;
- emotion or prosody;
- music;
- environmental sounds;
- overlapping speakers;
- silence and timing.

A transcript discards many of those signals.

A system that converts all audio immediately to text may lose information needed for the task.

# Multimodal generation

Some systems only consume non-text modalities and generate text.

Others can generate images, audio, or video.

Output generation may use:

- autoregressive tokens;
- diffusion models;
- discrete codec tokens;
- neural vocoders;
- modality-specific decoders.

A language model may plan or condition the output without directly producing final pixels or waveforms.

# Grounding and hallucination

A multimodal model can hallucinate objects, text, relationships, or events.

Possible causes include:

- low image resolution;
- ambiguous input;
- weak connector alignment;
- language priors overpowering evidence;
- cropping;
- OCR errors;
- missing frames;
- conflicting modalities;
- instruction tuning that rewards fluent guesses.

The system should support uncertainty and abstention when evidence is insufficient.

# Modality conflicts

Suppose an image shows a red sign but the prompt says it is blue.

Which source should the model trust?

Training and system instructions determine how conflicts are handled.

A robust application can explicitly label sources:

```text
USER CLAIM: The sign is blue.
IMAGE EVIDENCE: Visual input.
TASK: Report what is visible and note disagreement.
```

Without source boundaries, the model may blend the claim and evidence.

# Safety and privacy expand with modalities

Multimodal systems can expose:

- faces and identities;
- location metadata;
- voices;
- health information;
- documents visible in the background;
- copyrighted media;
- biometric characteristics;
- private conversations;
- sensitive screen content.

Controls should address collection, retention, access, redaction, consent, and downstream use.

# Evaluate each modality and the bridge

A multimodal evaluation should separate:

- encoder quality;
- connector alignment;
- cross-modal reasoning;
- text generation quality;
- OCR or transcription accuracy;
- spatial and temporal reasoning;
- robustness to noise;
- modality conflict handling;
- safety and privacy behaviour;
- latency and memory.

Strong text fluency can hide weak perception.

# Common multimodal mistakes

## Mistake 1: saying the language model reads pixels directly

Many systems use a separate vision encoder and bridge.

## Mistake 2: assuming a projector automatically aligns semantics

Training is required to make projected features meaningful to the language system.

## Mistake 3: treating image patches as words

Both are vectors, but their structure, training signals, and information content differ.

## Mistake 4: saying every multimodal model uses cross-attention

Some use projected prefixes, shared token spaces, or other fusion mechanisms.

## Mistake 5: judging visual understanding from fluent captions alone

Captions can be plausible while missing exact details.

## Mistake 6: using transcripts when non-verbal audio matters

Transcription removes tone, speaker, and environmental information.

## Mistake 7: ignoring resolution and preprocessing

A model cannot recover details removed before encoding.

## Mistake 8: evaluating only average accuracy

Spatial, OCR, temporal, multilingual, and safety slices may fail differently.

# Checkpoint

<div class="exercise">

## 1. How many $16\mathbin{×}16$ patches fit in a $224\mathbin{×}224$ image?

$$
196
$$

## 2. What does a modality encoder produce?

A sequence or set of learned feature vectors.

## 3. What does a projector do?

Maps modality features into a dimension and representation space usable by another component.

## 4. What was the projected vector in the numerical example?

$$
\begin{bmatrix}
0.56&-0.18
\end{bmatrix}
$$

## 5. In multimodal cross-attention, where can Keys and Values come from?

From encoded image, audio, video, or other modality features.

## 6. What is a learned-query bottleneck?

A small set of trainable query vectors that extracts a compact representation from many modality features.

## 7. Is Whisper decoder-only?

No. It uses an audio encoder and text decoder.

## 8. Why can OCR and layout require special treatment?

Small text, tables, and spatial structure may be lost by ordinary image preprocessing.

## 9. Does a fluent description prove accurate perception?

No.

## 10. Why evaluate the connector separately?

The modality encoder may capture information that the bridge fails to deliver to the language system.

</div>

# Chapter takeaway

Multimodal models do not erase modality differences.

They encode each input into vectors and learn interfaces that let information cross from one representation system into another.

In our story:

> **The Vision and Audio departments do not hand the language model raw pixels or waveforms. They prepare structured reports. A trained bridge translates those reports into tokens or memories the language system can consult.**

# Coming next: make the system affordable

The next chapter examines how models are compressed and served: quantisation, distillation, sparsity, mixture-of-experts routing, batching, caching, speculative decoding, latency, throughput, and memory trade-offs.

# Further reading

- [An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale](https://arxiv.org/abs/2010.11929)
- [Flamingo: a Visual Language Model for Few-Shot Learning](https://arxiv.org/abs/2204.14198)
- [BLIP-2: Bootstrapping Language-Image Pre-training with Frozen Image Encoders and Large Language Models](https://arxiv.org/abs/2301.12597)
- [Robust Speech Recognition via Large-Scale Weak Supervision](https://arxiv.org/abs/2212.04356)
