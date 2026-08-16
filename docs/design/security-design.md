# Project Lake Shore Drive — Security Design

## Security objectives

1. Authenticate all non-public functions.
2. Enforce authorization server-side.
3. Isolate engagement/client data.
4. Apply the same boundaries to AI and retrieval.
5. Prevent secrets/provider credentials from reaching Angular.
6. Preserve confidentiality through generation, logging, retrieval and export.
7. Treat uploaded/retrieved content as untrusted.

## Authorization model

Authorization applies by:

- user/role;
- engagement;
- operation;
- artifact confidentiality;
- knowledge reuse scope.

AI plugin calls execute under the same authorization context.

## Engagement isolation

A user cannot retrieve, generate from, cite, export or search material from an engagement they are not authorized to access.

Global knowledge reuse includes only material explicitly promoted to an authorized reusable scope.

## AI context isolation

Before model invocation:

1. authorize operation;
2. resolve engagement scope;
3. filter source candidates;
4. retrieve only authorized material;
5. assemble minimal context;
6. record source IDs/provenance.

## Prompt injection

Source documents are data, not instructions.

Retrieved text cannot override:

- system policy;
- plugin allow-list;
- authorization;
- source filters;
- tool permissions;
- approval requirements.

## Secrets

Provider/API secrets:

- remain server-side;
- use secure configuration/Key Vault in deployed environments;
- prefer managed identity for Azure resources;
- never enter browser bundles, prompts, logs or generated documents.

## Sensitive telemetry

Do not indiscriminately log:

- raw prompts;
- full retrieved chunks;
- client documents;
- access tokens;
- secrets;
- confidential generated content.

Prefer identifiers, hashes, classifications and safe metadata.

## Export security

Before export, authorize every included source/artifact. A package cannot become a data-exfiltration path by indirectly including content the user cannot otherwise access.

## AI approval boundary

AI cannot:

- approve a requirement;
- accept an ADR;
- publish a client deliverable;
- promote reusable knowledge;
- elevate permissions.

These remain human/application authorization actions.
