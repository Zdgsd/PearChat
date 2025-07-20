'use server';
/**
 * @fileOverview A flow to synchronize shared application state.
 * This acts as a simple, centralized "database" in memory for demo purposes.
 *
 * - syncState - Merges provided updates with the current state and returns the full state.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { AppState, AppStateSchema, RoomSchema, ProfileSchema } from '@/ai/schemas';

// This is our in-memory "database". In a real app, this would be a proper database.
let sharedState: AppState = {
  rooms: [],
  profiles: [],
};

const syncStateFlow = ai.defineFlow(
  {
    name: 'syncStateFlow',
    inputSchema: AppStateSchema.deepPartial(),
    outputSchema: AppStateSchema,
  },
  async (updates) => {
    // Merge rooms: Add new rooms and update existing ones.
    if (updates.rooms) {
      updates.rooms.forEach((updatedRoom) => {
        if (!updatedRoom || !updatedRoom.id) return;
        const index = sharedState.rooms.findIndex((r) => r.id === updatedRoom.id);
        if (index !== -1) {
          // Update existing room
          sharedState.rooms[index] = { ...sharedState.rooms[index], ...updatedRoom };
        } else {
          // Add new room
          sharedState.rooms.push(updatedRoom as z.infer<typeof RoomSchema>);
        }
      });
    }

    // Merge profiles: Add new profiles and update existing ones.
    if (updates.profiles) {
      updates.profiles.forEach((updatedProfile) => {
        if (!updatedProfile || !updatedProfile.username) return;
        const index = sharedState.profiles.findIndex((p) => p.username === updatedProfile.username);
        if (index !== -1) {
          // Update existing profile
          sharedState.profiles[index] = { ...sharedState.profiles[index], ...updatedProfile };
        } else {
          // Add new profile
          sharedState.profiles.push(updatedProfile as z.infer<typeof ProfileSchema>);
        }
      });
    }
    
    // Return the complete, updated state.
    return sharedState;
  }
);

export async function syncState(updates: z.input<typeof syncStateFlow>): Promise<AppState> {
    return syncStateFlow(updates);
}
