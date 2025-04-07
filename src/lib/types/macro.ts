export interface Macro {
	id: string;
	name: string;
	description: string;
	commands: MacroCommand[];
}

export interface MacroCommand {
	type: string;
	[key: string]: any;
}

export interface MacroStep {
	type: 'keypress' | 'delay' | 'text' | 'special';
	value: string | number;
	modifiers?: string[];
}

export type KeyModifier = 'shift' | 'ctrl' | 'alt' | 'meta' | 'gui';
