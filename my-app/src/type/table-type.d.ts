export interface HeadCell {
  disablePadding: boolean;
  id: keyof iotDataType;
  label: string;
  numeric: boolean;
}

export type Order = "asc" | "desc";

export interface iotDataType {
  id: number;
  name: string;
  location: string;
  currentTemperature: number;
  currentHumidity: number;
  open: boolean;
  status: "disconnected" | "connected" | "healthy" | "error";
  details: {
    name: string;
    temperatureDataPoints: { time: number; temp: number }[];
    humidityDataPoints: { time: number; humi: number }[];
  };
}

export interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof iotDataType
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

export interface DataState {
  dataList: iotDataType[];
}
