use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("5yr3xFhjPEC7p7YncQhjQKrANRa6tyYjqcbQYbwvszdG");

#[program]
pub mod skillbet_challenge {
    use super::*;

    pub fn create_challenge(
    ctx: Context<CreateChallenge>,
    title: String,
    stake_amount: u64,
    validators: Vec<Pubkey>,
) -> Result<()> {
    let challenge = &mut ctx.accounts.challenge;
    let creator = &ctx.accounts.creator;
    let stake_account = &ctx.accounts.stake_account;
    
    // Transfer stake amount from creator to stake account
    let transfer_ix = system_instruction::transfer(
        &creator.key(),
        &stake_account.key(),
        stake_amount,
    );
    
    anchor_lang::solana_program::program::invoke(
        &transfer_ix,
        &[
            creator.to_account_info(),
            stake_account.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;

    challenge.creator = creator.key();
    challenge.title = title;
    challenge.stake_amount = stake_amount;
    challenge.validators = validators;
    challenge.approvals = vec![];
    challenge.rejections = vec![];
    challenge.status = ChallengeStatus::Pending;
    challenge.stake_account = stake_account.key();
    
    Ok(())
}

    pub fn vote(ctx: Context<Vote>, approve: bool) -> Result<()> {
    require!(
        ctx.accounts.challenge.status == ChallengeStatus::Pending,
        ChallengeError::ChallengeCompleted
    );
        let challenge = &mut ctx.accounts.challenge;
        let voter = ctx.accounts.validator.key();

        require!(
            challenge.validators.contains(&voter),
            ChallengeError::NotAValidator
        );

        if approve {
            if !challenge.approvals.contains(&voter) {
                challenge.approvals.push(voter);
            }
        } else {
            if !challenge.rejections.contains(&voter) {
                challenge.rejections.push(voter);
            }
        }

        let total = challenge.validators.len() as u64;
        if challenge.approvals.len() as u64 > total / 2 {
            challenge.status = ChallengeStatus::Approved;
        } else if challenge.rejections.len() as u64 > total / 2 {
            challenge.status = ChallengeStatus::Rejected;
        }

        if challenge.status == ChallengeStatus::Rejected {
   
        let reward_per_validator = challenge.stake_amount / challenge.validators.len() as u64;
        for validator in &challenge.validators {
        
        }
}

        Ok(())
    }

    pub fn resolve_challenge(ctx: Context<ResolveChallenge>) -> Result<()> {
        require!(
        ctx.accounts.creator.key() == ctx.accounts.challenge.creator,
        ChallengeError::Unauthorized
    );
    let challenge = &mut ctx.accounts.challenge;
    
    require!(
        challenge.status != ChallengeStatus::Pending,
        ChallengeError::ChallengeNotCompleted
    );
    
    let stake_account = &ctx.accounts.stake_account;
    let creator = &ctx.accounts.creator;
    
    // Return funds if approved
    if challenge.status == ChallengeStatus::Approved {
        let transfer_ix = system_instruction::transfer(
            &stake_account.key(),
            &creator.key(),
            challenge.stake_amount,
        );
        
        anchor_lang::solana_program::program::invoke(
            &transfer_ix,
            &[
                stake_account.to_account_info(),
                creator.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;
    }
    
    
    Ok(())
}
}

#[derive(Accounts)]
pub struct ResolveChallenge<'info> {
    #[account(mut, close = creator)] 
    #[account(mut)]
    pub challenge: Account<'info, Challenge>,
    #[account(mut)]
   
    pub stake_account: UncheckedAccount<'info>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateChallenge<'info> {
    #[account(init, payer = creator, space = 8 + Challenge::MAX_SIZE)]
    pub challenge: Account<'info, Challenge>,
    #[account(mut)]
    pub creator: Signer<'info>,   
    #[account(
        mut,
        constraint = stake_account.lamports() >= stake_amount @ ChallengeError::InsufficientFunds
    )]
    pub stake_account: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut)]
    pub challenge: Account<'info, Challenge>,
    pub validator: Signer<'info>,
}

#[account]
pub struct Challenge {
    pub creator: Pubkey,
    pub title: String,
    pub stake_amount: u64,
    pub validators: Vec<Pubkey>,
    pub approvals: Vec<Pubkey>,
    pub rejections: Vec<Pubkey>,
    pub status: ChallengeStatus,
    pub stake_account: Pubkey, 
    pub created_at: i64,
    pub timeout: i64,
}

impl Challenge {
    pub const MAX_SIZE: usize = 32 + 4 + 100 + 8 + (32 * 10) + (32 * 10) + (32 * 10) + 1 + 32;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ChallengeStatus {
    Pending,
    Approved,
    Rejected,
}

#[event]
pub struct ChallengeCreated {
    pub challenge: Pubkey,
    pub creator: Pubkey,
    pub stake_amount: u64,
}

#[event]
pub struct ChallengeResolved {
    pub challenge: Pubkey,
    pub status: ChallengeStatus,
    pub payout_amount: u64,
}

#[error_code]
pub enum ChallengeError {
    #[msg("You are not a validator for this challenge.")]
    NotAValidator,
    #[msg("Challenge voting is not yet completed.")]
    ChallengeNotCompleted,
    #[msg("Insufficient funds in stake account")]
    InsufficientFunds,
    #[msg("Unauthorized action")]
    Unauthorized,
    #[msg("Challenge has already been completed")]
    ChallengeCompleted,
    #[msg("Challenge has expired")]
    ChallengeExpired,
}
