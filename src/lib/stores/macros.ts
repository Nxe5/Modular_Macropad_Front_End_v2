import { writable } from 'svelte/store';
import type { Macro } from '$lib/types/macro';

export const macros = writable<Macro[]>([]);

export const addMacro = (macro: Macro) => {
	macros.update((current) => [...current, macro]);
};

export const updateMacro = (id: string, updatedMacro: Partial<Macro>) => {
	macros.update((current) =>
		current.map((macro) => (macro.id === id ? { ...macro, ...updatedMacro } : macro))
	);
};

export const deleteMacro = (id: string) => {
	macros.update((current) => current.filter((macro) => macro.id !== id));
};
