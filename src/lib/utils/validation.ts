/**
 * Validation result interface
 */
export interface ValidationResult {
	valid: boolean;
	message?: string;
}

/**
 * Validation helper for required fields
 */
export function required(value: any, message = 'This field is required'): ValidationResult {
	const valid = !!value && (typeof value !== 'string' || value.trim() !== '');
	return { valid, message: valid ? undefined : message };
}

/**
 * Validation helper for minimum length
 */
export function minLength(min: number, message?: string): (value: string) => ValidationResult {
	return (value: string): ValidationResult => {
		const valid = value.length >= min;
		return {
			valid,
			message: valid ? undefined : message || `Must be at least ${min} characters`
		};
	};
}

/**
 * Validation helper for maximum length
 */
export function maxLength(max: number, message?: string): (value: string) => ValidationResult {
	return (value: string): ValidationResult => {
		const valid = value.length <= max;
		return {
			valid,
			message: valid ? undefined : message || `Cannot exceed ${max} characters`
		};
	};
}

/**
 * Validation helper for pattern matching
 */
export function pattern(
	regex: RegExp,
	message = 'Invalid format'
): (value: string) => ValidationResult {
	return (value: string): ValidationResult => {
		const valid = regex.test(value);
		return { valid, message: valid ? undefined : message };
	};
}

/**
 * Validation helper for number range
 */
export function numberRange(
	min: number,
	max: number,
	message?: string
): (value: number) => ValidationResult {
	return (value: number): ValidationResult => {
		const valid = value >= min && value <= max;
		return {
			valid,
			message: valid ? undefined : message || `Must be between ${min} and ${max}`
		};
	};
}

/**
 * Compose multiple validators
 */
export function compose(
	...validators: ((value: any) => ValidationResult)[]
): (value: any) => ValidationResult {
	return (value: any): ValidationResult => {
		for (const validator of validators) {
			const result = validator(value);
			if (!result.valid) {
				return result;
			}
		}
		return { valid: true };
	};
}
