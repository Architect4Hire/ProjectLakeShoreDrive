# Project Lake Shore Drive — Why This Architecture

## The architecture follows the work

Lake Shore Drive is a consulting operating system, not a generic CRUD application and not a chatbot.

Its architecture must preserve three things simultaneously:

1. structured, trustworthy engagement state;
2. durable long-running AI/document workflows;
3. reusable institutional knowledge with provenance.

That drives the major choices.

## Why keep core engagement concepts together

Discovery, requirements, ADRs, RAID, estimates and approvals are highly cohesive. A single architect action often touches several of them conceptually.

Splitting each noun into a microservice would produce chatty calls without creating meaningful operational independence.

Therefore the recommended bounded context groups the engagement source of truth while preserving internal module boundaries.

## Why HTTP and messaging both exist

Synchronous HTTP is superior when the user needs an immediate answer.

Messaging is superior when the business needs temporal decoupling, independent retry, fan-out, or durable long-running work.

Using one style everywhere would make the system worse:

- all-HTTP would make long AI workflows fragile and tightly timed;
- all-messaging would make ordinary queries and validation unnecessarily complex.

## Why outbox/inbox are targeted

Outbox solves a specific dual-write problem: committing business state and reliably publishing an integration fact.

Inbox solves duplicate message effects where the consumer mutates durable state.

Neither belongs in ordinary synchronous query handling.

## Why Semantic Kernel

Semantic Kernel gives Lake Shore Drive a server-side orchestration boundary for prompt execution, model abstraction and approved function/plugin calling.

The domain remains independent of OpenAI SDK types, which supports testing, provider evolution, and governance.

## Why RAG is governed

Prior engagement material can be highly valuable and highly confidential.

Retrieval therefore cannot be a global vector dump. It needs metadata, security filters, lifecycle states, explicit source selection and resolvable citations.

## Why documents are section-based

Architects revise documents iteratively. Approved paragraphs should not be destroyed because one later section is regenerated.

Section-level generation enables:

- bounded context;
- version comparison;
- citations;
- locking;
- approval;
- selective regeneration.

## Why Angular 22 + local design system

The product is a dense professional workbench with recurring matrices, editors, review states, citations and AI affordances.

A local design system prevents every feature from inventing its own Tailwind recipe and makes accessibility and AI-state semantics consistent.

## Why durable workflow state

Model calls, ingestion and export are external and failure-prone.

Persisted workflow state means the application can survive worker restart, browser disconnect, rate limiting and human review delays without pretending that a long HTTP request is a workflow engine.

## What this architecture deliberately avoids

- microservice-per-entity;
- Service Bus for ordinary queries;
- direct browser-to-model access;
- generated prose as the source of truth;
- Redis as authoritative data;
- shared databases across bounded services;
- AI tools with unrestricted data access;
- monolithic prompts for whole consulting packages;
- feature-level design-system duplication.
