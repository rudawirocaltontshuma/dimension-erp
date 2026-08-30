import type { Priority, Project, ProjectCost, ProjectStatus, ProjectTask, TaskStatus } from "@/types/erp";

import { employees } from "./hr";
import { createRng, intBetween, isoDate, moneyBetween, pick, weighted } from "./random";

const PROJECT_SEEDS = [
  {
    name: "Warehouse Management System Rollout",
    client: "Internal — Operations",
    department: "Information Technology",
  },
  { name: "Cape Town DC Racking Expansion", client: "Internal — Operations", department: "Operations" },
  { name: "Ardent Retail Fit-Out Programme", client: "Ardent Retail Group", department: "Operations" },
  { name: "Bosveld Mining Supply Contract", client: "Bosveld Mining Services", department: "Sales" },
  { name: "Fleet Telematics Upgrade", client: "Internal — Logistics", department: "Operations" },
  { name: "Supplier Portal Modernisation", client: "Internal — Procurement", department: "Information Technology" },
  { name: "Durban Cold Chain Facility", client: "Overberg Cold Storage", department: "Operations" },
  { name: "Group Financial Consolidation", client: "Internal — Finance", department: "Finance" },
  { name: "Retail Channel Expansion", client: "Fourways Retail Holdings", department: "Sales" },
  { name: "Manufacturing Line Automation", client: "Internal — Manufacturing", department: "Operations" },
  { name: "Energy Efficiency Retrofit", client: "Quantum Utilities SA", department: "Operations" },
  { name: "Customer Self-Service Portal", client: "Internal — Sales", department: "Information Technology" },
  { name: "Procurement Category Review", client: "Internal — Procurement", department: "Procurement" },
  { name: "Gqeberha Branch Launch", client: "Internal — Operations", department: "Operations" },
  { name: "Safety Compliance Programme", client: "Internal — HR", department: "Human Resources" },
  { name: "Data Warehouse Migration", client: "Midrand Data Centres", department: "Information Technology" },
  { name: "Brand Refresh Campaign", client: "Internal — Marketing", department: "Marketing" },
  { name: "Tshwane Metro Framework Supply", client: "Tshwane Metro Projects", department: "Sales" },
  { name: "Inventory Accuracy Initiative", client: "Internal — Operations", department: "Operations" },
  { name: "Payroll System Consolidation", client: "Internal — HR", department: "Human Resources" },
  { name: "Paarl Bottling Line Support", client: "Paarl Bottling Company", department: "Operations" },
  { name: "Regional Distribution Optimisation", client: "Internal — Logistics", department: "Operations" },
];

const MILESTONE_NAMES = [
  "Discovery & scoping",
  "Solution design",
  "Build and configure",
  "User acceptance testing",
  "Go live",
  "Post go-live support",
];

function buildProjects(): Project[] {
  const rng = createRng(20260321);

  return PROJECT_SEEDS.map((seed, index) => {
    const status = weighted<ProjectStatus>(rng, [
      ["Active", 38],
      ["Completed", 22],
      ["Planning", 18],
      ["At Risk", 12],
      ["On Hold", 10],
    ]);
    const budget = Math.round(moneyBetween(rng, 480000, 12400000) / 100) * 100;
    const progress =
      status === "Completed" ? 100 : status === "Planning" ? intBetween(rng, 0, 15) : intBetween(rng, 18, 92);
    const spent = Math.round(budget * (progress / 100) * moneyBetween(rng, 0.82, 1.14) * 100) / 100;
    const startDay = -intBetween(rng, 30, 420);
    const team = Array.from(
      { length: intBetween(rng, 3, 8) },
      (_, memberIndex) => employees[(index * 5 + memberIndex * 3) % employees.length].fullName,
    );

    return {
      id: `PRJ-${1100 + index}`,
      code: `PRJ-${1100 + index}`,
      name: seed.name,
      client: seed.client,
      manager: employees[(index * 7) % employees.length].fullName,
      department: seed.department,
      startDate: isoDate(startDay),
      deadline: isoDate(startDay + intBetween(rng, 120, 460)),
      budget,
      spent,
      progress,
      status,
      currency: "ZAR",
      team: Array.from(new Set(team)),
      description: `${seed.name} delivers a coordinated workstream for ${seed.client.replace("Internal — ", "the ")} covering planning, execution, quality assurance and formal handover to the operating team.`,
      milestones: MILESTONE_NAMES.map((name, milestoneIndex) => ({
        id: `PRJ-${1100 + index}-M${milestoneIndex + 1}`,
        name,
        dueDate: isoDate(startDay + 45 * (milestoneIndex + 1)),
        status:
          progress > (milestoneIndex + 1) * 16
            ? ("Complete" as const)
            : progress > milestoneIndex * 16
              ? ("In Progress" as const)
              : ("Pending" as const),
      })),
    };
  });
}

export const projects: Project[] = buildProjects();
export const projectById = (id: string) => projects.find((project) => project.id === id);

const TASK_TITLES = [
  "Confirm scope with the operating stakeholders",
  "Prepare the detailed solution design pack",
  "Configure the master data structures",
  "Run the integration walkthrough workshop",
  "Draft the user acceptance test scripts",
  "Complete the supplier data cleanse",
  "Validate the reporting requirements",
  "Update the risk and issue register",
  "Prepare the training material set",
  "Schedule the cutover rehearsal",
  "Sign off the commercial variation",
  "Review the resource allocation plan",
  "Capture the site survey findings",
  "Finalise the equipment specification",
  "Close out the outstanding punch list",
  "Publish the weekly progress report",
];

const TASK_STATUSES: TaskStatus[] = ["Backlog", "Todo", "In Progress", "Review", "Done"];

function buildTasks(): ProjectTask[] {
  const rng = createRng(20260528);

  return Array.from({ length: 86 }, (_, index) => {
    const project = projects[index % projects.length];
    return {
      id: `TSK-${9100 + index}`,
      reference: `TSK-${9100 + index}`,
      title: TASK_TITLES[index % TASK_TITLES.length],
      projectId: project.id,
      projectName: project.name,
      assignee: project.team[index % project.team.length],
      priority: weighted<Priority>(rng, [
        ["Medium", 42],
        ["High", 26],
        ["Low", 22],
        ["Critical", 10],
      ]),
      status: TASK_STATUSES[index % TASK_STATUSES.length],
      dueDate: isoDate(intBetween(rng, -30, 60)),
      estimateHours: intBetween(rng, 2, 60),
      loggedHours: intBetween(rng, 0, 48),
      tags: [project.department, pick(rng, ["Delivery", "Planning", "Quality", "Commercial"])],
    };
  });
}

export const projectTasks: ProjectTask[] = buildTasks();

function buildProjectCosts(): ProjectCost[] {
  const rng = createRng(20260614);
  const categories = ["Labour", "Materials", "Subcontractor", "Travel", "Equipment", "Software"] as const;

  return Array.from({ length: 72 }, (_, index) => {
    const project = projects[(index * 3) % projects.length];
    const category = categories[index % categories.length];

    return {
      id: `PC-${8200 + index}`,
      reference: `PC-${8200 + index}`,
      projectId: project.id,
      projectName: project.name,
      date: isoDate(-intBetween(rng, 1, 180)),
      category,
      description: `${category} cost recorded against ${project.code} for the current reporting period.`,
      amount: Math.round(moneyBetween(rng, 4800, 1284500) * 100) / 100,
      currency: "ZAR",
      status: weighted(rng, [
        ["Approved", 46],
        ["Recorded", 34],
        ["Invoiced", 20],
      ] as const),
    };
  });
}

export const projectCosts: ProjectCost[] = buildProjectCosts();

export const projectSummary = {
  total: projects.length,
  active: projects.filter((project) => project.status === "Active").length,
  atRisk: projects.filter((project) => project.status === "At Risk").length,
  completed: projects.filter((project) => project.status === "Completed").length,
  onHold: projects.filter((project) => project.status === "On Hold").length,
  budget: Math.round(projects.reduce((sum, project) => sum + project.budget, 0) * 100) / 100,
  spent: Math.round(projects.reduce((sum, project) => sum + project.spent, 0) * 100) / 100,
  teamMembers: new Set(projects.flatMap((project) => project.team)).size,
};
