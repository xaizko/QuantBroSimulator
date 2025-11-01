use anchor_lang::prelude::*;

declare_id!("6oy9TxCtaq4EJ7fvMDwau8w9S8fwQ9azRiGiWjZYJGgB");

#[program]
pub mod quant_bro_server {
    use super::*;

    pub fn initialize_player(ctx: Context<InitializePlayer>) -> Result<()> {
        Ok(())
    }
}

#[account] 
pub struct PlayerData {
    pub player: Pubkey, 
    pub sol_balance: u64,
    pub bump: u8, // bump seed for PDA 
}

#[derive(Accounts)]
pub struct InitializePlayer<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 8 + 1, // 8 for anchor's discrminator, 32 for pub key, 8 u64, 1 u8
        seeds = [b"player", user.key().as_ref()], // combines word player with user pub key to
                                                  // generate PDA
        bump,
    )]
    pub player_data: Account<'info, PlayerData>,

    // Player calling function
    #[account(mut)]
    pub user: Signer<'info>,

    // System program for creating accounts
    pub system_program: Program<'info, System>,
}
