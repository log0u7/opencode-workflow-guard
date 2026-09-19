/**
 * Workflow Guard TUI companion plugin for OpenCode V2 (CLI plugin API).
 *
 * - Registers the `/guard-options` palette + slash command to toggle project options.
 * - Renders the Workflow Guard badge in the home and prompt footer status slots.
 *
 * The V1 entrypoint (`WorkflowGuardTui`) remains for OpenCode 1.x TUI clients.
 */

import type { TuiPlugin, TuiPluginModule } from "@opencode-ai/plugin/tui";
import { Plugin } from "@opencode/plugin/tui";
import type { JSX } from "@opentui/solid";
import { createElement, insert, setProp } from "@opentui/solid";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative } from "node:path";
import { applyEdits, modify, parse, type ParseError } from "jsonc-parser";
import { projectConfigPath } from "./lib/project-config.ts";
import { canonicalPath } from "./policies/file-claims.ts";

type Child = JSX.Element | string | number | null | undefined | false;

function element(
	tag: string,
	props: Record<string, unknown>,
	children: Child[] = [],
) {
	const node = createElement(tag);
	for (const [key, value] of Object.entries(props)) {
		if (value !== undefined) setProp(node, key, value);
	}
	for (const child of children) {
		if (child === null || child === undefined || child === false) continue;
		insert(node, child);
	}
	return node as unknown as JSX.Element;
}

function text(props: Record<string, unknown>, children: Child[]) {
	return element("text", props, children);
}

const BADGE_ACTIVE = "Workflow Guard 🛡️";

type ProjectToggle = "recoveryCheckpoints" | "projectMemory" | "learning" | "titleSettleWorkaround" | "ralphMode";

export function readProjectOption(root: string, option: ProjectToggle): boolean {
	const path = projectConfigPath(root);
	const enabledByDefault = option === "projectMemory" || option === "titleSettleWorkaround";
	if (!existsSync(path)) return enabledByDefault;
	const errors: ParseError[] = [];
	const config = parse(readFileSync(path, "utf8"), errors, { allowTrailingComma: true });
	if (errors.length > 0) throw new Error(`Invalid Workflow Guard project config: ${path}`);
	return enabledByDefault ? config?.[option] !== false : config?.[option] === true;
}

function writeProjectOption(root: string, option: ProjectToggle, enabled: boolean): string {
	const path = projectConfigPath(root);
	const raw = existsSync(path) ? readFileSync(path, "utf8") : "{}\n";
	const errors: ParseError[] = [];
	parse(raw, errors, { allowTrailingComma: true });
	if (errors.length > 0) throw new Error(`Invalid Workflow Guard project config: ${path}`);
	const realRoot = canonicalPath(root);
	const realPath = canonicalPath(path);
	const rel = relative(realRoot, realPath);
	if (rel === ".." || rel.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`) || isAbsolute(rel)) {
		throw new Error(`Refusing to write Workflow Guard config outside project: ${path}`);
	}
	const next = applyEdits(raw, modify(raw, [option], enabled, {
		formattingOptions: { insertSpaces: true, tabSize: 2 },
	}));
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, next.endsWith("\n") ? next : next + "\n");
	return path;
}

export function readRecoveryCheckpointsOption(root: string): boolean {
	return readProjectOption(root, "recoveryCheckpoints");
}

export function writeRecoveryCheckpointsOption(root: string, enabled: boolean): string {
	return writeProjectOption(root, "recoveryCheckpoints", enabled);
}

export function formatBadge(): { text: string; isBlocked: boolean } {
	return { text: BADGE_ACTIVE, isBlocked: false };
}

// ── V2 CLI plugin ─────────────────────────────────────────────────────────────

type TuiContext = Plugin.Context;

const TOGGLE_OPTIONS: Array<{ key: ProjectToggle; label: string; description: string }> = [
	{ key: "recoveryCheckpoints", label: "Recovery checkpoints", description: "Toggle durable pre-run Git checkpoints" },
	{ key: "projectMemory", label: "Project memory", description: "Toggle durable local project memory" },
	{ key: "learning", label: "Learner mode", description: "Toggle evidence-based learning tools" },
	{ key: "titleSettleWorkaround", label: "Title settle workaround", description: "Delay automatic continuation while OpenCode generates a session title" },
	{ key: "ralphMode", label: "Ralph mode", description: "Opt into bounded autonomous continuation of already-owned todos" },
];

export const WorkflowGuardTuiV2 = (ctx: TuiContext) => {
	const badge = () => {
		const formatted = formatBadge();
		return text({ fg: ctx.theme.text.feedback.success.base }, [formatted.text]);
	};

	const optionsRoot = () => ctx.location?.directory || process.cwd();

	ctx.keymap.layer(() => ({
		commands: [{
			id: "workflow-guard.project-options",
			title: "Workflow Guard: Project Options",
			description: "Toggle Workflow Guard project options (recovery checkpoints, project memory, learning, title settle, ralph mode)",
			group: "Workflow Guard",
			palette: true,
			slash: { name: "guard-options" },
			async run() {
				const root = optionsRoot();
				for (;;) {
					const current = new Map(TOGGLE_OPTIONS.map((option) => [option.key, readProjectOption(root, option.key)]));
					const choice = await ctx.ui.dialog.select<ProjectToggle>({
						title: "Workflow Guard Project Options",
						options: TOGGLE_OPTIONS.map((option) => ({
							title: `${option.label}: ${current.get(option.key) ? "On" : "Off"}`,
							value: option.key,
							description: option.description,
						})),
					});
					if (!choice) break;
					try {
						const enabled = !readProjectOption(root, choice);
						const path = writeProjectOption(root, choice, enabled);
						ctx.ui.toast.show({
							variant: "success",
							title: "Workflow Guard",
							message: `Saved ${choice} ${enabled ? "on" : "off"} in ${path}. Restart OpenCode to apply.`,
						});
					} catch (error) {
						ctx.ui.toast.show({
							variant: "error",
							title: "Workflow Guard",
							message: error instanceof Error ? error.message : String(error),
						});
						break;
					}
				}
			},
		}],
		bindings: [],
	}));

	ctx.ui.slot({ append: "home.footer.status", render: () => badge() });
	ctx.ui.slot({ append: "prompt.footer.status", render: () => badge() });

	return () => {
		// Slot claims and keymap layers are disposed automatically on unload.
	};
};

// ── V1 TUI plugin ─────────────────────────────────────────────────────────────

export const WorkflowGuardTui: TuiPlugin = async (api) => {
	api.keymap.registerLayer({
		commands: [{
			name: "workflow-guard.project-options",
			title: "Workflow Guard: Project Options",
			category: "Workflow Guard",
			namespace: "palette",
			slashName: "guard-options",
			run() {
				const root = api.state.path.worktree || api.state.path.directory;
				const toggle = (key: ProjectToggle) => {
					const enabled = !readProjectOption(root, key);
					const path = writeProjectOption(root, key, enabled);
					api.ui.dialog.clear();
					api.ui.toast({ variant: "success", title: "Workflow Guard", message: `Saved ${key} ${enabled ? "on" : "off"} in ${path}. Restart OpenCode to apply.` });
				};
				api.ui.dialog.replace(() => api.ui.DialogSelect({
					title: "Workflow Guard Project Options",
					current: undefined,
					options: TOGGLE_OPTIONS.map((option) => ({
						title: `${option.label}: ${readProjectOption(root, option.key) ? "On" : "Off"}`,
						value: option.key,
						description: option.description,
						onSelect: () => toggle(option.key),
					})),
				}));
			},
		}],
		bindings: [],
	});

	api.slots.register({
		order: 1,
		slots: {
			home_prompt_right() {
				const theme = api.theme.current;
				const badge = formatBadge();
				return text({ fg: theme.success }, [badge.text]);
			},
			session_prompt_right() {
				const theme = api.theme.current;
				const badge = formatBadge();
				return text({ fg: theme.success }, [badge.text]);
			},
		},
	});
};

// Default export supports BOTH generations: V1 TUI clients call tui(), V2 reads setup().
export default {
	...Plugin.define({
		id: "workflow-guard-ui",
		setup: WorkflowGuardTuiV2,
	}),
	tui: WorkflowGuardTui,
} as const satisfies TuiPluginModule;
