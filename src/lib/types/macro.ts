export interface Macro {
	id: string;
	name: string;
	description: string;
	sequence: MacroStep[];
}

export interface MacroStep {
	type: 'keypress' | 'delay' | 'text' | 'special';
	value: string | number;
	modifiers?: string[];
}

export type KeyModifier = 'shift' | 'ctrl' | 'alt' | 'meta' | 'gui';
