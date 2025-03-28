export interface MacropadConfig {
	name: string;
	version: string;
	buttons: ButtonConfig[];
	encoders: EncoderConfig[];
	display: DisplayConfig;
}

export interface ButtonConfig {
	id: number;
	label: string;
	action: string;
	macro?: string;
	keyCode?: number;
	modifiers?: string[];
	color?: string;
}

export interface EncoderConfig {
	id: number;
	clockwise: ActionConfig;
	counterClockwise: ActionConfig;
	press?: ActionConfig;
}

export interface ActionConfig {
	type: 'keypress' | 'macro' | 'special' | 'none';
	value: string;
	modifiers?: string[];
}

export interface DisplayConfig {
	brightness: number;
	timeout: number;
	defaultScreen: string;
	screens?: ScreenConfig[];
}

export interface ScreenConfig {
	id: string;
	name: string;
	content: string;
}
