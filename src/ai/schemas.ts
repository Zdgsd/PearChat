/**
 * @fileOverview Shared schemas and types for the application state.
 */

import { z } from 'zod';

export const RoomSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['public', 'private']),
});

export const ProfileSchema = z.object({
  username: z.string(),
  bio: z.string().optional(),
  isPublic: z.boolean(),
  avatar: z.string().nullable(),
});

export const AppStateSchema = z.object({
  rooms: z.array(RoomSchema),
  profiles: z.array(ProfileSchema),
});

export type AppState = z.infer<typeof AppStateSchema>;
