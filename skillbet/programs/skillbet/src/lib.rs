use anchor_lang::prelude::*;

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
        challenge.creator = ctx.accounts.creator.key();
        challenge.title = title;
        challenge.stake_amount = stake_amount;
        challenge.validators = validators;
        challenge.approvals = vec![];
        challenge.rejections = vec![];
        challenge.status = ChallengeStatus::Pending;
        Ok(())
    }

    pub fn vote(ctx: Context<Vote>, approve: bool) -> Result<()> {
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

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateChallenge<'info> {
    #[account(init, payer = creator, space = 8 + Challenge::MAX_SIZE)]
    pub challenge: Account<'info, Challenge>,
    #[account(mut)]
    pub creator: Signer<'info>,
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
}

impl Challenge {
    pub const MAX_SIZE: usize = 32 + 4 + 100 + 8 + (32 * 10) + (32 * 10) + (32 * 10) + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ChallengeStatus {
    Pending,
    Approved,
    Rejected,
}

#[error_code]
pub enum ChallengeError {
    #[msg("You are not a validator for this challenge.")]
    NotAValidator,
}