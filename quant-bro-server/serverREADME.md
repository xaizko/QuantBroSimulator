# QuantBro — Solana Server (Anchor) ⚙️🦾

A compact Anchor/Rust Solana program used by the QuantBro frontend/demo.  
This is a hackathon project — experimental, minimal security, and intended for learning and demos.

---

## What this program does — high level 🎯
- Manages a very small on‑chain "player" account type (PlayerData) that records:
  - player pubkey
  - a SOL balance
  - the PDA bump seed
- Exposes two instructions:
  1. initialize_player — create a PDA for the caller and set a default balance
  2. exchange_money — increments the player's demo balance (simulates buying tokens)

These are implemented in:
- programs/quant-bro-server/src/lib.rs

The program uses a PDA derived from the seed pair:
- seeds = [b"player", user_pubkey]

The program ID currently declared in code:
- declare_id!("6oy9TxCtaq4EJ7fvMDwau8w9S8fwQ9azRiGiWjZYJGgB")
Update this if you redeploy to a different address.

---

## Key types & accounts explained ✨

PlayerData account (on‑chain)
- Fields:
  - player: Pubkey (32 bytes)
  - sol_balance: u64 (8 bytes)
  - bump: u8 (1 byte)
- Allocated space in InitializePlayer:
  - 8 (Anchor discriminator) + 32 + 8 + 1 = 49 bytes

PDA derivation
- seed namespace: `b"player"`
- seed content: user's public key bytes
- bump: stored on account and used on account access

System program
- The `system_program` is the runtime program that creates accounts and transfers lamports — required when creating (init + payer) a new account.

Anchor provider / client (how frontend talks to this program)
- AnchorProvider (TS) wraps:
  - a Connection to an RPC node
  - a Wallet to sign transactions
- Frontend usage pattern:
  - wait for wallet connect → create AnchorProvider → new Program(idl, programId, provider)
- Types for TS generated client are in `types/quant_bro_server.ts` and the IDL is in `idl/quant_bro_server.json`

---

## Quick start — build, test, deploy 🛠️

Prerequisites
- Rust toolchain (as configured with rust-toolchain.toml)
- Anchor CLI
- Solana CLI
- Node.js (for migrations / TS tests)

Common commands
1. Build the program
```bash
anchor build
```

2. Deploy to the configured cluster (check Anchor.toml for `cluster` and provider settings)
```bash
anchor deploy
```
- After deploy, copy the generated IDL (target/idl/quant_bro_server.json) to `idl/` or ensure your frontend uses the latest idl.
- If the program ID changes, update the `declare_id!` in lib.rs or update frontend to use the new program id. Best practice: let Anchor manage program IDs and keep the IDL in sync.

---

## Development tips & gotchas 🔍
- Keep the IDL in sync with the deployed program. Mismatched IDL ↔ program causes deserialization and RPC failures.
- PDA seeds must match client-side derivation exactly: same seed order, same bytes.
- Space calculation must include Anchor's 8-byte discriminator.
- When calling instructions from the frontend, ensure the wallet is connected and used to build the AnchorProvider before constructing Program.
- For quick local debugging, `anchor test` is the simplest path — it runs the validator, deploys, and runs tests automatically.

---

## Security & hackathon disclaimers ⚠️
- This is a hackathon prototype. Minimal validation, no thorough security audit.
- Do not use this code handling real funds or production sensitive workflows without a security review.
- Keep private keys and deployment keypairs secure.
