import { formatCurrency, formatNumber, toNumber } from "../utils/proposalMath";

const chartHeight = 220;
const chartWidth = 620;
const leftPadding = 52;
const rightPadding = 52;
const bottomPadding = 42;
const topPadding = 20;

export default function ProposalChart({ monthlyMetrics }) {
  const maxGeneration = Math.max(
    ...monthlyMetrics.map((month) => toNumber(month.generation)),
    100,
  );
  const maxSavings = Math.max(
    ...monthlyMetrics.map((month) => toNumber(month.savings)),
    1000,
  );
  const plotWidth = chartWidth - leftPadding - rightPadding;
  const plotHeight = chartHeight - topPadding - bottomPadding;
  const slotWidth = plotWidth / monthlyMetrics.length;
  const linePoints = monthlyMetrics
    .map((month, index) => {
      const x = leftPadding + slotWidth * index + slotWidth / 2;
      const y =
        topPadding +
        plotHeight -
        (toNumber(month.savings) / maxSavings) * plotHeight;

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      className="proposal-chart"
      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      role="img"
      aria-label="Monthly generation and savings chart"
    >
      <rect
        x="0"
        y="0"
        width={chartWidth}
        height={chartHeight}
        rx="18"
        fill="#ffffff"
      />
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
        const y = topPadding + plotHeight - plotHeight * ratio;
        const generationValue = maxGeneration * ratio;
        const savingsValue = maxSavings * ratio;

        return (
          <g key={ratio}>
            <line
              x1={leftPadding}
              y1={y}
              x2={chartWidth - rightPadding}
              y2={y}
              stroke="#d8e4f6"
              strokeDasharray="4 6"
            />
            <text x="10" y={y + 4} className="chart-axis-label">
              {formatNumber(generationValue)}
            </text>
            <text x={chartWidth - 44} y={y + 4} className="chart-axis-label">
              {formatCurrency(savingsValue, false)}
            </text>
          </g>
        );
      })}

      {monthlyMetrics.map((month, index) => {
        const generation = toNumber(month.generation);
        const x = leftPadding + slotWidth * index + slotWidth * 0.18;
        const y =
          topPadding + plotHeight - (generation / maxGeneration) * plotHeight;
        const height = (generation / maxGeneration) * plotHeight;
        const labelX = leftPadding + slotWidth * index + slotWidth / 2;

        return (
          <g key={month.month}>
            <rect
              x={x}
              y={y}
              width={slotWidth * 0.46}
              height={height}
              rx="7"
              fill="#6aa9ea"
            />
            <text
              x={labelX}
              y={chartHeight - 12}
              textAnchor="middle"
              className="chart-month-label"
            >
              {month.month.slice(0, 3)}
            </text>
          </g>
        );
      })}

      <polyline
        points={linePoints}
        fill="none"
        stroke="#f28c28"
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {monthlyMetrics.map((month, index) => {
        const x = leftPadding + slotWidth * index + slotWidth / 2;
        const y =
          topPadding +
          plotHeight -
          (toNumber(month.savings) / maxSavings) * plotHeight;

        return <circle key={`${month.month}-point`} cx={x} cy={y} r="4.5" fill="#f28c28" />;
      })}

      <g transform={`translate(${leftPadding}, 10)`}>
        <line x1="0" y1="0" x2="28" y2="0" stroke="#6aa9ea" strokeWidth="6" />
        <text x="36" y="4" className="chart-legend-label">
          Generation (Units)
        </text>
        <line x1="198" y1="0" x2="226" y2="0" stroke="#f28c28" strokeWidth="6" />
        <text x="234" y="4" className="chart-legend-label">
          Savings (Rs.)
        </text>
      </g>
    </svg>
  );
}
