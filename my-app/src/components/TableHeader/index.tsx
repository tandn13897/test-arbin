import React, { ReactElement, FC } from "react";
import {
  EnhancedTableProps,
  HeadCell,
  iotDataType,
} from "../../type/table-type";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Checkbox from "@mui/material/Checkbox";
import TableSortLabel from "@mui/material/TableSortLabel";
import Box from "@mui/material/Box";
import { visuallyHidden } from "@mui/utils";

const headCells: readonly HeadCell[] = [
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "Detail",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Device Name",
  },
  {
    id: "location",
    numeric: true,
    disablePadding: false,
    label: "Location",
  },
  {
    id: "currentTemperature",
    numeric: true,
    disablePadding: false,
    label: "Temperature",
  },
  {
    id: "currentHumidity",
    numeric: true,
    disablePadding: false,
    label: "Humidity",
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "details",
    numeric: true,
    disablePadding: false,
    label: "Chart",
  },
];

const EnhancedTableHead: FC<EnhancedTableProps> = (props): ReactElement => {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof iotDataType) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };
  return (
    <div data-testid="enhanced-table-head" className="enhanced-table-head">
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all desserts",
              }}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
                disabled={headCell.id === "details" ? true : false}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    </div>
  );
};

export default EnhancedTableHead;
