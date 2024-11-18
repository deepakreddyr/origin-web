import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import * as React from "react";

import styles from "../../style.module.css";

function createData(rewards: string, minCartValue: any, coin: any) {
  return { rewards, minCartValue, coin };
}

const rows = [
  createData(
    "From 1st order 10% from 199 and above",
    199,
    "10% of coins on order value"
  ),
  createData("Referral Rewards", "", "50 Reward Coins"),
  createData("Second Time Slot", 199, "5% of coins on order value"),
  createData("In Store", 1, "10% of coins on order value"),
];

export default function RewardsDetailsTable() {
  return (
    <TableContainer
      component={Paper}
      className={`table-container ${styles["table-container"]}`}
    >
      <Table sx={{ minWidth: 100 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Rewards</TableCell>
            <TableCell align="right" className="medium">
              Min Cart Value
            </TableCell>
            <TableCell align="right" className="big">
              Coin Earned on order
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.rewards}
              sx={{ "&:last-child td, &:last-child td": { border: 0 } }}
            >
              <TableCell component="td" scope="row">
                {row.rewards}
              </TableCell>
              <TableCell className={`medium ${styles.medium}`} align="right">
                {row.minCartValue}
              </TableCell>
              <TableCell className={`big ${styles.big}`} align="right">
                {row.coin}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
