/**
 * Configuration Module
 *
 * Central re-export point for all configuration.
 * This allows both granular imports and convenience imports.
 *
 * Usage:
 * - Granular: import { DARTS_COLOR_TO_MULTI } from '$lib/config/games/darts.config';
 * - Convenient: import { DARTS_COLOR_TO_MULTI, TEXT_HIGHLIGHT_COLOR } from '$lib/config';
 */

// UI configuration
export * from './ui';

// Game configuration
export * from './games';
