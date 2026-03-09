// Drill multiplier calculation
// Formula: multiplier = u < 0.02 ? 1 : min(0.98 / (1 - u), 2000000)
// House edge: 0.98 (2%)

const HOUSE_EDGE = 0.98;
const MAX_MULTIPLIER = 2000000;
const MIN_THRESHOLD = 0.02;

export function calculateDrillMultiplier(float: number): number {
	if (float < MIN_THRESHOLD) {
		return 1;
	}

	const rawMultiplier = HOUSE_EDGE / (1 - float);
	return Math.min(rawMultiplier, MAX_MULTIPLIER);
}
