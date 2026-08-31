import type {
  AttendanceRecord,
  AttendanceStatus,
  Department,
  Employee,
  EmployeeStatus,
  LeaveRequest,
  LeaveStatus,
  LeaveType,
  PayrollRun,
  PerformanceReview,
} from "@/types/erp";

import {
  createRng,
  FIRST_NAMES,
  intBetween,
  isoDate,
  LAST_NAMES,
  moneyBetween,
  padNumber,
  pick,
  SA_CITIES,
  STREET_NAMES,
  weighted,
} from "./random";

export const departments: Department[] = [
  {
    id: "DEP-01",
    name: "Finance",
    manager: "Marlene Botha",
    headcount: 14,
    openPositions: 2,
    annualBudget: 18420000,
    spentToDate: 11284600,
    performanceScore: 4.3,
    location: "Sandton Head Office",
    costCentre: "CC-1000",
  },
  {
    id: "DEP-02",
    name: "Sales",
    manager: "Grant Barnard",
    headcount: 22,
    openPositions: 4,
    annualBudget: 26840000,
    spentToDate: 17942800,
    performanceScore: 4.1,
    location: "Sandton Head Office",
    costCentre: "CC-2000",
  },
  {
    id: "DEP-03",
    name: "Operations",
    manager: "Sipho Nkosi",
    headcount: 38,
    openPositions: 5,
    annualBudget: 41284000,
    spentToDate: 28418600,
    performanceScore: 3.9,
    location: "Johannesburg Distribution Centre",
    costCentre: "CC-3000",
  },
  {
    id: "DEP-04",
    name: "Human Resources",
    manager: "Nomsa Radebe",
    headcount: 9,
    openPositions: 1,
    annualBudget: 9840000,
    spentToDate: 5842300,
    performanceScore: 4.4,
    location: "Sandton Head Office",
    costCentre: "CC-4000",
  },
  {
    id: "DEP-05",
    name: "Information Technology",
    manager: "Devan Pillay",
    headcount: 16,
    openPositions: 3,
    annualBudget: 22418000,
    spentToDate: 15284900,
    performanceScore: 4.5,
    location: "Sandton Head Office",
    costCentre: "CC-5000",
  },
  {
    id: "DEP-06",
    name: "Marketing",
    manager: "Chantelle Adams",
    headcount: 11,
    openPositions: 1,
    annualBudget: 12840000,
    spentToDate: 8462100,
    performanceScore: 4.0,
    location: "Sandton Head Office",
    costCentre: "CC-6000",
  },
  {
    id: "DEP-07",
    name: "Procurement",
    manager: "Kagiso Mokoena",
    headcount: 12,
    openPositions: 2,
    annualBudget: 10420000,
    spentToDate: 6284900,
    performanceScore: 4.2,
    location: "Johannesburg Distribution Centre",
    costCentre: "CC-7000",
  },
];

const JOB_TITLES: Record<string, string[]> = {
  Finance: [
    "Financial Manager",
    "Management Accountant",
    "Accounts Payable Clerk",
    "Credit Controller",
    "Financial Analyst",
  ],
  Sales: [
    "Sales Manager",
    "Key Account Manager",
    "Field Sales Representative",
    "Internal Sales Consultant",
    "Sales Administrator",
  ],
  Operations: [
    "Warehouse Manager",
    "Distribution Supervisor",
    "Picking Team Leader",
    "Inventory Controller",
    "Dispatch Coordinator",
  ],
  "Human Resources": ["HR Manager", "HR Business Partner", "Payroll Administrator", "Talent Acquisition Specialist"],
  "Information Technology": [
    "IT Manager",
    "Systems Administrator",
    "Business Analyst",
    "Software Engineer",
    "Support Technician",
  ],
  Marketing: ["Marketing Manager", "Brand Specialist", "Digital Marketing Coordinator", "Content Producer"],
  Procurement: [
    "Procurement Manager",
    "Category Buyer",
    "Supplier Relationship Specialist",
    "Procurement Administrator",
  ],
};

const LOCATIONS = [
  "Sandton Head Office",
  "Johannesburg Distribution Centre",
  "Cape Town Distribution Centre",
  "Durban Distribution Centre",
  "Pretoria Warehouse",
  "Pinetown Manufacturing Plant",
];

function buildEmployees(): Employee[] {
  const rng = createRng(20260909);

  return Array.from({ length: 46 }, (_, index) => {
    const department = departments[index % departments.length];
    const titles = JOB_TITLES[department.name];
    const firstName = FIRST_NAMES[(index * 3) % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(index * 5) % LAST_NAMES.length];
    const fullName = `${firstName} ${lastName}`;
    const place = SA_CITIES[index % SA_CITIES.length];
    const status = weighted<EmployeeStatus>(rng, [
      ["Active", 78],
      ["On Leave", 14],
      ["Inactive", 8],
    ]);

    return {
      id: `EMP-${padNumber(index + 1, 4)}`,
      employeeNumber: `NX${padNumber(1200 + index, 4)}`,
      firstName,
      lastName,
      fullName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/[^a-z]/g, "")}@dimension-demo.co.za`,
      phone: `+27 ${intBetween(rng, 60, 84)} ${intBetween(rng, 200, 899)} ${padNumber(intBetween(rng, 0, 9999), 4)}`,
      jobTitle: titles[index % titles.length],
      department: department.name,
      location: LOCATIONS[index % LOCATIONS.length],
      manager: department.manager,
      employmentType: weighted(rng, [
        ["Permanent", 74],
        ["Contract", 14],
        ["Part-Time", 8],
        ["Intern", 4],
      ] as const),
      status,
      hireDate: isoDate(-intBetween(rng, 90, 3400)),
      salary: Math.round(moneyBetween(rng, 18400, 128000) / 100) * 100,
      currency: "ZAR",
      leaveBalance: intBetween(rng, 0, 28),
      performanceScore: Math.round(moneyBetween(rng, 2.6, 4.9) * 10) / 10,
      attendanceRate: Math.round(moneyBetween(rng, 84, 99.8) * 10) / 10,
      idNumber: `${padNumber(intBetween(rng, 70, 99), 2)}${padNumber(intBetween(rng, 1, 12), 2)}${padNumber(intBetween(rng, 1, 28), 2)}${padNumber(intBetween(rng, 1000, 9999), 4)}08${intBetween(rng, 0, 9)}`,
      address: {
        line1: `${intBetween(rng, 2, 240)} ${pick(rng, STREET_NAMES)}`,
        city: place.city,
        province: place.province,
        postalCode: place.postalCode,
        country: "South Africa",
      },
    };
  });
}

export const employees: Employee[] = buildEmployees();
export const employeeById = (id: string) => employees.find((employee) => employee.id === id);

function buildAttendance(): AttendanceRecord[] {
  const rng = createRng(20260118);
  const records: AttendanceRecord[] = [];

  employees.slice(0, 32).forEach((employee, employeeIndex) => {
    for (let day = 0; day < 3; day++) {
      const status = weighted<AttendanceStatus>(rng, [
        ["Present", 64],
        ["Remote", 18],
        ["Late", 12],
        ["Absent", 6],
      ]);
      const checkInHour = status === "Late" ? 9 : 7;
      const checkIn =
        status === "Absent" ? "—" : `${padNumber(checkInHour, 2)}:${padNumber(intBetween(rng, 0, 59), 2)}`;
      const checkOut = status === "Absent" ? "—" : `1${intBetween(rng, 5, 8)}:${padNumber(intBetween(rng, 0, 59), 2)}`;

      records.push({
        id: `ATT-${padNumber(employeeIndex * 4 + day, 5)}`,
        employeeId: employee.id,
        employeeName: employee.fullName,
        department: employee.department,
        date: isoDate(-day - 1),
        checkIn,
        checkOut,
        hoursWorked: status === "Absent" ? 0 : Math.round(moneyBetween(rng, 6.4, 9.6) * 10) / 10,
        status,
      });
    }
  });

  return records;
}

export const attendanceRecords: AttendanceRecord[] = buildAttendance();

const LEAVE_TYPES: LeaveType[] = ["Annual", "Sick", "Personal", "Family Responsibility", "Study"];

function buildLeave(): LeaveRequest[] {
  const rng = createRng(20260404);

  return Array.from({ length: 42 }, (_, index) => {
    const employee = employees[index % employees.length];
    const startDay = intBetween(rng, -90, 40);
    const days = intBetween(rng, 1, 12);

    return {
      id: `LV-${3400 + index}`,
      employeeId: employee.id,
      employeeName: employee.fullName,
      department: employee.department,
      leaveType: LEAVE_TYPES[index % LEAVE_TYPES.length],
      startDate: isoDate(startDay),
      endDate: isoDate(startDay + days),
      days,
      status: weighted<LeaveStatus>(rng, [
        ["Approved", 54],
        ["Pending", 26],
        ["Rejected", 10],
        ["Cancelled", 10],
      ]),
      approver: employee.manager,
      reason: pick(rng, [
        "Scheduled family holiday.",
        "Medical appointment with supporting certificate.",
        "Personal matters requiring attention.",
        "Study leave for scheduled examinations.",
        "Family responsibility leave.",
      ]),
    };
  });
}

export const leaveRequests: LeaveRequest[] = buildLeave();

export const payrollRuns: PayrollRun[] = [
  {
    id: "PR-2026-06",
    period: "June 2026",
    employees: 122,
    grossPay: 8642180.5,
    deductions: 2184620.4,
    netPay: 6457560.1,
    status: "Processed",
    payDate: "2026-06-25",
  },
  {
    id: "PR-2026-05",
    period: "May 2026",
    employees: 121,
    grossPay: 8518420.2,
    deductions: 2148390.6,
    netPay: 6370029.6,
    status: "Paid",
    payDate: "2026-05-25",
  },
  {
    id: "PR-2026-04",
    period: "April 2026",
    employees: 119,
    grossPay: 8394180.9,
    deductions: 2114280.3,
    netPay: 6279900.6,
    status: "Paid",
    payDate: "2026-04-24",
  },
  {
    id: "PR-2026-03",
    period: "March 2026",
    employees: 118,
    grossPay: 8284620.4,
    deductions: 2084190.5,
    netPay: 6200429.9,
    status: "Paid",
    payDate: "2026-03-25",
  },
  {
    id: "PR-2026-02",
    period: "February 2026",
    employees: 116,
    grossPay: 8142600.1,
    deductions: 2048620.9,
    netPay: 6093979.2,
    status: "Paid",
    payDate: "2026-02-25",
  },
  {
    id: "PR-2026-07",
    period: "July 2026",
    employees: 122,
    grossPay: 8712400,
    deductions: 2201800,
    netPay: 6510600,
    status: "Draft",
    payDate: "2026-07-27",
  },
];

function buildPerformance(): PerformanceReview[] {
  const rng = createRng(20260517);

  return Array.from({ length: 38 }, (_, index) => {
    const employee = employees[(index * 3) % employees.length];
    const score = Math.round(moneyBetween(rng, 2.4, 4.9) * 10) / 10;

    return {
      id: `PRF-${1500 + index}`,
      employeeId: employee.id,
      employeeName: employee.fullName,
      department: employee.department,
      reviewPeriod: pick(rng, ["H1 2026", "H2 2025", "Q1 2026", "Q2 2026"]),
      reviewer: employee.manager,
      score,
      rating: score >= 4.5 ? "Outstanding" : score >= 4 ? "Exceeds" : score >= 3.2 ? "Meets" : "Needs Improvement",
      status: weighted(rng, [
        ["Completed", 58],
        ["In Progress", 26],
        ["Scheduled", 16],
      ] as const),
      reviewDate: isoDate(intBetween(rng, -120, 45)),
    };
  });
}

export const performanceReviews: PerformanceReview[] = buildPerformance();

export const hrSummary = {
  totalEmployees: 122,
  activeEmployees: employees.filter((employee) => employee.status === "Active").length,
  newHires: 9,
  openPositions: departments.reduce((sum, department) => sum + department.openPositions, 0),
  pendingLeave: leaveRequests.filter((request) => request.status === "Pending").length,
  attendanceRate: 94.6,
  averageSalary: 62840,
  turnoverRate: 8.4,
};

export const employeeGrowth = [
  { month: "Jul", employees: 108 },
  { month: "Aug", employees: 110 },
  { month: "Sep", employees: 112 },
  { month: "Oct", employees: 114 },
  { month: "Nov", employees: 115 },
  { month: "Dec", employees: 115 },
  { month: "Jan", employees: 116 },
  { month: "Feb", employees: 116 },
  { month: "Mar", employees: 118 },
  { month: "Apr", employees: 119 },
  { month: "May", employees: 121 },
  { month: "Jun", employees: 122 },
];

export const payrollTrend = payrollRuns
  .filter((run) => run.status !== "Draft")
  .map((run) => ({ period: run.period.split(" ")[0], gross: run.grossPay, net: run.netPay }))
  .reverse();
