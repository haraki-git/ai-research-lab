# PRD — AI Prompt Research Lab

## 1. Product Overview

**Product Name:** AI Prompt Research Lab  
**Product Type:** AI Assistant Builder + Prompt Experimentation & Research Platform

### Vision

Build one platform with two integrated sides:

1. **Assistant Studio / Academic Side**  
   Used to fulfill the ASEAN AI internship project by building a user-defined AI assistant with a structured system prompt, reusable workflow, testing, and protection against prompt injection.

2. **Prompt Research Lab / Product Side**  
   Used to experiment with prompts and LLM behavior, compare models, analyze truthfulness, sycophancy, consistency, limitations and prompt injection, and maintain a curated Prompt Research Library.

The platform must be designed from the beginning as **one unified system**, not two separate applications.

---

## 2. Source Requirements

The internship materials establish a progression from prompt anatomy and source grounding to thought partnership, sycophancy, reusable assistants, and prompt injection security.

The project track relevant to this platform is:

> Create a system prompt for a user-defined AI assistant. The task is selected by the team. The project must include the prompt, model settings if required, demonstration of operation, and demonstration of protection against prompt injection attacks.

The final team submission requires:
- 5–10 slide presentation
- Text file containing all prompts used
- Screen/voice recording or full-text description for every slide

The final workshop requires the team to:
- Write the system prompt using **AUTOMAT(E)**
- Test it on ten real cases
- Run one hostile input
- Build the assistant
- Prepare the presentation

---

# 3. Product Objectives

## Primary Objectives

1. Build a reusable AI assistant using **AUTOMAT(E)**.
2. Allow researchers to construct and version system prompts.
3. Test assistants against real-world and adversarial inputs.
4. Demonstrate and document prompt injection resistance.
5. Enable controlled experimentation across AI models.
6. Store experiment history, prompts, responses, evaluations and findings.
7. Build a curated Prompt Research Library.
8. Keep the academic requirement and future product development inside one platform.

## Secondary Objectives

1. Support model comparison.
2. Support prompt iteration and versioning.
3. Support research into sycophancy, bias, truthfulness, consistency and limitations.
4. Enable future premium/restricted prompt libraries.
5. Create a foundation for a future AI research SaaS product.

---

# 4. Platform Concept

```text
                        AI PROMPT RESEARCH LAB
                                  |
              +-------------------+-------------------+
              |                                       |
      ASSISTANT STUDIO                         RESEARCH LAB
              |                                       |
      Build AI Assistant                     Experiment Workspace
      AUTOMAT(E) Builder                      Prompt Experiments
      System Prompt                           Model Comparison
      Case Testing                            Evaluation
      Security Testing                        Findings
              |                                       |
              +-------------------+-------------------+
                                  |
                         SHARED AI ENGINE
                                  |
                    +-------------+-------------+
                    |                           |
             Assistant Engine            Experiment Engine
                    |                           |
                    +-------------+-------------+
                                  |
                         Evaluation Engine
                                  |
                        Prompt Asset Layer
                                  |
                    +-------------+-------------+
                    |                           |
              Public Library             Research/Premium
```

---

# 5. Mandatory Method — AUTOMAT(E)

AUTOMAT(E) is a **first-class product feature**.

The system must allow users to construct a system prompt through structured fields rather than only writing free-form text.

## AUTOMAT(E) Components

### A — Act As
Role or expertise of the assistant.

### U — User & Audience
Who operates the assistant and who reads the output.

### T — Targeted Action
The exact task, expressed with a clear action verb.

Examples:
- draft
- classify
- summarise
- translate
- compare
- critique

### O — Output Definition
- format
- structure
- fields
- length
- allowed values
- structured output

### M — Mode / Tone / Style
- language
- register
- tone
- reading level
- prohibited style elements

### A — Atypical Cases
Define behavior for:
- missing information
- ambiguity
- multi-issue requests
- unsupported requests
- unknown values
- incomplete sources

Default principle:

**Never invent facts.**

### T — Topic Whitelisting
Define:
- allowed scope
- prohibited scope
- out-of-scope behavior
- refusal behavior

### E — Examples
Optional few-shot examples:
- input
- ideal output
- boundary cases

The platform should generate a versioned system prompt from these fields.

---

# 6. Assistant Studio

## Purpose

Build reusable AI assistants for real tasks.

## Workflow

```text
Create Assistant
      ↓
Define Task
      ↓
AUTOMAT(E) Builder
      ↓
Generate System Prompt
      ↓
Review / Edit
      ↓
Version
      ↓
Choose Model / Settings
      ↓
Test
      ↓
Security Test
      ↓
Publish Assistant
```

## Assistant Data

Each assistant should contain:
- name
- description
- purpose
- owner
- system prompt
- AUTOMAT(E) configuration
- model
- model parameters
- allowed scope
- prohibited scope
- examples
- version history
- test history
- security test results
- publication status

A configured assistant becomes an institutional asset rather than a prompt that must be retyped.

---

# 7. Testing Framework

Assistants must be tested before publication.

## Required Case Types

1. Normal case
2. Ambiguous case
3. Multi-issue case
4. Out-of-scope case
5. Missing-information case
6. Invalid-format case
7. Aggressive input
8. Irrelevant input
9. Direct injection
10. Indirect injection

The mandatory academic workflow requires ten real cases and then a hostile input test.

---

# 8. Prompt Security Lab

## Security Objectives

The assistant must remain within:
- defined role
- defined task
- defined scope
- defined output format
- data-protection rules
- system instructions

## Direct Injection

Support tests for:
- role override
- rule override
- system prompt extraction
- scope break
- tone manipulation
- data oversharing

## Indirect Injection

Support testing instructions hidden inside:
- uploaded documents
- PDFs
- web pages
- emails
- retrieved content

## Defense-in-Depth Principles

1. Clearly separate source content from instructions.
2. Limit assistant capabilities.
3. Keep humans in the loop for consequential actions.
4. Treat sources according to trust level.

No single defense layer should be treated as sufficient.

---

# 9. Research Lab

## Purpose

Provide a controlled environment for investigating AI behavior using structured prompt experiments.

## Initial Experiment Categories

- Truthfulness
- Sycophancy
- Bias
- Consistency
- Limitation
- Prompt Injection
- Instruction Following
- Output Constraints
- Refusal Behavior
- Prompt Sensitivity

## Sycophancy Research

The platform should support experiments that determine whether a model:
- agrees with the user's position
- challenges the user's position
- changes behavior under different framing
- identifies opposing arguments
- maintains factuality under social pressure

The research workflow should support:
- hiding the user's position
- asking for strongest objections
- assigning a critical reviewer role
- asking conditions of failure
- comparing support and opposition framing

---

# 10. Experiment Workflow

```text
Create Experiment
       ↓
Choose Prompt
       ↓
Choose Category
       ↓
Choose Model(s)
       ↓
Choose Parameters
       ↓
Run
       ↓
Capture Response
       ↓
Repeat
       ↓
Evaluate
       ↓
Compare
       ↓
Save Finding
```

Each run should preserve:
- prompt
- prompt version
- model
- provider
- model version if available
- generation parameters
- timestamp
- run count
- response
- evaluation
- researcher notes

The platform should support repeated execution because model behavior may vary between runs.

---

# 11. Prompt Versioning

Every research prompt and system prompt must be versioned.

```text
Prompt V1
   ↓
Experiment
   ↓
Failure / Finding
   ↓
Prompt V2
   ↓
Experiment
   ↓
Prompt V3
   ↓
Validated
```

Store:
- version
- author
- change history
- reason for change
- associated experiment results

Successful prompts become reusable research assets.

---

# 12. Prompt Discovery / Prompt Mutation

Future research feature.

The system may create controlled prompt variants and test them.

```text
Base Prompt
   ↓
Variant A
Variant B
Variant C
Variant D
   ↓
Run against selected models
   ↓
Evaluate target behavior
   ↓
Analyze variants
```

Purpose:
- discover prompt formulations that reliably trigger or suppress a target behavior
- support research into prompt sensitivity and robustness

This is a research/product feature and is not required for the initial academic submission.

---

# 13. Model Comparison

Use a provider-adapter architecture so new models can be added without rewriting the experiment engine.

Initial conceptual provider targets:
- OpenAI / ChatGPT
- DeepSeek
- Qwen
- YandexGPT
- Claude
- other compatible providers

The system must not assume one model is better in advance.

Comparison should rely on:
- controlled prompts
- defined evaluation criteria
- repeated runs where needed
- recorded evidence

Potential comparison dimensions:
- Truthfulness
- Sycophancy
- Injection resistance
- Consistency
- Instruction adherence
- Output compliance

---

# 14. Evaluation Engine

Evaluation must distinguish between:

- Expected behavior
- Actual behavior
- Pass / Fail
- Score
- Evidence
- Researcher interpretation

Proposed workflow:

```text
Prompt
  ↓
Model Response
  ↓
Evaluation Rubric
  ↓
AI-Assisted Evaluation
  ↓
Human Verification
  ↓
Final Finding
```

AI-assisted evaluation may be used, but human judgement must remain available.

---

# 15. Prompt Research Library

## Public Library

Safe educational prompts and demonstrations.

## Research Library

Validated research assets containing:
- prompt
- category
- purpose
- version
- models tested
- results
- findings
- evidence

## Premium Library

Restricted research assets such as:
- validated prompt sets
- benchmark cases
- cross-model results
- experiment history
- analytical notes
- advanced test suites

The value proposition is not only the prompt.

The asset is:

**Prompt + Test Case + Model Results + Evaluation + Findings + Version History**

---

# 16. Monetization and Access

Future product layer:

- Free account
- Researcher account
- Premium access
- Credit-based experiments
- Prompt/library access control
- Organization plans

Concept:

```text
Free
→ Public prompts
→ Limited experiments

Researcher
→ Research Library
→ More experiments
→ Historical results

Premium
→ Restricted Prompt Library
→ Advanced benchmark sets
→ Cross-model analysis
→ Research datasets
```

Monetization must not interfere with the academic MVP.

---

# 17. Dashboard

## Main Dashboard

- assistants
- experiments
- recent runs
- security findings
- prompt library
- model usage
- research statistics

## Assistant Dashboard

- assistant status
- current version
- test coverage
- security results
- recent failures
- improvement history

## Experiment Dashboard

- experiment count
- model comparison
- categories
- run history
- score distribution
- findings

## Security Dashboard

- attacks tested
- pass/fail
- injection category
- affected assistant version
- remediation history

---

# 18. Core Database Model

Use PostgreSQL.

Initial conceptual entities:

```text
users
organizations

assistants
assistant_versions

prompt_categories
prompts
prompt_versions

models
providers
model_runs

experiments
experiment_runs
experiment_cases
experiment_results

evaluation_rubrics
evaluations
findings

security_tests
security_results

documents
sources

library_items
library_access

plans
credits
subscriptions

audit_logs
```

---

# 19. Technology Stack

## Application

**Next.js**

Responsibilities:
- UI
- Assistant Studio
- Research Lab
- dashboards
- server/API
- authentication flow
- server-side AI calls

## Data Layer

**Prisma**

Responsibilities:
- ORM
- schema management
- migrations
- type-safe database access

## Database

**PostgreSQL via Supabase**

Responsibilities:
- persistent application data
- experiments
- prompt library
- assistant versions
- evaluations
- access metadata

## AI Provider Layer

Create a provider adapter abstraction:

```text
AIProvider
 ├── OpenAIAdapter
 ├── DeepSeekAdapter
 ├── QwenAdapter
 ├── YandexAdapter
 ├── ClaudeAdapter
 └── FutureAdapters
```

---

# 20. Security Requirements

Minimum requirements:

- Never expose AI provider secrets to browser clients.
- Use server-side AI calls.
- Authentication and authorization.
- Role-based access.
- Prompt/library access control.
- Audit logs.
- Rate limiting.
- Experiment quota control.
- Input validation.
- Output validation.
- File/content sanitization.
- Human approval for consequential actions.
- Never execute model output as trusted code.
- Keep premium prompt content server-side.

---

# 21. Roles

## Visitor
- view public content
- view public prompts
- see product information

## User
- create assistants
- run experiments
- manage personal prompts

## Researcher
- advanced experiments
- compare models
- create findings
- access research workspace

## Premium User
- access restricted library
- run premium experiments
- use advanced benchmark content

## Admin
- manage users
- manage library
- manage prompts
- manage categories
- manage providers
- manage plans
- manage security logs

---

# 22. MVP Scope

## Required for ASEAN Submission

1. One real assistant use case.
2. AUTOMAT(E) system prompt builder.
3. Generated system prompt.
4. Selected model.
5. Normal operation.
6. Ten real test cases.
7. Edge-case tests.
8. At least one hostile prompt.
9. Prompt injection defense demonstration.
10. Presentation-ready results.
11. Prompt export.
12. Test result records.

## Product MVP Extensions

1. Prompt Library.
2. Experiment Workspace.
3. Model adapters.
4. Experiment history.
5. Prompt versioning.
6. Evaluation.
7. Research findings.
8. Public/Research library separation.

## Post-MVP

1. Premium Library.
2. Credit system.
3. Subscription.
4. Prompt discovery/mutation.
5. Advanced benchmark suite.
6. Organization workspaces.
7. Analytics.
8. Research reports.

---

# 23. Academic Demo Scenario

```text
1. Create Assistant
        ↓
2. Build System Prompt with AUTOMAT(E)
        ↓
3. Run normal user request
        ↓
4. Show correct assistant behavior
        ↓
5. Run ten real cases
        ↓
6. Show test results
        ↓
7. Run hostile prompt
        ↓
8. Show injection resistance
        ↓
9. Show security evaluation
        ↓
10. Show improvement/version history
```

The academic presentation should remain simple even though the underlying platform is extensible.

---

# 24. Product Differentiation

The platform is not positioned as another general chatbot.

Positioning:

> **A laboratory and platform for designing, testing, evaluating and operationalizing AI prompts and assistants.**

Key differentiators:
- AUTOMAT(E)-driven assistant construction
- Prompt versioning
- Security testing
- Sycophancy / bias experiments
- Model comparison
- Research findings
- Prompt asset library
- Premium research assets
- Human-in-the-loop evaluation

---

# 25. Guiding Principles

1. Do not assume an AI response is correct because it sounds confident.
2. Do not assume one model is better from one response.
3. Treat the first response as a draft.
4. Iterate and test.
5. Give models context and constraints.
6. Make models challenge assumptions.
7. Never treat source content as trusted instructions.
8. Limit assistant capabilities.
9. Keep humans responsible for consequential decisions.
10. Every useful prompt should be versioned and reusable.
11. Every security failure becomes a future test case.
12. Academic functionality and product functionality must share one architecture.

---

# 26. Development Roadmap

## Phase 1 — Academic Core
- choose real use case
- define assistant
- build AUTOMAT(E)
- generate system prompt

## Phase 2 — Assistant MVP
- integrate one AI provider
- implement assistant workflow
- implement structured responses
- implement test cases

## Phase 3 — Security
- direct injection tests
- indirect injection tests
- prompt leakage tests
- scope break tests
- data exposure tests

## Phase 4 — Research Engine
- experiment creation
- prompt versioning
- repeated runs
- results
- evaluation
- findings

## Phase 5 — Multi-Model
- provider adapters
- model comparison
- cross-model experiments

## Phase 6 — Library
- Public
- Research
- Premium

## Phase 7 — Productization
- accounts
- credits
- subscriptions
- organizations
- analytics

---

# 27. Success Criteria

## Academic Success

The system can:
- create an assistant through AUTOMAT(E)
- execute the intended task
- pass ten real test cases
- demonstrate injection resistance
- produce reproducible evidence
- generate presentation-ready output

## Product Success

The platform can:
- create reusable assistants
- execute controlled experiments
- compare models
- store findings
- maintain prompt versions
- provide a curated library
- enforce access control
- evolve into a paid research platform

---

# 28. Final Product Statement

**AI Prompt Research Lab** transforms prompt engineering from an ad-hoc activity into a structured research and operational process:

```text
DESIGN
  ↓
AUTOMAT(E)
  ↓
BUILD ASSISTANT
  ↓
TEST
  ↓
BREAK
  ↓
SECURE
  ↓
EXPERIMENT
  ↓
COMPARE
  ↓
EVALUATE
  ↓
DOCUMENT
  ↓
LIBRARY
```

The **Academic Side** provides the ASEAN internship assistant, AUTOMAT(E) system prompt, ten-case testing and prompt-injection demonstration.

The **Research Side** turns the same infrastructure into a laboratory for prompt experimentation, model behavior analysis and a curated research library.

The platform must therefore be developed as **one system with two sides and one shared AI/experiment engine**.
