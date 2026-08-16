# Project Lake Shore Drive — Project Story

## The problem

Architecture consulting produces high-value outputs, but much of the work is repetitive: discovery questions, requirements matrices, ADRs, risks, estimates, proposal language, SOW sections, architecture patterns, diagrams, implementation prompts, and repository bootstrap material.

The problem is not that architects lack templates. The problem is that the templates, prior decisions, estimates, source evidence, and reusable patterns are fragmented across documents and prior engagements.

Project Lake Shore Drive turns that fragmented practice into a governed system of work.

## The product

Lake Shore Drive is an **AI Architecture Accelerator** and internal **Architect Workbench**.

The north-star workflow is:

> New Engagement → Discovery → Requirements → Architecture → Decisions → Estimation → Consulting Package → Review → Delivery Bootstrap

The product is deliberately not a chatbot wrapper. The primary interface is structured work: forms, matrices, work queues, versioned records, editors, review states, citations, and document sections.

## What AI does

AI accelerates bounded tasks:

- extract candidate requirements;
- detect discovery gaps and contradictions;
- recommend architecture patterns;
- draft ADRs;
- propose RAID items;
- retrieve similar historical decisions;
- generate and revise document sections;
- translate approved technical facts for different audiences;
- generate microstep SCRUB prompts.

AI does **not** approve its own work, bypass authorization, fabricate source evidence, or silently promote generated text into reusable knowledge.

## Architecture philosophy

Lake Shore Drive uses the simplest integration style that preserves the required behavior.

- **HTTP** is used when the caller needs an immediate answer.
- **Azure Service Bus** is used for cross-domain state propagation, fan-out, retry-independent processing, long-running work, and durable workflows.
- **Transactional outbox** is required when durable state and an integration event must be committed atomically.
- **Consumers are idempotent** and use a transactional inbox when duplicate durable side effects matter.
- **Redis is a cache and coordination tool**, never a source of truth.
- **Each bounded domain owns its data**.
- **Semantic Kernel** is the server-side AI orchestration boundary.
- **Angular 22** consumes backend capabilities through typed APIs and a governed local design system.

## Why this matters

The end state is not simply faster document creation.

The end state is a consulting operating system in which every approved engagement improves the next one through reusable patterns, estimates, requirements, decisions, lessons, prompts, and evidence — without losing provenance or architect judgment.
