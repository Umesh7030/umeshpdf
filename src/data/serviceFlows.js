export const serviceFlows = {
  solar: {
    title: "Solar Solutions",
    eyebrow: "Solar Workflow",
    description: "Choose Admin or Customer to continue with solar.",
    roles: {
      admin: {
        label: "Admin",
        description: "Open the solar estimate studio.",
        path: "/solar/admin",
      },
      customer: {
        label: "Customer",
        description: "Submit your solar requirement.",
        path: "/solar/customer",
      },
    },
  },
  elevator: {
    title: "Elevator Service & Installation",
    eyebrow: "Elevator Workflow",
    description: "Choose Admin or Customer to continue with elevator service.",
    roles: {
      admin: {
        label: "Admin",
        description: "Prepare the elevator estimate.",
        path: "/elevator/admin",
      },
      customer: {
        label: "Customer",
        description: "Share your elevator requirement.",
        path: "/elevator/customer",
      },
    },
  },
  travel: {
    title: "Tours & Travels",
    eyebrow: "Travel Workflow",
    description: "Choose your role to continue with travel service.",
    roles: {
      admin: {
        label: "Admin",
        description: "Travel admin flow will be added later.",
        disabled: true,
      },
      customer: {
        label: "Customer",
        description: "Enter trip details and get a vehicle suggestion.",
        path: "/travel/customer",
      },
    },
  },
};

export const interactiveServiceKeys = Object.keys(serviceFlows);

export const getServiceFlow = (serviceKey) => serviceFlows[serviceKey];
