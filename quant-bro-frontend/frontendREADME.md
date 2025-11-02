# QuantBro — Frontend 🌊🎮

A simple, demo frontend for the QuantBro Solana program. This is a hackathon project — experimental and NOT production‑ready. Use for learning and demo only.

---

## Quick Disclaim (must read) ⚠️
Disclaim: Due to limited Solana faucet rates you must obtain your own Solana dev wallet by running `solana-keygen new` then visiting a faucet website (examples below) to airdrop SOL. When using the faucet websites, always provide the *public key* (the wallet address) shown after creating the keypair. Only use the JSON keypair (private key) when connecting to the app at https://quantbro.tech. Keep the JSON file private and never publish it.

This is a hackathon project — many security concerns exist (e.g., using a private key file as a login). Do NOT use this code or private key handling in production.

---

## Prerequisites ✅
- Solana CLI (solana-keygen)
- A text editor / JSON viewer (to open the generated keypair JSON)

---

## Step-by-step — Get started (3 easy steps) 🚀

1) Create a new dev wallet (one command)
- Open terminal:
  - solana-keygen new --outfile ~/quantbro-dev-wallet.json
- Note the PUBLIC KEY printed; this is your address.

2) Fund the wallet via a faucet (use the PUBLIC KEY)
- Open one of these devnet faucets and paste the PUBLIC KEY (not the JSON):
  - https://faucet.solana.com/
  - https://solfaucet.togatech.org/
- Confirm funds with:
  - solana balance --keypair ~/quantbro-dev-wallet.json

3) Try the public demo (final step)
- Visit: https://quantbro.tech
- Obtain your JSON keypair by navigating to the output you provided earlier in the keygen
- Only import the JSON keypair into the site if you trust the environment.
- Enjoy the demo!

---

## Quick tips & warnings 🔐
- Use the PUBLIC KEY on faucet sites. Do NOT paste the JSON (private key) anywhere except when explicitly required by a trusted client (here: https://quantbro.tech) and only temporarily.
- Do NOT commit keypair files to git. Add them to `.gitignore`.

---

## Technologies used 🛠️
- React + TypeScript + Vite — fast UI and dev tooling
- Anchor (Rust & TS) — Solana program framework; frontend uses the program IDL to make RPC calls
- Solana CLI — key generation and wallet management
- Demo hosted at https://www.quantbro.tech — the canonical demo location

---

## Why this is a hackathon project 🧪
- Rapid prototyping: minimal validation, quick auth patterns (JSON key import), and limited security.
- Not audited — for learning and demos only. Exercise caution with private keys and funds.

---

## Need help? ❓
If something fails on the public demo, copy the browser console or network error messages (without secrets) and open an issue or contact the maintainer. For redeploys or developer work, check the companion server repo (`../quant-bro-server`).

---

Enjoy! ✨  
