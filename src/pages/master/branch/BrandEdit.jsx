import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "sonner";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import {
  BackButton,
  CreateButton,
} from "../../../components/common/ButtonColors";
import { decryptId } from "../../../components/common/EncryptionDecryption";

const status = [
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Inactive",
    label: "Inactive",
  },
];

const salaryType = [
  {
    value: "FIXED SALARY",
    label: "FIXED SALARY",
  },
  {
    value: "TRIP WISE",
    label: "TRIP WISE",
  },
  {
    value: "KM",
    label: "KM",
  },
  {
    value: "FIXED+KM",
    label: "FIXED+KM",
  },
];

const BrandEdit = () => {
  const { id } = useParams();
  const decryptedId = decryptId(id);

  const navigate = useNavigate();
  const location = useLocation();

  const [branch, setBranch] = useState({
    branch_name: "",
    branch_salary_type: "",
    branch_status: "",
    branch_bata_for_km_6W: "",
    branch_bata_for_km_10W: "",
    branch_salary_6W: "",
    branch_salary_10W: "",
    branch_incentive_6W: "",
    branch_incentive_10W: "",
    branch_bata_for_trip_6W: "",
    branch_bata_for_trip_10W: "",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const fetchBrandEdit = async () => {
    try {
      setIsButtonDisabled(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-branch-by-id/${decryptedId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setBranch(response.data?.branch);
    } catch (error) {
      console.error("Error fetching Branch data", error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  useEffect(() => {
    fetchBrandEdit();
  }, []);
  const validateOnlyNumber = (inputtxt) => {
    var phoneno = /^\d*\.?\d*$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };

  const validateOnlyDigits = (inputtxt) => {
    var phoneno = /^\d+$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };

  const onInputChange = (e) => {
    if (e.target.name == "branch_bata_for_km_6W") {
      if (validateOnlyNumber(e.target.value)) {
        setBranch({
          ...branch,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "branch_bata_for_km_10W") {
      if (validateOnlyNumber(e.target.value)) {
        setBranch({
          ...branch,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "branch_salary_6W") {
      if (validateOnlyDigits(e.target.value)) {
        setBranch({
          ...branch,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "branch_salary_10W") {
      if (validateOnlyDigits(e.target.value)) {
        setBranch({
          ...branch,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "branch_incentive_6W") {
      if (validateOnlyNumber(e.target.value)) {
        setBranch({
          ...branch,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "branch_incentive_10W") {
      if (validateOnlyNumber(e.target.value)) {
        setBranch({
          ...branch,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "branch_bata_for_trip_6W") {
      if (validateOnlyNumber(e.target.value)) {
        setBranch({
          ...branch,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "branch_bata_for_trip_10W") {
      if (validateOnlyNumber(e.target.value)) {
        setBranch({
          ...branch,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setBranch({
        ...branch,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = document.getElementById("addIndiv");
    if (!form.checkValidity()) {
      toast.error("Fill all required");
      setIsButtonDisabled(false);

      return;
    }
    const data = {
      branch_name: branch.branch_name,
      branch_salary_type: branch.branch_salary_type,
      branch_status: branch.branch_status,
      branch_bata_for_km_6W: branch.branch_bata_for_km_6W,
      branch_bata_for_km_10W: branch.branch_bata_for_km_10W,
      branch_salary_6W: branch.branch_salary_6W,
      branch_salary_10W: branch.branch_salary_10W,
      branch_incentive_6W: branch.branch_incentive_6W,
      branch_incentive_10W: branch.branch_incentive_10W,
      branch_bata_for_trip_6W: branch.branch_bata_for_trip_6W,
      branch_bata_for_trip_10W: branch.branch_bata_for_trip_10W,
    };

    setIsButtonDisabled(true);
    axios({
      url: BASE_URL + `/api/web-update-branch/${decryptedId}`,
      method: "PUT",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.code == 200) {
        toast.success(res.data.msg);
      } else if (res.data.code == 400) {
        toast.error(res.data.msg);
      }
      navigate(`/master/branch-list${location?.search}`);
    });
  };

  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const inputClassSelect =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-500";
  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-blue-500";
  return (
    <Layout>
      <div className=" bg-[#FFFFFF] p-2  rounded-lg  ">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-red-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Edit Branch </span>
            </div>
            <IconArrowBack
              onClick={() => navigate(`/master/branch-list${location?.search}`)}
              className="cursor-pointer hover:text-red-600"
            />
          </h2>
        </div>
        <hr />
        <form
          onSubmit={handleSubmit}
          id="addIndiv"
          className="w-full max-w-7xl  rounded-lg mx-auto p-4 space-y-6 "
        >
          <div className="grid grid-cols-1  md:grid-cols-1 lg:grid-cols-4   gap-6">
            {/* Branch Name  */}
            <div>
              <FormLabel required>Branch Name</FormLabel>
              <input
                type="text"
                name="branch_name"
                value={branch.branch_name}
                onChange={(e) => onInputChange(e)}
                className={`${inputClass} cursor-not-allowed  `}
                required
                disabled
              />
            </div>
            {/* Salary Type  */}
            <div>
              <FormLabel required>Salary Type</FormLabel>
              <select
                name="branch_salary_type"
                value={branch.branch_salary_type}
                onChange={(e) => onInputChange(e)}
                required
                className={inputClassSelect}
              >
                <option value="">Select Salary Type</option>
                {salaryType.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {/* status  */}
            <div>
              <FormLabel required>Status</FormLabel>
              <select
                name="branch_status"
                value={branch.branch_status}
                onChange={(e) => onInputChange(e)}
                required
                className={inputClassSelect}
              >
                <option value="">Select Status</option>
                {status.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {branch.branch_salary_type == "FIXED+KM" ||
            branch.branch_salary_type == "FIXED SALARY" ? (
              <>
                {/* Salary 6W  */}
                <div>
                  <FormLabel required>Salary 6W</FormLabel>
                  <input
                    type="tel"
                    name="branch_salary_6W"
                    value={branch.branch_salary_6W}
                    onChange={(e) => onInputChange(e)}
                    className={inputClass}
                    required
                  />
                </div>
                {/* Salary 10W  */}
                <div>
                  <FormLabel required>Salary 10W</FormLabel>
                  <input
                    type="tel"
                    name="branch_salary_10W"
                    value={branch.branch_salary_10W}
                    onChange={(e) => onInputChange(e)}
                    className={inputClass}
                    required
                  />
                </div>
              </>
            ) : (
              ""
            )}

            {branch.branch_salary_type == "KM" ||
            branch.branch_salary_type == "FIXED+KM" ? (
              <>
                {/* Bata for KM 6W  */}
                <div>
                  <FormLabel required>Bata for KM 6W</FormLabel>
                  <input
                    type="tel"
                    name="branch_bata_for_km_6W"
                    value={branch.branch_bata_for_km_6W}
                    onChange={(e) => onInputChange(e)}
                    className={inputClass}
                    required
                  />
                </div>
                {/* Bata for KM 10W  */}
                <div>
                  <FormLabel required>Bata for KM 10W</FormLabel>
                  <input
                    type="tel"
                    name="branch_bata_for_km_10W"
                    value={branch.branch_bata_for_km_10W}
                    onChange={(e) => onInputChange(e)}
                    className={inputClass}
                    required
                  />
                </div>
              </>
            ) : (
              ""
            )}

            {/* Incentive 6W  */}
            <div>
              <FormLabel>Incentive 6W</FormLabel>
              <input
                type="tel"
                name="branch_incentive_6W"
                value={branch.branch_incentive_6W}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* Incentive 10W  */}
            <div>
              <FormLabel>Incentive 10W</FormLabel>
              <input
                type="tel"
                name="branch_incentive_10W"
                value={branch.branch_incentive_10W}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* Bata for 6W day  */}
            <div>
              <FormLabel>Bata for 6W day</FormLabel>
              <input
                type="tel"
                name="branch_bata_for_trip_6W"
                value={branch.branch_bata_for_trip_6W}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>

            {/* Bata for 10W day  */}
            <div>
              <FormLabel>Bata for 10W day</FormLabel>
              <input
                type="tel"
                name="branch_bata_for_trip_10W"
                value={branch.branch_bata_for_trip_10W}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-wrap gap-4 justify-start">
            <button
              type="submit"
              className={CreateButton}
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? "Updating..." : "Update"}
            </button>

            <button
              type="button"
              className={BackButton}
              onClick={() => {
                navigate(`/master/branch-list${location?.search}`);
              }}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default BrandEdit;
