export const serviceFlows = {
  solar: {
    title: "Solar Solutions",
    eyebrow: "Solar Workflow",
    description: "Choose the path that fits your solar requirement and continue to the right page.",
    roles: {
      admin: {
        label: "Admin",
        description: "Open the existing solar estimate studio and generate a client-ready proposal.",
        path: "/solar/admin",
      },
      customer: {
        label: "Customer",
        description: "Submit your solar requirement so our team can connect with you.",
        path: "/solar/customer",
      },
    },
  },
  elevator: {
    title: "Elevator Service & Installation",
    eyebrow: "Elevator Workflow",
    description: "Continue as admin for estimate preparation or as customer for a quick request form.",
    roles: {
      admin: {
        label: "Admin",
        description: "Prepare an elevator estimate with project details, scope components, and cost.",
        path: "/elevator/admin",
      },
      customer: {
        label: "Customer",
        description: "Share your elevator requirement and our team will reach out shortly.",
        path: "/elevator/customer",
      },
    },
  },
  travel: {
    title: "Tours & Travels",
    eyebrow: "Travel Workflow",
    description: "Choose the right journey flow for your travel request.",
    roles: {
      admin: {
        label: "Admin",
        description: "Travel admin estimate workflow is reserved for a later update.",
        disabled: true,
      },
      customer: {
        label: "Customer",
        description: "Enter trip details and get a vehicle suggestion instantly.",
        path: "/travel/customer",
      },
    },
  },
};

export const interactiveServiceKeys = Object.keys(serviceFlows);

export const getServiceFlow = (serviceKey) => serviceFlows[serviceKey];
