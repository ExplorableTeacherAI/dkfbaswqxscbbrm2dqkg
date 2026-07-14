import { type ReactElement, useEffect, useMemo } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH1,
    EditableH2,
    EditableParagraph,
    InlineScrubbleNumber,
    InlineClozeInput,
    InlineClozeChoice,
    InlineToggle,
    InlineSpotColor,
    InlineFeedback,
    InlineTooltip,
    Cartesian2D,
    InteractionHintSequence,
} from "@/components/atoms";
import { FormulaBlock } from "@/components/molecules";
import { useVar, useSetVar, useVariableStore, initializeVariableColors } from "@/stores";
import {
    getDefaultValues,
    variableDefinitions,
    getVariableInfo,
    numberPropsFromDefinition,
    clozePropsFromDefinition,
    choicePropsFromDefinition,
    togglePropsFromDefinition,
} from "./variables";

// Initialize variables and their colors
useVariableStore.getState().initialize(getDefaultValues());
initializeVariableColors(variableDefinitions);

// ============================================================================
// SECTION 1: What is a Limit? (Infinite Zoom Visualization)
// ============================================================================

function InfiniteZoomVisualization() {
    const zoomLevel = useVar('limitZoomLevel', 1) as number;
    const setVar = useSetVar();

    // We're exploring f(x) = x² near x = 2
    // The limit is 4
    const targetX = 2;
    const limitValue = 4;

    // Calculate the viewBox based on zoom level
    // As zoom increases, the window shrinks around (targetX, limitValue)
    const windowSize = 4 / zoomLevel;
    const xMin = targetX - windowSize;
    const xMax = targetX + windowSize;
    const yMin = limitValue - windowSize;
    const yMax = limitValue + windowSize;

    // Calculate current f(x) at the edge of the view
    const edgeX = targetX + windowSize * 0.8;
    const currentFx = edgeX * edgeX;

    useEffect(() => {
        setVar('limitCurrentFx', Math.round(currentFx * 100) / 100);
    }, [currentFx, setVar]);

    return (
        <div className="relative">
            <Cartesian2D
                height={400}
                viewBox={{ x: [xMin, xMax], y: [yMin, yMax] }}
                plots={[
                    // The function f(x) = x²
                    {
                        type: "function",
                        fn: (x) => x * x,
                        color: "#8E90F5",
                        weight: 3,
                    },
                    // Horizontal line at the limit value
                    {
                        type: "segment",
                        point1: [xMin, limitValue],
                        point2: [xMax, limitValue],
                        color: "#22c55e",
                        style: "dashed",
                        weight: 2,
                    },
                    // Vertical line at the target x
                    {
                        type: "segment",
                        point1: [targetX, yMin],
                        point2: [targetX, yMax],
                        color: "#F7B23B",
                        style: "dashed",
                        weight: 1.5,
                    },
                    // The target point
                    {
                        type: "point",
                        x: targetX,
                        y: limitValue,
                        color: "#22c55e",
                    },
                ]}
            />
            {/* Zoom level indicator */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <div className="text-sm font-medium text-gray-700">
                    Zoom: {zoomLevel}×
                </div>
                <div className="text-xs text-gray-500">
                    Window: ±{windowSize.toFixed(3)}
                </div>
            </div>
            {/* Limit indicator */}
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <div className="text-sm text-gray-700">
                    f(x) → <span className="font-bold text-green-600">{limitValue}</span>
                </div>
            </div>
            <InteractionHintSequence
                hintKey="infinite-zoom-hint"
                steps={[
                    {
                        gesture: "scroll",
                        label: "Scrub the zoom level in the text to zoom in toward the limit",
                        position: { x: "50%", y: "50%" },
                    },
                ]}
            />
        </div>
    );
}

// ============================================================================
// SECTION 2: Limits When Undefined (Fill the Hole Game)
// ============================================================================

function FillTheHoleVisualization() {
    const fillerY = useVar('holeFillerY', 2) as number;
    const setVar = useSetVar();

    // f(x) = (x² - 4)/(x - 2) has a hole at x = 2
    // The limit is 4 (since (x² - 4)/(x - 2) = x + 2 for x ≠ 2)
    const holeX = 2;
    const limitValue = 4;
    const tolerance = 0.3;

    // Check if the filler is close enough to the correct value
    const isCorrect = Math.abs(fillerY - limitValue) < tolerance;

    useEffect(() => {
        setVar('holeFilledCorrectly', isCorrect);
    }, [isCorrect, setVar]);

    return (
        <div className="relative">
            <Cartesian2D
                height={400}
                viewBox={{ x: [-1, 5], y: [-1, 7] }}
                movablePoints={[
                    {
                        initial: [holeX, fillerY],
                        position: [holeX, fillerY],
                        color: isCorrect ? "#22c55e" : "#ef4444",
                        constrain: ([, py]) => [holeX, Math.max(0, Math.min(6, py))],
                        onChange: ([, py]) => setVar('holeFillerY', Math.round(py * 10) / 10),
                    },
                ]}
                plots={[
                    // The function f(x) = x + 2 (simplified form, but with a visual "gap" at x = 2)
                    // We draw it in two pieces to show the hole
                    {
                        type: "function",
                        fn: (x) => x + 2,
                        color: "#8E90F5",
                        weight: 3,
                        domain: [-1, 1.95],
                    },
                    {
                        type: "function",
                        fn: (x) => x + 2,
                        color: "#8E90F5",
                        weight: 3,
                        domain: [2.05, 5],
                    },
                    // The "hole" - an empty circle at (2, 4)
                    {
                        type: "circle",
                        center: [holeX, limitValue],
                        radius: 0.12,
                        color: "#8E90F5",
                        fillOpacity: 0,
                        weight: 2,
                    },
                ]}
            />
            {/* Status indicator */}
            <div className={`absolute top-3 right-3 rounded-lg px-3 py-2 shadow-sm border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className={`text-sm font-medium ${isCorrect ? 'text-green-700' : 'text-amber-700'}`}>
                    {isCorrect ? "Perfect! You found the limit!" : "Drag the point to fill the hole"}
                </div>
                <div className="text-xs text-gray-600">
                    Your guess: y = {fillerY.toFixed(1)}
                </div>
            </div>
            <InteractionHintSequence
                hintKey="fill-hole-hint"
                steps={[
                    {
                        gesture: "drag-vertical",
                        label: "Drag the point up or down to fill the hole in the curve",
                        position: { x: "55%", y: "35%" },
                        dragPath: { type: "line", startOffset: { x: 0, y: -20 }, endOffset: { x: 0, y: 20 } },
                    },
                ]}
            />
        </div>
    );
}

// ============================================================================
// SECTION 3: One-Sided Limits (Direction Toggle)
// ============================================================================

function OneSidedLimitVisualization() {
    const direction = useVar('approachDirection', 'left') as string;
    const tracerX = useVar('oneSidedTracerX', direction === 'left' ? -1.5 : 1.5) as number;
    const setVar = useSetVar();

    // Step function: f(x) = 1 for x < 0, f(x) = 3 for x > 0
    const stepAt = 0;
    const leftValue = 1;
    const rightValue = 3;

    // Calculate current y based on tracer position
    const currentY = tracerX < stepAt ? leftValue : rightValue;

    // Update limit display
    useEffect(() => {
        if (direction === 'left') {
            setVar('leftLimitValue', leftValue);
        } else {
            setVar('rightLimitValue', rightValue);
        }
    }, [direction, setVar]);

    // Reset tracer position when direction changes
    useEffect(() => {
        if (direction === 'left') {
            setVar('oneSidedTracerX', -1.5);
        } else {
            setVar('oneSidedTracerX', 1.5);
        }
    }, [direction, setVar]);

    return (
        <div className="relative">
            <Cartesian2D
                height={400}
                viewBox={{ x: [-4, 4], y: [-1, 5] }}
                movablePoints={[
                    {
                        initial: [tracerX, currentY],
                        position: [tracerX, tracerX < stepAt ? leftValue : rightValue],
                        color: direction === 'left' ? "#F7B23B" : "#F4A89A",
                        constrain: ([px]) => {
                            // Constrain to the appropriate side
                            const newX = direction === 'left'
                                ? Math.max(-3.5, Math.min(-0.05, px))
                                : Math.max(0.05, Math.min(3.5, px));
                            const newY = newX < stepAt ? leftValue : rightValue;
                            return [newX, newY];
                        },
                        onChange: ([px]) => setVar('oneSidedTracerX', Math.round(px * 100) / 100),
                    },
                ]}
                plots={[
                    // Left piece: f(x) = 1 for x < 0
                    {
                        type: "function",
                        fn: () => leftValue,
                        color: "#F7B23B",
                        weight: 3,
                        domain: [-4, -0.02],
                    },
                    // Right piece: f(x) = 3 for x > 0
                    {
                        type: "function",
                        fn: () => rightValue,
                        color: "#F4A89A",
                        weight: 3,
                        domain: [0.02, 4],
                    },
                    // Open circles at the jump
                    {
                        type: "circle",
                        center: [stepAt, leftValue],
                        radius: 0.1,
                        color: "#F7B23B",
                        fillOpacity: 0,
                        weight: 2,
                    },
                    {
                        type: "circle",
                        center: [stepAt, rightValue],
                        radius: 0.1,
                        color: "#F4A89A",
                        fillOpacity: 0,
                        weight: 2,
                    },
                    // Vertical dashed line at x = 0
                    {
                        type: "segment",
                        point1: [stepAt, -0.5],
                        point2: [stepAt, 4.5],
                        color: "#94a3b8",
                        style: "dashed",
                        weight: 1,
                    },
                ]}
            />
            {/* Current limit display */}
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                <div className="text-sm text-gray-700">
                    Approaching from: <span className="font-bold" style={{ color: direction === 'left' ? '#F7B23B' : '#F4A89A' }}>
                        {direction}
                    </span>
                </div>
                <div className="text-sm text-gray-700">
                    Limit → <span className="font-bold" style={{ color: direction === 'left' ? '#F7B23B' : '#F4A89A' }}>
                        {direction === 'left' ? leftValue : rightValue}
                    </span>
                </div>
            </div>
            <InteractionHintSequence
                hintKey="one-sided-hint"
                steps={[
                    {
                        gesture: "drag-horizontal",
                        label: "Drag the point toward x = 0 to see the limit value",
                        position: { x: direction === 'left' ? "30%" : "70%", y: direction === 'left' ? "70%" : "35%" },
                    },
                ]}
            />
        </div>
    );
}

// ============================================================================
// SECTION 4: Limits to Derivatives (Difference Quotient Table)
// ============================================================================

function DerivativeVisualization() {
    const h = useVar('derivativeH', 2) as number;
    const a = useVar('derivativeA', 1) as number;
    const setVar = useSetVar();

    // f(x) = x² so f'(x) = 2x
    const f = (x: number) => x * x;
    const fa = f(a);
    const fah = f(a + h);
    const slope = (fah - fa) / h;
    const actualDerivative = 2 * a;

    useEffect(() => {
        setVar('secantSlope', Math.round(slope * 100) / 100);
        setVar('derivativeValue', actualDerivative);
    }, [slope, actualDerivative, setVar]);

    // Generate table data for different h values
    const tableData = useMemo(() => {
        const hValues = [2, 1, 0.5, 0.1, 0.01, h];
        return hValues.map(hVal => {
            const fahVal = f(a + hVal);
            const slopeVal = (fahVal - fa) / hVal;
            return {
                h: hVal,
                fah: fahVal,
                slope: slopeVal,
                isCurrent: Math.abs(hVal - h) < 0.001,
            };
        });
    }, [a, h, fa]);

    return (
        <div className="space-y-4">
            <div className="relative">
                <Cartesian2D
                    height={350}
                    viewBox={{ x: [-1, 5], y: [-1, 10] }}
                    movablePoints={[
                        {
                            initial: [a + h, fah],
                            position: [a + h, fah],
                            color: "#F7B23B",
                            constrain: ([px]) => {
                                const newH = Math.max(0.01, Math.min(3, px - a));
                                return [a + newH, f(a + newH)];
                            },
                            onChange: ([px]) => setVar('derivativeH', Math.round((px - a) * 100) / 100),
                        },
                    ]}
                    plots={[
                        // The function f(x) = x²
                        {
                            type: "function",
                            fn: f,
                            color: "#8E90F5",
                            weight: 3,
                        },
                        // Point at (a, f(a))
                        {
                            type: "point",
                            x: a,
                            y: fa,
                            color: "#62D0AD",
                        },
                        // Secant line through both points
                        {
                            type: "function",
                            fn: (x) => fa + slope * (x - a),
                            color: "#F7B23B",
                            weight: 2,
                            domain: [-0.5, 4.5],
                        },
                        // Tangent line (the actual derivative)
                        {
                            type: "function",
                            fn: (x) => fa + actualDerivative * (x - a),
                            color: "#22c55e",
                            weight: 2,
                            style: "dashed",
                            domain: [-0.5, 4.5],
                        },
                        // Vertical segment showing h
                        {
                            type: "segment",
                            point1: [a, 0],
                            point2: [a + h, 0],
                            color: "#F7B23B",
                            weight: 2,
                        },
                    ]}
                />
                <InteractionHintSequence
                    hintKey="derivative-hint"
                    steps={[
                        {
                            gesture: "drag-horizontal",
                            label: "Drag the orange point toward the green point to see the secant become the tangent",
                            position: { x: "70%", y: "25%" },
                        },
                    ]}
                />
            </div>

            {/* Difference quotient table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left font-medium text-gray-700">h</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-700">f(a+h)</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-700">[f(a+h) − f(a)] / h</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.slice(0, -1).map((row, i) => (
                            <tr key={i} className={row.isCurrent ? 'bg-amber-50' : ''}>
                                <td className="px-4 py-2 border-t border-gray-100">{row.h}</td>
                                <td className="px-4 py-2 border-t border-gray-100">{row.fah.toFixed(4)}</td>
                                <td className="px-4 py-2 border-t border-gray-100 font-mono">
                                    {row.slope.toFixed(4)}
                                </td>
                            </tr>
                        ))}
                        <tr className="bg-amber-100 font-medium">
                            <td className="px-4 py-2 border-t border-amber-200 text-amber-800">
                                {h.toFixed(2)} (current)
                            </td>
                            <td className="px-4 py-2 border-t border-amber-200">{fah.toFixed(4)}</td>
                            <td className="px-4 py-2 border-t border-amber-200 font-mono text-amber-800">
                                {slope.toFixed(4)}
                            </td>
                        </tr>
                        <tr className="bg-green-50">
                            <td className="px-4 py-2 border-t border-green-200 text-green-700">h → 0</td>
                            <td className="px-4 py-2 border-t border-green-200 text-green-700">→ {fa.toFixed(4)}</td>
                            <td className="px-4 py-2 border-t border-green-200 font-mono text-green-700 font-bold">
                                → {actualDerivative.toFixed(4)} (derivative!)
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ============================================================================
// EXPORTED BLOCKS
// ============================================================================

export const blocks: ReactElement[] = [
    // ========================================================================
    // LESSON TITLE
    // ========================================================================
    <StackLayout key="layout-lesson-title" maxWidth="xl">
        <Block id="lesson-title" padding="md">
            <EditableH1 id="h1-lesson-title" blockId="lesson-title">
                Limits: Building Intuition
            </EditableH1>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-lesson-intro" maxWidth="xl">
        <Block id="lesson-intro" padding="sm">
            <EditableParagraph id="para-lesson-intro" blockId="lesson-intro">
                What happens when you try to reach a destination you can never quite arrive at? In mathematics, this seemingly paradoxical situation leads to one of the most powerful concepts in calculus: the{" "}
                <InlineTooltip id="tooltip-limit" tooltip="A limit describes the value that a function approaches as its input approaches some value.">
                    limit
                </InlineTooltip>
                . Understanding limits unlocks the door to derivatives, integrals, and the entire world of calculus.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // ========================================================================
    // SECTION 1: What is a Limit?
    // ========================================================================
    <StackLayout key="layout-section-one-title" maxWidth="xl">
        <Block id="section-one-title" padding="md">
            <EditableH2 id="h2-section-one" blockId="section-one-title">
                What is a Limit?
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section-one-intro" maxWidth="xl">
        <Block id="section-one-intro" padding="sm">
            <EditableParagraph id="para-section-one-intro" blockId="section-one-intro">
                Consider the function f(x) = x². What value does f(x) approach as x gets closer and closer to 2? Mathematically, we write this question as: lim(x→2) x² = ?
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <SplitLayout key="layout-section-one-content" ratio="1:1" gap="lg">
        <div className="space-y-4">
            <Block id="section-one-explanation" padding="sm">
                <EditableParagraph id="para-section-one-explanation" blockId="section-one-explanation">
                    Imagine you have a magnifying glass pointed at the point (2, 4) on the curve. As you zoom in, the curve looks increasingly like a straight horizontal line at height 4. No matter how close you get to x = 2, the function value stays near 4.
                </EditableParagraph>
            </Block>
            <Block id="section-one-interaction" padding="sm">
                <EditableParagraph id="para-section-one-interaction" blockId="section-one-interaction">
                    Try increasing the{" "}
                    <InlineSpotColor varName="limitZoomLevel" color="#62D0AD">zoom level</InlineSpotColor>
                    {" "}to{" "}
                    <InlineScrubbleNumber
                        varName="limitZoomLevel"
                        {...numberPropsFromDefinition(getVariableInfo('limitZoomLevel'))}
                    />
                    ×. Watch how the view shrinks around x = 2, and the curve flattens toward the{" "}
                    <InlineSpotColor varName="limitValue" color="#22c55e">green dashed line</InlineSpotColor>
                    {" "}at y = 4. This is the limit in action!
                </EditableParagraph>
            </Block>
            <Block id="section-one-formula" padding="sm">
                <FormulaBlock
                    latex="\lim_{x \to 2} x^2 = 4"
                    colorMap={{}}
                />
            </Block>
        </div>
        <Block id="section-one-visualization" padding="sm" hasVisualization>
            <InfiniteZoomVisualization />
        </Block>
    </SplitLayout>,

    <StackLayout key="layout-section-one-question" maxWidth="xl">
        <Block id="section-one-question" padding="sm">
            <EditableParagraph id="para-section-one-question" blockId="section-one-question">
                Based on your exploration, what is lim(x→2) x²?{" "}
                <InlineFeedback
                    varName="limitQuestionOne"
                    correctValue="4"
                    position="terminal"
                    successMessage="Exactly! As x approaches 2, x² approaches 4"
                    failureMessage="Not quite"
                    hint="Look at where the green dashed line sits as you zoom in"
                >
                    <InlineClozeInput
                        varName="limitQuestionOne"
                        correctAnswer="4"
                        {...clozePropsFromDefinition(getVariableInfo('limitQuestionOne'))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // ========================================================================
    // SECTION 2: Limits When Undefined
    // ========================================================================
    <StackLayout key="layout-section-two-title" maxWidth="xl">
        <Block id="section-two-title" padding="md">
            <EditableH2 id="h2-section-two" blockId="section-two-title">
                Limits When the Function is Undefined
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section-two-intro" maxWidth="xl">
        <Block id="section-two-intro" padding="sm">
            <EditableParagraph id="para-section-two-intro" blockId="section-two-intro">
                Here is something surprising: a limit can exist even when the function itself has no value at that point! Consider f(x) = (x² − 4)/(x − 2). At x = 2, this gives 0/0, which is undefined. Yet the limit still exists.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <SplitLayout key="layout-section-two-content" ratio="1:1" gap="lg">
        <div className="space-y-4">
            <Block id="section-two-explanation" padding="sm">
                <EditableParagraph id="para-section-two-explanation" blockId="section-two-explanation">
                    Algebraically, we can simplify: (x² − 4)/(x − 2) = (x+2)(x−2)/(x−2) = x + 2, but only when x ≠ 2. This creates a "hole" in the graph at x = 2.
                </EditableParagraph>
            </Block>
            <Block id="section-two-task" padding="sm">
                <EditableParagraph id="para-section-two-task" blockId="section-two-task">
                    Your task: drag the{" "}
                    <InlineSpotColor varName="holeFillerY" color="#ef4444">red point</InlineSpotColor>
                    {" "}vertically to find where the hole should be filled. When you place it at the correct y-value, the curve becomes continuous. Your current guess is y ={" "}
                    <InlineScrubbleNumber
                        varName="holeFillerY"
                        {...numberPropsFromDefinition(getVariableInfo('holeFillerY'))}
                        formatValue={(v) => v.toFixed(1)}
                    />.
                </EditableParagraph>
            </Block>
            <Block id="section-two-formula" padding="sm">
                <FormulaBlock
                    latex="\lim_{x \to 2} \frac{x^2 - 4}{x - 2} = \lim_{x \to 2} (x + 2) = 4"
                    colorMap={{}}
                />
            </Block>
        </div>
        <Block id="section-two-visualization" padding="sm" hasVisualization>
            <FillTheHoleVisualization />
        </Block>
    </SplitLayout>,

    <StackLayout key="layout-section-two-question" maxWidth="xl">
        <Block id="section-two-question" padding="sm">
            <EditableParagraph id="para-section-two-question" blockId="section-two-question">
                Even though f(2) is undefined, what is the limit as x approaches 2?{" "}
                <InlineFeedback
                    varName="limitQuestionTwo"
                    correctValue="4"
                    position="terminal"
                    successMessage="Correct! The limit exists even though f(2) is undefined"
                    failureMessage="Try again"
                    hint="Where did you place the filler point to complete the curve?"
                    reviewBlockId="section-two-visualization"
                    reviewLabel="Try the visualization again"
                >
                    <InlineClozeInput
                        varName="limitQuestionTwo"
                        correctAnswer="4"
                        {...clozePropsFromDefinition(getVariableInfo('limitQuestionTwo'))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // ========================================================================
    // SECTION 3: One-Sided Limits
    // ========================================================================
    <StackLayout key="layout-section-three-title" maxWidth="xl">
        <Block id="section-three-title" padding="md">
            <EditableH2 id="h2-section-three" blockId="section-three-title">
                One-Sided Limits
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section-three-intro" maxWidth="xl">
        <Block id="section-three-intro" padding="sm">
            <EditableParagraph id="para-section-three-intro" blockId="section-three-intro">
                Sometimes, approaching from the left gives a different answer than approaching from the right. When this happens, we say the two-sided limit does not exist. Consider a step function that jumps from 1 to 3 at x = 0.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <SplitLayout key="layout-section-three-content" ratio="1:1" gap="lg">
        <div className="space-y-4">
            <Block id="section-three-explanation" padding="sm">
                <EditableParagraph id="para-section-three-explanation" blockId="section-three-explanation">
                    Toggle between approaching from the{" "}
                    <InlineToggle
                        id="toggle-direction"
                        varName="approachDirection"
                        options={["left", "right"]}
                        {...togglePropsFromDefinition(getVariableInfo('approachDirection'))}
                    />
                    . Then drag the tracer point toward x = 0. Watch how the limit value changes depending on which side you approach from!
                </EditableParagraph>
            </Block>
            <Block id="section-three-notation" padding="sm">
                <EditableParagraph id="para-section-three-notation" blockId="section-three-notation">
                    We write lim(x→0⁻) f(x) = 1 for the{" "}
                    <InlineSpotColor varName="leftLimit" color="#F7B23B">left-hand limit</InlineSpotColor>
                    {" "}and lim(x→0⁺) f(x) = 3 for the{" "}
                    <InlineSpotColor varName="rightLimit" color="#F4A89A">right-hand limit</InlineSpotColor>
                    . Since 1 ≠ 3, the two-sided limit does not exist.
                </EditableParagraph>
            </Block>
            <Block id="section-three-formulas" padding="sm">
                <FormulaBlock
                    latex="\lim_{x \to 0^-} f(x) = 1 \quad \text{but} \quad \lim_{x \to 0^+} f(x) = 3"
                    colorMap={{}}
                />
            </Block>
        </div>
        <Block id="section-three-visualization" padding="sm" hasVisualization>
            <OneSidedLimitVisualization />
        </Block>
    </SplitLayout>,

    <StackLayout key="layout-section-three-question" maxWidth="xl">
        <Block id="section-three-question" padding="sm">
            <EditableParagraph id="para-section-three-question" blockId="section-three-question">
                For this step function, what is lim(x→0) f(x)?{" "}
                <InlineFeedback
                    varName="limitQuestionThree"
                    correctValue="does not exist"
                    position="terminal"
                    successMessage="Exactly! When the left and right limits differ, the two-sided limit does not exist"
                    failureMessage="Remember"
                    hint="The left limit is 1 and the right limit is 3. What happens when they differ?"
                >
                    <InlineClozeChoice
                        varName="limitQuestionThree"
                        correctAnswer="does not exist"
                        options={["1", "3", "2", "does not exist"]}
                        {...choicePropsFromDefinition(getVariableInfo('limitQuestionThree'))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // ========================================================================
    // SECTION 4: Connecting Limits to Derivatives
    // ========================================================================
    <StackLayout key="layout-section-four-title" maxWidth="xl">
        <Block id="section-four-title" padding="md">
            <EditableH2 id="h2-section-four" blockId="section-four-title">
                Connecting Limits to Derivatives
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section-four-intro" maxWidth="xl">
        <Block id="section-four-intro" padding="sm">
            <EditableParagraph id="para-section-four-intro" blockId="section-four-intro">
                The derivative is born from a limit. Consider two points on a curve: (a, f(a)) and (a+h, f(a+h)). The slope of the line connecting them is the{" "}
                <InlineTooltip id="tooltip-difference-quotient" tooltip="The ratio [f(a+h) − f(a)] / h, which gives the average rate of change between two points.">
                    difference quotient
                </InlineTooltip>
                . As h shrinks toward zero, this secant line becomes the tangent line, and its slope becomes the derivative.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section-four-content" maxWidth="xl">
        <Block id="section-four-explanation" padding="sm">
            <EditableParagraph id="para-section-four-explanation" blockId="section-four-explanation">
                For f(x) = x² at a ={" "}
                <InlineScrubbleNumber
                    varName="derivativeA"
                    {...numberPropsFromDefinition(getVariableInfo('derivativeA'))}
                    formatValue={(v) => v.toFixed(1)}
                />
                , drag the{" "}
                <InlineSpotColor varName="derivativeH" color="#F7B23B">orange point</InlineSpotColor>
                {" "}toward the{" "}
                <InlineSpotColor varName="derivativeA" color="#62D0AD">green point</InlineSpotColor>
                . Watch the{" "}
                <InlineSpotColor varName="secantSlope" color="#F7B23B">secant line</InlineSpotColor>
                {" "}(solid orange) tilt and approach the{" "}
                <InlineSpotColor varName="derivativeValue" color="#22c55e">tangent line</InlineSpotColor>
                {" "}(dashed green). The table shows how the slope converges to the derivative.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section-four-visualization" maxWidth="xl">
        <Block id="section-four-visualization" padding="sm" hasVisualization>
            <DerivativeVisualization />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section-four-formula" maxWidth="xl">
        <Block id="section-four-formula" padding="sm">
            <FormulaBlock
                latex="f'(a) = \lim_{h \to 0} \frac{f(a+h) - f(a)}{h} = \lim_{h \to 0} \frac{(a+h)^2 - a^2}{h} = 2a"
                colorMap={{}}
            />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-section-four-question" maxWidth="xl">
        <Block id="section-four-question" padding="sm">
            <EditableParagraph id="para-section-four-question" blockId="section-four-question">
                If f(x) = x² and a = 3, what is f'(3)?{" "}
                <InlineFeedback
                    varName="limitQuestionFour"
                    correctValue="6"
                    position="terminal"
                    successMessage="Perfect! The derivative of x² at x = 3 is 2(3) = 6"
                    failureMessage="Use the formula f'(a) = 2a"
                    hint="For f(x) = x², the derivative is f'(x) = 2x. So at x = 3..."
                >
                    <InlineClozeInput
                        varName="limitQuestionFour"
                        correctAnswer="6"
                        {...clozePropsFromDefinition(getVariableInfo('limitQuestionFour'))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // ========================================================================
    // CONCLUSION
    // ========================================================================
    <StackLayout key="layout-conclusion" maxWidth="xl">
        <Block id="conclusion" padding="md">
            <EditableParagraph id="para-conclusion" blockId="conclusion">
                You have now explored the fundamental concept of limits: approaching a value, dealing with undefined points, understanding one-sided behavior, and seeing how limits give birth to derivatives. These ideas form the foundation of calculus, and you have experienced them firsthand through interactive exploration.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
