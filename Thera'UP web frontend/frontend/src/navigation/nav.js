import { Icon } from "@iconify/react";
import { all } from "axios";

const defaultIconSize = 24;

export const navigation = [
  {
    key: "1",
    label: "Doctor",
    icon: <Icon icon="ic:round-home" style={{ fontSize: defaultIconSize }} />,
    path: "/Doctor",
    breadcrumb: [
      {
        title: "Doctor",
      },
    ],
    allowedRoles: ["Doctor"],
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
    allowedRoles: ["Doctor"],
  },
  {
    key: "3",
    label: "Reports",
    icon: <Icon icon="mdi:report-line" style={{ fontSize: defaultIconSize }} />,
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
            title: "Diagnostic",
          },
        ],
        allowedRoles: ["Doctor"],
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
            title: "Stress",
          },
        ],
        allowedRoles: ["Doctor"],
      },
    ],
  },
];
