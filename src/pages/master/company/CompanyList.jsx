import React, { useEffect, useMemo, useState, useRef } from "react";
import Layout from "../../../layout/Layout";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { IconEdit, IconEye, IconPlus } from "@tabler/icons-react";
import ViewCompany from "./ViewCompany";
import {
  MasterCompanyCreate,
  MasterCompanyEdit,
  MasterCompanyView,
} from "../../../components/buttonIndex/ButtonComponents";
import { encryptId } from "../../../components/common/EncryptionDecryption";
import { CreateButton } from "../../../components/common/ButtonColors";

const CompanyList = () => {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isViewExpanded, setIsViewExpanded] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

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

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-company-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCompanyData(response.data?.company);
    } catch (error) {
      console.error("Error fetching Company data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "company_short",
        header: "short",
        size: 150,
      },
      {
        accessorKey: "company_name",
        header: "Company",
        size: 150,
      },
      {
        accessorKey: "company_mobile",
        header: "Mobile",
        size: 50,
      },
      {
        accessorKey: "company_email",
        header: "Email",
        size: 150,
      },
      // {
      //   accessorKey: "company_gst",
      //   header: "Gst",
      //   size: 50,
      // },
      // {
      //   accessorKey: "company_pan",
      //   header: "Pan No",
      //   size: 50,lll
      // },
      {
        accessorKey: "combined",
        header: "GST & PAN No",
        size: 150,
        accessorFn: (row) => `${row.company_gst} - ${row.company_pan}`,
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-black font-semibold">
              {row.original.company_gst}
            </span>
            <span>{row.original.company_pan}</span>
          </div>
        ),
      },
      {
        accessorKey: "company_status",
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
                onClick={() => navigate(`/master/company-edit/${id}`)}
                className="flex items-center space-x-2"
                title="Edit"
              >
                <IconEdit className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div> */}
              {/* <MasterCompanyEdit
              onClick={() => navigate(`/master/company-edit/${id}`)}
                className="flex items-center space-x-2"
              /> */}
              <MasterCompanyEdit
                onClick={() => {
                  const encryptedId = encryptId(id);
                  const searchStr = searchParams.toString();
                  navigate(
                    `/master/company-edit/${encodeURIComponent(
                      encryptedId,
                    )}${searchStr ? `?${searchStr}` : ""}`,
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
              <MasterCompanyView
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
    data: companyData || [],
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

        if (next.pageIndex === 0 && prev.pageIndex > 0) {
          if (!companyData || companyData.length === 0) {
            return prev;
          }
        }
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
              Company List
            </h1>
            <div className="flex gap-2">
              <MasterCompanyCreate
                onClick={() => {
                  const searchStr = searchParams.toString();
                  navigate(
                    `/master/createCompany${searchStr ? `?${searchStr}` : ""}`,
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
            {companyData ? (
              <MantineReactTable table={table} />
            ) : (
              <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}
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
              <ViewCompany companyId={selectedVehicleId} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CompanyList;
