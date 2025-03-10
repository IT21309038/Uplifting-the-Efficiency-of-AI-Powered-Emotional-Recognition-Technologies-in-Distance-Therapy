import { Icon } from "@iconify/react";

const defaultIconSize = 24;

export const navigation = [
  {
    key: "1",
    label: "Doctor",
    icon: (
      <Icon icon="hugeicons:doctor-01" style={{ fontSize: defaultIconSize }} />
    ),
    path: "/",
    breadcrumb: [
      {
        title: "Doctor",
      },
    ],
    allowedRoles: ["DOCTOR"], // Keep allowedRoles for consistency
  },
  {
    key: "2",
    label: "Conference",
    icon: <Icon icon="lucide:video" style={{ fontSize: defaultIconSize }} />,
    path: "/VideoConference",
    breadcrumb: [
      {
        title: "Video Conference",
      },
    ],
    allowedRoles: ["DOCTOR"], // Specify allowedRoles here as well
  },
  {
    key: "3",
    label: "Reports",
    icon: <Icon icon="mdi:report-line" style={{ fontSize: defaultIconSize }} />,
    allowedRoles: ["DOCTOR"], // Parent-level allowedRoles
    children: [
      {
        key: "3.1",
        label: "Diagnostic Report",
        path: "/Reports/Diagnostic",
        breadcrumb: [
          {
            title: "Reports",
          },
          {
            title: "Diagnostic Report",
          },
        ],
        allowedRoles: ["DOCTOR"],
      },
      {
        key: "3.2",
        label: "Stress Report",
        path: "/Reports/Stress",
        breadcrumb: [
          {
            title: "Reports",
          },
          {
            title: "Stress Report",
          },
        ],
        allowedRoles: ["DOCTOR"],
      },
    ],
  },
  {
    key: "4",
    label: "My Appointments",
    icon: (
      <Icon
        icon="lucide:calendar-check"
        style={{ fontSize: defaultIconSize }}
      />
    ),
    path: "/VideoConference",
    breadcrumb: [
      {
        title: "My Appointments",
      },
    ],
    allowedRoles: ["DOCTOR"], // Specify allowedRoles here as well
  },
];
