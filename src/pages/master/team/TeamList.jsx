import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../../layout/Layout";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { IconEdit, IconEye, IconPlus } from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import ViewTeam from "./ViewTeam";
import {
  MasterTeamCreate,
  MasterTeamEdit,
  MasterTeamView,
} from "../../../components/buttonIndex/ButtonComponents";
import { CreateButton } from "../../../components/common/ButtonColors";
import { encryptId } from "../../../components/common/EncryptionDecryption";

const TeamList = () => {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isViewExpanded, setIsViewExpanded] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
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

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/web-fetch-team-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTeamData(response.data?.user);
    } catch (error) {
      console.error("Error fetching Team data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "full_name",
        header: "Full Name",
        size: 150,
      },
      {
        accessorKey: "user_branch",
        header: "Branch",
        size: 150,
      },
      {
        accessorKey: "user_company",
        header: "Company",
        size: 50,
      },
      {
        accessorKey: "mobile",
        header: "Mobile",
        size: 150,
      },
      {
        accessorKey: "user_type_id",
        header: "User Type",
        size: 50,
        Cell: ({ row }) => {
          const userType = row.original.user_type_id;

          return <span>{userType == "3" ? "Office" : "Branch Manager"}</span>;
        },
      },
      {
        accessorKey: "user_salary",
        header: "Salary",
        size: 50,
      },
      {
        accessorKey: "user_status",
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
                onClick={() => navigate(`/master/team-edit/${id}`)}
                className="flex items-center space-x-2"
                title="Edit"
              >
                <IconEdit className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div> */}
              <MasterTeamEdit
                // onClick={() => navigate(`/master/team-edit/${id}`)}
                onClick={() => {
                  const encryptedId = encryptId(id);
                  const searchStr = searchParams.toString();
                  navigate(
                    `/master/team-edit/${encodeURIComponent(encryptedId)}${searchStr ? `?${searchStr}` : ""}`,
                  );
                }}
                className="flex items-center space-x-2"
              />

              {/* <div
                onClick={() => {
                  setSelectedVehicleId(id);
                  setIsViewExpanded(true);
                }}
                className="flex items-center space-x-2"
                title="View"
              >
                <IconEye className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div> */}
              <MasterTeamView
                onClick={() => {
                  setSelectedVehicleId(id);
                  setIsViewExpanded(true);
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
    data: teamData || [],
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
          if (!teamData || teamData.length === 0) {
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
              Team List
            </h1>
            <div className="flex gap-2">
              {/* <button
                onClick={() => navigate("/master/createTeam")}
                className=" flex flex-row items-center gap-1 text-center text-sm font-[400] cursor-pointer  w-[7rem] text-white bg-blue-600 hover:bg-red-700 p-2 rounded-lg shadow-md"
              >
                <IconPlus className="w-4 h-4" /> Team
              </button> */}
              <MasterTeamCreate
                onClick={() => {
                  const searchStr = searchParams.toString();
                  navigate(
                    `/master/createTeam${searchStr ? `?${searchStr}` : ""}`,
                  );
                }}
                className={CreateButton}
              />
            </div>
          </div>
        </div>
        <div className=" flex w-full  gap-2 relative ">
          <div
            className={`
            ${isViewExpanded ? "w-[70%]" : "w-full"} 
            transition-all duration-300 ease-in-out  
            pr-4
          `}
          >
            <MantineReactTable table={table} />
          </div>

          {isViewExpanded && (
            <div
              className={`
                      w-[30%] 
                       p-4
                      border-l 
                      border-red-400
                      transition-all 
                      duration-300 
                      ease-in-out 
                      absolute 
                      right-0
                      
                     
                    
                      ${
                        isViewExpanded
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 translate-x-full"
                      }
                    `}
            >
              <div className="flex justify-end ml-2 ">
                <button
                  title="close"
                  className="text-black font-[700] cursor-pointer hover:text-red-900"
                  onClick={() => {
                    setIsViewExpanded(false);
                    setSelectedVehicleId(null);
                  }}
                >
                  ✕
                </button>
              </div>
              <ViewTeam teamId={selectedVehicleId} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TeamList;
