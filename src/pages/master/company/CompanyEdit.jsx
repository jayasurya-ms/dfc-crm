import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Layout from "../../../layout/Layout";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "sonner";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import { decryptId } from "../../../components/common/EncryptionDecryption";
import {
  BackButton,
  CreateButton,
} from "../../../components/common/ButtonColors";

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

const CompanyEdit = () => {
  const { id } = useParams();
  const decryptedId = decryptId(id);

  const navigate = useNavigate();
  const location = useLocation();
  const [company, setCompany] = useState({
    company_short: "",
    company_name: "",
    company_address: "",
    company_mobile: "",
    company_email: "",
    company_gst: "",
    company_pan: "",
    company_status: "",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const fetchCompanyEdit = async () => {
    try {
      setIsButtonDisabled(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-company-by-id/${decryptedId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCompany(response.data?.company);
    } catch (error) {
      console.error("Error fetching company data", error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  useEffect(() => {
    fetchCompanyEdit();
  }, []);
  const validateOnlyDigits = (inputtxt) => {
    var phoneno = /^\d+$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };

  const onInputChange = (e) => {
    if (e.target.name == "company_mobile") {
      if (validateOnlyDigits(e.target.value)) {
        setCompany({
          ...company,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setCompany({
        ...company,
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
      company_name: company.company_name,
      company_address: company.company_address,
      company_mobile: company.company_mobile,
      company_email: company.company_email,
      company_gst: company.company_gst,
      company_pan: company.company_pan,
      company_status: company.company_status,
    };

    setIsButtonDisabled(true);
    axios({
      url: BASE_URL + `/api/web-update-company/${decryptedId}`,
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
      navigate(`/master/company-list${location?.search}`);
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
              <span>Edit Company </span>
            </div>
            <IconArrowBack
              onClick={() =>
                navigate(`/master/company-list${location?.search}`)
              }
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
            {/* Company Short  */}
            <div className="col-span-0 lg:col-span-2 ">
              <FormLabel required>Company Short</FormLabel>
              <input
                type="text"
                name="company_short"
                value={company.company_short}
                onChange={(e) => onInputChange(e)}
                className={`${inputClass} cursor-not-allowed  `}
                required
                disabled
              />
            </div>
            {/* Company Name  */}
            <div className="col-span-0 lg:col-span-2">
              <FormLabel required>Company Name</FormLabel>
              <input
                type="text"
                name="company_name"
                value={company.company_name}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            {/* Company Address  */}
            <div className="col-span-0 lg:col-span-3">
              <FormLabel required>Company Address</FormLabel>
              <textarea
                type="text"
                name="company_address"
                value={company.company_address}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
                rows={3}
                aria-multiline
              />
            </div>

            {/* Mobile  */}
            <div>
              <FormLabel required>Mobile</FormLabel>
              <input
                type="tel"
                name="company_mobile"
                value={company.company_mobile}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
                maxLength={10}
              />
            </div>

            {/* Email  */}
            <div>
              <FormLabel required>Email</FormLabel>
              <input
                type="email"
                name="company_email"
                value={company.company_email}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>

            {/* GST  */}
            <div>
              <FormLabel>GST</FormLabel>
              <input
                type="text"
                name="company_gst"
                value={company.company_gst}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                maxLength={15}
              />
            </div>

            {/* PAN NO  */}
            <div>
              <FormLabel>Pan No</FormLabel>
              <input
                type="text"
                name="company_pan"
                value={company.company_pan}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                maxLength={10}
              />
            </div>
            {/* status  */}
            <div>
              <FormLabel required>Status</FormLabel>
              <select
                name="company_status"
                value={company.company_status}
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
                navigate(`/master/company-list${location?.search}`);
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

export default CompanyEdit;
