'use server'

import { revalidatePath } from 'next/cache';
import { prisma } from './lib/data';
import { redirect } from 'next/navigation';

export async function updateMatchResult(formData: FormData) {
  const matchId = formData.get('matchId') as string;
  const winnerId = formData.get('winnerId') as string;
  const score1 = formData.get('score1') as string;
  const score2 = formData.get('score2') as string;
  
  if (!matchId || !winnerId) return;

  await prisma.match.update({
    where: { id: matchId },
    data: {
      winnerId: winnerId,
      score1: score1,
      score2: score2,
      completed: 'YES',
    }
  });

  revalidatePath('/matches');
  revalidatePath('/');
  revalidatePath('/standings');
}

export async function addPenalty(formData: FormData) {
  const teamId = formData.get('teamId') as string;
  const points = parseInt(formData.get('points') as string) || 20;

  await prisma.team.update({
    where: { id: teamId },
    data: {
      penalty_points: {
        increment: points
      }
    }
  });

  revalidatePath('/teams');
  revalidatePath('/standings');
}
