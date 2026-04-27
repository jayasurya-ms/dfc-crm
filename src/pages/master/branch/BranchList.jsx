import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../../layout/Layout";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import {
  MasterBranchCreate,
  MasterBranchEdit,
} from "../../../components/buttonIndex/ButtonComponents";
import { CreateButton } from "../../../components/common/ButtonColors";
import { encryptId } from "../../../components/common/EncryptionDecryption";

const BranchList = () => {
  const [branchData, setBranchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageQuery = searchParams.get("page") || "1";
  const initialPageIndex = parseInt(pageQuery, 10) - 1;
  const searchQuery = searchParams.get("search") || "";

  const [globalFilter, setGlobalFilter] = useState(searchQuery);
  const [pagination, setPagination] = useState({
    pageIndex: initialPageIndex,
    pageSize: 10,
  });

  // Sync URL with state (for browser back/forward and initial load)
  useEffect(() => {
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10) - 1;

    if (search !== globalFilter) {
      setGlobalFilter(search);
    }
    if (page !== pagination.pageIndex) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: page,
      }));
    }
  }, [searchParams]);

  const fetchBranchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-branch-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setBranchData(response.data?.branch);
    } catch (error) {
      console.error("Error fetching Branch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "branch_name",
        header: "Branch",
        size: 50,
      },
      {
        accessorKey: "branch_salary_type",
        header: "Salary Type",
        size: 50,
      },

      {
        accessorKey: "combined",
        header: "Bata 6W/10 W",
        size: 150,
        accessorFn: (row) =>
          `${row.branch_bata_for_km_6W} - ${row.branch_bata_for_km_10W}`,
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-black font-semibold">
              {row.original.branch_bata_for_km_6W}/
              {row.original.branch_bata_for_km_10W}
            </span>
          </div>
        ),
      },
      // {
      //   accessorKey: "branch_bata_for_km_6W",
      //   header: "Bata For 6W KM",
      //   size: 50,
      //   Cell: ({ row }) => {
      //     const branch1 = row.original.branch_bata_for_km_6W;

      //     return <span>&#8377; {branch1}</span>;
      //   },
      // },
      // {
      //   accessorKey: "branch_bata_for_km_10W",
      //   header: "Bata For 10W KM",
      //   size: 50,
      //   Cell: ({ row }) => {
      //     const branch2 = row.original.branch_bata_for_km_10W;

      //     return <span>&#8377; {branch2}</span>;
      //   },
      // },

      {
        accessorKey: "combined1",
        header: "Salary 6W/10 W",
        size: 150,
        accessorFn: (row) =>
          `${row.branch_salary_6W} - ${row.branch_salary_10W}`,
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-black font-semibold">
              {row.original.branch_salary_6W}/{row.original.branch_salary_10W}
            </span>
          </div>
        ),
      },
      // {
      //   accessorKey: "branch_salary_6W",
      //   header: "Salary For 6W",
      //   size: 50,
      //   Cell: ({ row }) => {
      //     const branch3 = row.original.branch_salary_6W;

      //     return <span>&#8377; {branch3}</span>;
      //   },
      // },
      // {
      //   accessorKey: "branch_salary_10W",
      //   header: "Salary For 10W",
      //   size: 50,
      //   Cell: ({ row }) => {
      //     const branch4 = row.original.branch_salary_10W;

      //     return <span>&#8377; {branch4}</span>;
      //   },
      // },

      {
        accessorKey: "combined2",
        header: "Incentive 6W/10 W",
        size: 150,
        accessorFn: (row) =>
          `${row.branch_incentive_6W} - ${row.branch_incentive_10W}`,
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-black font-semibold">
              {row.original.branch_incentive_6W}/
              {row.original.branch_incentive_10W}
            </span>
          </div>
        ),
      },
      // {
      //   accessorKey: "branch_incentive_6W",
      //   header: "Incentive For 6W",
      //   size: 50,
      //   Cell: ({ row }) => {
      //     const branch5 = row.original.branch_incentive_6W;

      //     return <span>&#8377; {branch5}</span>;
      //   },
      // },
      // {
      //   accessorKey: "branch_incentive_10W",
      //   header: "Incentive For 10W",
      //   size: 50,
      //   Cell: ({ row }) => {
      //     const branch6 = row.original.branch_incentive_10W;

      //     return <span>&#8377; {branch6}</span>;
      //   },
      // },

      {
        accessorKey: "combined3",
        header: "Bata 6W/10 W Day",
        size: 150,
        accessorFn: (row) =>
          `${row.branch_bata_for_trip_6W} - ${row.branch_bata_for_trip_10W}`,
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-black font-semibold">
              {row.original.branch_bata_for_trip_6W}/
              {row.original.branch_bata_for_trip_10W}
            </span>
          </div>
        ),
      },
      // {
      //   accessorKey: "branch_bata_for_trip_6W",
      //   header: "Bata For 6W Day",
      //   size: 50,
      //   Cell: ({ row }) => {
      //     const branch7 = row.original.branch_bata_for_trip_6W;

      //     return <span>&#8377; {branch7}</span>;
      //   },
      // },
      // {
      //   accessorKey: "branch_bata_for_trip_10W",
      //   header: "Bata For 10W Day",
      //   size: 50,
      //   Cell: ({ row }) => {
      //     const branch8 = row.original.branch_bata_for_trip_10W;

      //     return <span>&#8377; {branch8}</span>;
      //   },
      // },
      {
        accessorKey: "branch_status",
        header: "Status",
        size: 50,
      },
      {
        accessorKey: "created_by",
        header: "Created By",
        size: 50,
      },
      {
        accessorKey: "updated_by",
        header: "Update By",
        size: 50,
      },
      {
        id: "id",
        header: "Action",
        size: 20,
        enableHiding: false,
        Cell: ({ row }) => {
          const id = row.original.id;

          return (
            <div className="flex gap-2">
              {/* <div
                onClick={() => navigate(`/master/branch-edit/${id}`)}
                className="flex items-center space-x-2"
                title="Edit"
              >
                <IconEdit className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div> */}
              <MasterBranchEdit
                // onClick={() => navigate(`/master/branch-edit/${id}`)}
                onClick={() => {
                  const encryptedId = encryptId(id);
                  const searchStr = searchParams.toString();
                  navigate(
                    `/master/branch-edit/${encodeURIComponent(
                      encryptedId,
                    )}${searchStr ? `?${searchStr}` : ""}`,
                  );
                }}
                className="flex items-center space-x-2"
              />
            </div>
          );
        },
      },
    ],
    [location.search, navigate],
  );

  const table = useMantineReactTable({
    columns,
    data: branchData || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableHiding: false,
    enableStickyHeader: true,
    enableStickyFooter: true,
    state: {
      showGlobalFilter: showSearch,
      globalFilter,
      pagination,
    },
    onShowGlobalFilterChange: setShowSearch,
    onGlobalFilterChange: (value) => {
      const nextFilter = value || "";
      if (nextFilter !== globalFilter) {
        setGlobalFilter(nextFilter);
        const params = new URLSearchParams(searchParams);
        if (nextFilter) {
          params.set("search", nextFilter);
        } else {
          params.delete("search");
        }
        params.set("page", "1");
        setSearchParams(params, { replace: true });
      }
    },
    onPaginationChange: (updater) => {
      setPagination((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;

        // CRITICAL GUARD: If the table tries to reset to page 1 (index 0)
        // while we are still loading data or have no data yet, IGNORE IT
        // if the current URL/state expects us to be on a higher page.
        if (next.pageIndex === 0 && prev.pageIndex > 0) {
          if (!branchData || branchData.length === 0) {
            return prev; // Ignore the reset from the table
          }
        }

        // Only update URL if it's an actual change
        if (next.pageIndex !== prev.pageIndex) {
          const params = new URLSearchParams(searchParams);
          params.set("page", (next.pageIndex + 1).toString());
          setSearchParams(params, { replace: true });
        }
        return next;
      });
    },
    autoResetPagination: false,
    autoResetGlobalFilter: false,
    autoResetAll: false,
    mantineSearchTextInputProps: {
      autoFocus: true,
    },
    mantineTableContainerProps: { sx: { maxHeight: "400px" } },
    enableColumnFilters: false,
    initialState: {
      columnVisibility: { address: false },
      pagination: {
        pageIndex: initialPageIndex,
        pageSize: 10,
      },
    },
  });

  return (
    <Layout>
      <div className="max-w-screen">
        <div className="bg-white p-4 mb-4 rounded-lg shadow-md">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
            <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-center md:text-left">
              Branch List
            </h1>
            <div className="flex gap-2">
              {/* <button
                onClick={() => navigate("/master/CreateBranch")}
                className=" flex flex-row items-center gap-1 text-center text-sm font-[400] cursor-pointer  w-[7rem] text-white bg-blue-600 hover:bg-red-700 p-2 rounded-lg shadow-md"
              >
                <IconPlus className="w-4 h-4" /> Branch
              </button> */}
              <MasterBranchCreate
                onClick={() => {
                  const searchStr = searchParams.toString();
                  navigate(
                    `/master/CreateBranch${searchStr ? `?${searchStr}` : ""}`,
                  );
                }}
                className={CreateButton}
              />
            </div>
          </div>
        </div>

        <div className=" max-w-screen shadow-md">
          <MantineReactTable table={table} />
        </div>
      </div>
    </Layout>
  );
};

export default BranchList;
