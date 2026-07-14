/**
 * Variables Configuration
 * =======================
 *
 * CENTRAL PLACE TO DEFINE ALL SHARED VARIABLES
 *
 * This file defines all variables that can be shared across sections.
 * AI agents should read this file to understand what variables are available.
 *
 * USAGE:
 * 1. Define variables here with their default values and metadata
 * 2. Use them in any section with: const x = useVar('variableName', defaultValue)
 * 3. Update them with: setVar('variableName', newValue)
 */

import { type VarValue } from '@/stores';

/**
 * Variable definition with metadata
 */
export interface VariableDefinition {
    /** Default value */
    defaultValue: VarValue;
    /** Human-readable label */
    label?: string;
    /** Description for AI agents */
    description?: string;
    /** Variable type hint */
    type?: 'number' | 'text' | 'boolean' | 'select' | 'array' | 'object' | 'spotColor' | 'linkedHighlight';
    /** Unit (e.g., 'Hz', '°', 'm/s') - for numbers */
    unit?: string;
    /** Minimum value (for number sliders) */
    min?: number;
    /** Maximum value (for number sliders) */
    max?: number;
    /** Step increment (for number sliders) */
    step?: number;
    /** Display color for InlineScrubbleNumber / InlineSpotColor (e.g. '#D81B60') */
    color?: string;
    /** Options for 'select' type variables */
    options?: string[];
    /** Placeholder text for text inputs */
    placeholder?: string;
    /** Correct answer for cloze input validation */
    correctAnswer?: string;
    /** Whether cloze matching is case sensitive */
    caseSensitive?: boolean;
    /** Background color for inline components */
    bgColor?: string;
    /** Schema hint for object types (for AI agents) */
    schema?: string;
}

/**
 * =====================================================
 * 🎯 DEFINE YOUR VARIABLES HERE
 * =====================================================
 */
export const variableDefinitions: Record<string, VariableDefinition> = {
    // ========================================
    // SECTION 1: What is a Limit?
    // ========================================

    // Zoom level for infinite zoom visualization
    limitZoomLevel: {
        defaultValue: 1,
        type: 'number',
        label: 'Zoom Level',
        description: 'Controls how zoomed in the view is near the limit point',
        min: 1,
        max: 100,
        step: 1,
        color: '#62D0AD',
    },

    // The x-value we are approaching
    limitApproachX: {
        defaultValue: 2,
        type: 'number',
        label: 'Approach X',
        description: 'The x-value we are approaching to find the limit',
        min: -5,
        max: 5,
        step: 0.1,
        color: '#8E90F5',
    },

    // Current f(x) value display
    limitCurrentFx: {
        defaultValue: 4,
        type: 'number',
        label: 'Current f(x)',
        description: 'The current function value at the approach point',
        min: -10,
        max: 10,
        step: 0.01,
        color: '#F7B23B',
    },

    // Question for section 1
    limitQuestionOne: {
        defaultValue: '',
        type: 'text',
        label: 'Limit Question 1',
        description: 'Student answer for the first limit question',
        placeholder: '?',
        correctAnswer: '4',
        color: '#62D0AD',
    },

    // ========================================
    // SECTION 2: Limits When Undefined
    // ========================================

    // Filler point y-position for the hole game
    holeFillerY: {
        defaultValue: 2,
        type: 'number',
        label: 'Filler Y Position',
        description: 'The y-position of the point filling the hole',
        min: 0,
        max: 8,
        step: 0.1,
        color: '#ef4444',
    },

    // Target limit value (the correct answer)
    holeTargetLimit: {
        defaultValue: 4,
        type: 'number',
        label: 'Target Limit',
        description: 'The actual limit value at the hole',
        min: 0,
        max: 10,
        step: 0.1,
        color: '#22c55e',
    },

    // Whether the hole is filled correctly
    holeFilledCorrectly: {
        defaultValue: false,
        type: 'boolean',
        label: 'Hole Filled Correctly',
        description: 'Whether the student has correctly filled the hole',
    },

    // Question for section 2
    limitQuestionTwo: {
        defaultValue: '',
        type: 'text',
        label: 'Limit Question 2',
        description: 'Student answer for section 2 question',
        placeholder: '?',
        correctAnswer: '4',
        color: '#8E90F5',
    },

    // ========================================
    // SECTION 3: One-Sided Limits
    // ========================================

    // Direction of approach: 'left' or 'right'
    approachDirection: {
        defaultValue: 'left',
        type: 'select',
        label: 'Approach Direction',
        description: 'Whether approaching from left or right',
        options: ['left', 'right'],
        color: '#AC8BF9',
    },

    // Current x position of the tracer
    oneSidedTracerX: {
        defaultValue: 0,
        type: 'number',
        label: 'Tracer X',
        description: 'The x-position of the tracer point',
        min: -3,
        max: 3,
        step: 0.05,
        color: '#62CCF9',
    },

    // Left limit value display
    leftLimitValue: {
        defaultValue: 1,
        type: 'number',
        label: 'Left Limit',
        description: 'The limit value when approaching from the left',
        min: -5,
        max: 5,
        step: 0.01,
        color: '#F7B23B',
    },

    // Right limit value display
    rightLimitValue: {
        defaultValue: 3,
        type: 'number',
        label: 'Right Limit',
        description: 'The limit value when approaching from the right',
        min: -5,
        max: 5,
        step: 0.01,
        color: '#F4A89A',
    },

    // Question for section 3
    limitQuestionThree: {
        defaultValue: '',
        type: 'select',
        label: 'One-Sided Limit Question',
        description: 'Student answer for one-sided limit question',
        placeholder: '?',
        correctAnswer: 'does not exist',
        options: ['1', '3', '2', 'does not exist'],
        color: '#AC8BF9',
    },

    // ========================================
    // SECTION 4: Limits to Derivatives
    // ========================================

    // The h value (distance between points)
    derivativeH: {
        defaultValue: 2,
        type: 'number',
        label: 'h value',
        description: 'The distance between the two points on the curve',
        min: 0.01,
        max: 3,
        step: 0.01,
        color: '#F7B23B',
    },

    // The base x value (a)
    derivativeA: {
        defaultValue: 1,
        type: 'number',
        label: 'a value',
        description: 'The base x-value where we calculate the derivative',
        min: -2,
        max: 3,
        step: 0.1,
        color: '#62D0AD',
    },

    // Current slope of secant line
    secantSlope: {
        defaultValue: 4,
        type: 'number',
        label: 'Secant Slope',
        description: 'The slope of the secant line between the two points',
        min: -10,
        max: 10,
        step: 0.01,
        color: '#8E90F5',
    },

    // Actual derivative value
    derivativeValue: {
        defaultValue: 2,
        type: 'number',
        label: 'Derivative Value',
        description: 'The actual derivative at point a',
        min: -10,
        max: 10,
        step: 0.01,
        color: '#22c55e',
    },

    // Question for section 4
    limitQuestionFour: {
        defaultValue: '',
        type: 'text',
        label: 'Derivative Question',
        description: 'Student answer for derivative limit question',
        placeholder: '?',
        correctAnswer: '6',
        color: '#62D0AD',
    },

    // Highlight variable for linked highlights
    limitHighlight: {
        defaultValue: '',
        type: 'linkedHighlight',
        label: 'Active Highlight',
        description: 'Which element is currently highlighted',
        color: '#62D0AD',
        bgColor: 'rgba(98, 208, 173, 0.15)',
    },
};

/**
 * Get all variable names (for AI agents to discover)
 */
export const getVariableNames = (): string[] => {
    return Object.keys(variableDefinitions);
};

/**
 * Get a variable's default value
 */
export const getDefaultValue = (name: string): VarValue => {
    return variableDefinitions[name]?.defaultValue ?? 0;
};

/**
 * Get a variable's metadata
 */
export const getVariableInfo = (name: string): VariableDefinition | undefined => {
    return variableDefinitions[name];
};

/**
 * Get all default values as a record (for initialization)
 */
export const getDefaultValues = (): Record<string, VarValue> => {
    const defaults: Record<string, VarValue> = {};
    for (const [name, def] of Object.entries(variableDefinitions)) {
        defaults[name] = def.defaultValue;
    }
    return defaults;
};

/**
 * Get number props for InlineScrubbleNumber from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx, or getExampleVariableInfo(name) in exampleBlocks.tsx.
 */
export function numberPropsFromDefinition(def: VariableDefinition | undefined): {
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    color?: string;
} {
    if (!def || def.type !== 'number') return {};
    return {
        defaultValue: def.defaultValue as number,
        min: def.min,
        max: def.max,
        step: def.step,
        ...(def.color ? { color: def.color } : {}),
    };
}

/**
 * Get cloze input props for InlineClozeInput from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx, or getExampleVariableInfo(name) in exampleBlocks.tsx.
 */
/**
 * Get cloze choice props for InlineClozeChoice from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx.
 */
export function choicePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

/**
 * Get toggle props for InlineToggle from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx.
 */
export function togglePropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

export function clozePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
    caseSensitive?: boolean;
} {
    if (!def || def.type !== 'text') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
        ...(def.caseSensitive !== undefined ? { caseSensitive: def.caseSensitive } : {}),
    };
}

/**
 * Get spot-color props for InlineSpotColor from a variable definition.
 * Extracts the `color` field.
 *
 * @example
 * <InlineSpotColor
 *     varName="radius"
 *     {...spotColorPropsFromDefinition(getVariableInfo('radius'))}
 * >
 *     radius
 * </InlineSpotColor>
 */
export function spotColorPropsFromDefinition(def: VariableDefinition | undefined): {
    color: string;
} {
    return {
        color: def?.color ?? '#8B5CF6',
    };
}

/**
 * Get linked-highlight props for InlineLinkedHighlight from a variable definition.
 * Extracts the `color` and `bgColor` fields.
 *
 * @example
 * <InlineLinkedHighlight
 *     varName="activeHighlight"
 *     highlightId="radius"
 *     {...linkedHighlightPropsFromDefinition(getVariableInfo('activeHighlight'))}
 * >
 *     radius
 * </InlineLinkedHighlight>
 */
export function linkedHighlightPropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    return {
        ...(def?.color ? { color: def.color } : {}),
        ...(def?.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

/**
 * Build the `variables` prop for FormulaBlock from variable definitions.
 *
 * Takes an array of variable names and returns the config map expected by
 * `<FormulaBlock variables={...} />`.
 *
 * @example
 * import { scrubVarsFromDefinitions } from './variables';
 *
 * <FormulaBlock
 *     latex="\scrub{mass} \times \scrub{accel}"
 *     variables={scrubVarsFromDefinitions(['mass', 'accel'])}
 * />
 */
export function scrubVarsFromDefinitions(
    varNames: string[],
): Record<string, { min?: number; max?: number; step?: number; color?: string }> {
    const result: Record<string, { min?: number; max?: number; step?: number; color?: string }> = {};
    for (const name of varNames) {
        const def = variableDefinitions[name];
        if (!def) continue;
        result[name] = {
            ...(def.min !== undefined ? { min: def.min } : {}),
            ...(def.max !== undefined ? { max: def.max } : {}),
            ...(def.step !== undefined ? { step: def.step } : {}),
            ...(def.color ? { color: def.color } : {}),
        };
    }
    return result;
}
