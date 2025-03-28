import type { ButtonConfig } from './config';
import type { EncoderConfig } from './config';

export interface ComponentBase {
	id: string;
	type: 'button' | 'encoder' | 'display';
	position: {
		x: number;
		y: number;
	};
}

export interface ButtonComponent extends ComponentBase {
	type: 'button';
	config: ButtonConfig;
}

export interface EncoderComponent extends ComponentBase {
	type: 'encoder';
	config: EncoderConfig;
}

export interface DisplayComponent extends ComponentBase {
	type: 'display';
	config: {
		width: number;
		height: number;
		content: string;
	};
}

export type Component = ButtonComponent | EncoderComponent | DisplayComponent;
