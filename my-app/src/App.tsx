import React, {
  useState,
  MouseEvent,
  ChangeEvent,
  useMemo,
  useEffect,
} from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import EnhancedTableHead from "./components/TableHeader";
import EnhancedTableToolbar from "./components/TableToolbar";
import { Order, iotDataType } from "./type/table-type";
import { getComparator, stableSort } from "./utils/index";
import { useGetDataQuery } from "./redux/data.services";
import Skeleton from "@mui/material/Skeleton";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import TableHead from "@mui/material/TableHead";

export default function EnhancedTable() {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof iotDataType>("id");
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [expanded, setExpanded] = useState<readonly number[]>([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchingKey, setSearchingKey] = useState("");
  const [dataTable, setDataTable] = useState<iotDataType[]>([]);

  const { data, isFetching } = useGetDataQuery({});

  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: keyof iotDataType
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && dataTable) {
      const newSelected = dataTable.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleExpandRow = (event: MouseEvent<unknown>, id: number) => {
    const expandIndex = expanded.indexOf(id);
    let newExpanded: readonly number[] = [];
    if (expandIndex === -1) {
      newExpanded = newExpanded.concat(expanded, id);
    } else if (expandIndex === 0) {
      newExpanded = newExpanded.concat(expanded.slice(1));
    } else if (expandIndex === expanded.length - 1) {
      newExpanded = newExpanded.concat(expanded.slice(0, -1));
    } else if (expandIndex > 0) {
      newExpanded = newExpanded.concat(
        expanded.slice(0, expandIndex),
        expanded.slice(expandIndex + 1)
      );
    }
    setExpanded(newExpanded);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;
  const isExpand = (id: number) => expanded.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 && dataTable
      ? Math.max(0, (1 + page) * rowsPerPage - dataTable.length)
      : 0;

  const visibleRows = useMemo(() => {
    return (
      dataTable &&
      stableSort(
        dataTable as iotDataType[],
        getComparator(order, orderBy)
      ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    );
  }, [order, orderBy, page, rowsPerPage, dataTable]);

  const handleSearchingKey = (value: string) => {
    setSearchingKey(value);
  };

  useEffect(() => {
    let value = searchingKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (data && value === "") {
      setDataTable(data);
    } else {
      const filterData = dataTable.filter((each) =>
        each.name.match(new RegExp(value, "i"))
      );
      setDataTable(filterData);
    }
  }, [data, dataTable, searchingKey]);

  useEffect(() => {
    if (data) {
      setDataTable(data);
    }
  }, [data]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TextField
          value={searchingKey}
          onChange={(e) => handleSearchingKey(e.target.value)}
          id="outlined-basic"
          label="Searching"
          variant="outlined"
        />
        <EnhancedTableToolbar numSelected={selected.length} />
        {isFetching ? (
          <Skeleton variant="rounded" width={1100} height={400} />
        ) : (
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={dataTable ? dataTable.length : 0}
              />
              <TableBody>
                {dataTable &&
                  (visibleRows as unknown as iotDataType[]).map(
                    (row, index) => {
                      const isItemSelected = isSelected(row.name as string);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      const isItemExpand = isExpand(row.id);

                      return (
                        <>
                          <TableRow
                            hover
                            onClick={(event) =>
                              handleClick(event, row.name as string)
                            }
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.name}
                            selected={isItemSelected}
                            sx={{ cursor: "pointer" }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                inputProps={{
                                  "aria-labelledby": labelId,
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={(e) => handleExpandRow(e, row.id)}
                              >
                                {isItemExpand ? (
                                  <KeyboardArrowUpIcon />
                                ) : (
                                  <KeyboardArrowDownIcon />
                                )}
                              </IconButton>
                            </TableCell>
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                            >
                              {row.name}
                            </TableCell>
                            <TableCell align="right">{row.location}</TableCell>
                            <TableCell align="right">
                              {row.currentTemperature}
                            </TableCell>
                            <TableCell align="right">
                              {row.currentHumidity}
                            </TableCell>
                            <TableCell
                              align="right"
                              style={{
                                color:
                                  row.status === "connected" ||
                                  row.status === "healthy"
                                    ? "green"
                                    : "red",
                              }}
                            >
                              {row.status}
                            </TableCell>
                            <TableCell align="right">
                              {row.details.name}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              style={{ paddingBottom: 0, paddingTop: 0 }}
                              colSpan={6}
                            >
                              <Collapse
                                in={isItemExpand}
                                timeout="auto"
                                unmountOnExit
                              >
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  component="div"
                                >
                                  Detail Temparute & Humidity
                                </Typography>
                                <div
                                  style={{
                                    display: "flex",
                                  }}
                                >
                                  <Box sx={{ margin: 1 }} width={"50%"}>
                                    <Table size="small" aria-label="purchases">
                                      <TableHead>
                                        <TableRow>
                                          <TableCell>Time</TableCell>
                                          <TableCell>Temperature</TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {row.details.temperatureDataPoints.map(
                                          (tem) => (
                                            <TableRow key={tem.time}>
                                              <TableCell
                                                component="th"
                                                scope="row"
                                              >
                                                {tem.time}
                                              </TableCell>
                                              <TableCell>{tem.temp}C</TableCell>
                                            </TableRow>
                                          )
                                        )}
                                      </TableBody>
                                    </Table>
                                  </Box>
                                  <Box sx={{ margin: 1 }} width={"50%"}>
                                    <Table size="small" aria-label="purchases">
                                      <TableHead>
                                        <TableRow>
                                          <TableCell>Time</TableCell>
                                          <TableCell>Humidity</TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {row.details.humidityDataPoints.map(
                                          (hum) => (
                                            <TableRow key={hum.time}>
                                              <TableCell
                                                component="th"
                                                scope="row"
                                              >
                                                {hum.time}
                                              </TableCell>
                                              <TableCell>{hum.humi}</TableCell>
                                            </TableRow>
                                          )
                                        )}
                                      </TableBody>
                                    </Table>
                                  </Box>
                                </div>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    }
                  )}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={dataTable ? dataTable.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}
