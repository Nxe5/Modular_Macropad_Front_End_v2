import { writable } from 'svelte/store';

export interface LayoutConfig {
	id: string;
	name: string;
	rows: number;
	columns: number;
	buttonPositions: ButtonPosition[];
	encoderPositions: EncoderPosition[];
	displayPosition: DisplayPosition | null;
}

export interface ButtonPosition {
	id: number;
	row: number;
	col: number;
	rowSpan?: number;
	colSpan?: number;
}

export interface EncoderPosition {
	id: number;
	row: number;
	col: number;
}

export interface DisplayPosition {
	row: number;
	col: number;
	rowSpan: number;
	colSpan: number;
}

const defaultLayout: LayoutConfig = {
	id: 'default',
	name: 'Default Layout',
	rows: 4,
	columns: 4,
	buttonPositions: [],
	encoderPositions: [],
	displayPosition: null
};

export const currentLayout = writable<LayoutConfig>(defaultLayout);

export const updateLayout = (newLayout: Partial<LayoutConfig>) => {
	currentLayout.update((current) => ({
		...current,
		...newLayout
	}));
};
