const currencyFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
});

const plainNumberFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
});

export const toNumber = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatCurrency = (value, withPrefix = true) => {
  const amount = currencyFormatter.format(toNumber(value));
  return withPrefix ? `Rs. ${amount}` : amount;
};

export const formatNumber = (value) => plainNumberFormatter.format(toNumber(value));

export const formatDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB");
};

export const buildCommercialSummary = (commercial) => {
  const parsedRows = commercial.rows.map((row) => {
    const price = toNumber(row.price);
    const gstRate = toNumber(row.gstRate);
    const gstAmount = price * (gstRate / 100);
    const totalPrice = price + gstAmount;

    return {
      ...row,
      price,
      gstRate,
      gstAmount,
      totalPrice,
    };
  });

  const costToCustomer = parsedRows.reduce(
    (runningTotal, row) => runningTotal + row.totalPrice,
    0,
  );
  const subsidy = toNumber(commercial.subsidy);
  const effectiveCost = Math.max(costToCustomer - subsidy, 0);

  return {
    rows: parsedRows,
    costToCustomer,
    subsidy,
    effectiveCost,
  };
};

export const buildSavingsSummary = (proposal, commercialSummary) => {
  const yearlyGeneration = proposal.savings.monthlyMetrics.reduce(
    (runningTotal, month) => runningTotal + toNumber(month.generation),
    0,
  );
  const annualSavings = proposal.savings.monthlyMetrics.reduce(
    (runningTotal, month) => runningTotal + toNumber(month.savings),
    0,
  );
  const projectCost = commercialSummary.effectiveCost;
  const paybackYears =
    annualSavings > 0 ? Number((projectCost / annualSavings).toFixed(1)) : 0;
  const treesSaved = yearlyGeneration * proposal.savings.treeFactor;
  const co2Reduction = yearlyGeneration * proposal.savings.co2Factor;

  return {
    yearlyGeneration,
    annualSavings,
    projectCost,
    paybackYears,
    treesSaved,
    co2Reduction,
  };
};

export const buildWelcomeParagraphs = (proposal) => [
  `Thank you for considering ${proposal.supplier.companyName} for your rooftop solar project.`,
  `${proposal.supplier.companyName}, established in ${proposal.supplier.establishedYear}, provides end-to-end solar system design, supply, installation, and commissioning services. This proposal has been prepared to help ${proposal.customer.name} evaluate a dependable ${proposal.project.systemSize} rooftop solution with clear material specifications, pricing, and expected savings.`,
  `With ${proposal.supplier.installedCapacity}, ${proposal.supplier.clientsServed}, and service presence across ${proposal.supplier.serviceCoverage}, our company brings strong execution experience to every project. ${proposal.supplier.companyPromise}`,
  `Our team handles site coordination, equipment planning, installation support, and documentation assistance so your solar project can move forward with confidence. The proposed system is designed to reduce electricity costs, improve long-term value, and support clean energy adoption, backed by ${proposal.supplier.supportAvailability.toLowerCase()}.`,
  `We would be glad to discuss any customization required for your site. For any clarification, please contact us at ${proposal.supplier.phone} or ${proposal.supplier.email}.`,
];

export const buildFileName = (proposal) => {
  const customerName = proposal.customer.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${customerName || "solar-proposal"}-${proposal.project.systemSize
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}.pdf`;
};
