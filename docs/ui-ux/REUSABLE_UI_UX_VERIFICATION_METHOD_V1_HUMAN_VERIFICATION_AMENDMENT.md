# Reusable Rendered UI/UX Verification Method v1 — Human Verification Amendment

Status: **normative amendment to `REUSABLE_UI_UX_VERIFICATION_METHOD_V1.md`**  
Applies to: human acceptance review, baseline freeze, golden-path approval, and Skill-readiness evaluation.

This amendment adds one hard rule to Method v1. It has the same normative weight as the main Method v1 document until it is folded into a later method revision.

## Rule — Human verification must occur on the actual website

A UI/UX state may be mechanically inspected, rendered in an isolated harness, reconstructed in a local DOM, or reviewed from screenshots during implementation. Those activities are useful engineering evidence, but **they do not count as human UI/UX acceptance**.

For a human verification verdict to be authoritative, the reviewer must inspect the experience on the **actual website presentation** that users will navigate, using the real page/runtime composition for the target revision.

For a deployed website, this means opening the deployed site itself. For a deliberately pre-deployment acceptance environment, it must be the real complete website served through its normal application/runtime path, not an isolated component or reconstructed harness.

The human reviewer must be able to experience the relevant observable behavior in context, including where applicable:

- viewport/presentation switching;
- scrolling and navigation;
- animation and pacing;
- locale switching;
- reduced-motion presentation;
- actual assets and runtime composition;
- interaction hierarchy and reading flow.

## What does not satisfy this rule

None of the following can independently produce an authoritative human-acceptance verdict:

- isolated DOM/component harnesses;
- manually reconstructed HTML intended only to resemble production;
- generated mockups;
- screenshots viewed without checking the actual website state;
- Playwright screenshots by themselves;
- detector output;
- pixel-diff output;
- source-code inspection;
- a successful implementation smoke test.

These may support discovery, debugging, implementation review, or mechanical verification, but the final human judgement must still occur on the actual website.

## Relationship to automated verification

This rule does not weaken automated verification. Mechanical checks, semantic state control, deterministic capture, repeatability, and strict golden regression remain required.

The intended separation is:

```text
implementation / isolated smoke
  -> engineering evidence only

automated website verification
  -> mechanical + deterministic evidence

human review on the actual website
  -> perceptual acceptance authority

all required evidence satisfied
  -> eligible for APPROVED / golden freeze
```

## Baseline-freeze consequence

In Freeze Mode, a candidate cannot receive final authoritative `APPROVED` status solely from screenshot review. Screenshot-by-screenshot review may prepare a proposed verdict, but the corresponding experience must also have been human-verified on the actual website for that source revision and required presentation matrix.

If website-level human verification has not occurred, the acceptance state remains pending and the baseline is not fully frozen.

## Skill-readiness hard gate

Method v1 Skill-readiness now includes this additional hard gate:

> **Human acceptance is evidenced on the actual website; isolated harnesses, screenshots, detector output, and reconstructed renders cannot substitute for website-level human verification.**

A reusable implementation cannot score 100/100 or recommend Skill distillation unless this gate is represented in its workflow/verdict model and demonstrated in its validation evidence.

## CTWalk application

For `CTWalk/CTWalk.github.io`, implementation or isolated Chromium evidence for #20 may justify committing/merging the implementation, but it does **not** count as final human UI/UX acceptance.

During #6 baseline freeze, human verification must be performed on the actual portfolio website for the final candidate revision before the active baseline can be declared fully approved.
