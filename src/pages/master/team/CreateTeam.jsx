import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "sonner";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import {
  BackButton,
  CreateButton,
} from "../../../components/common/ButtonColors";

const userType = [
  {
    value: "3",
    label: "Office",
  },
  {
    value: "4",
    label: "Branch Manager",
  },
];

const CreateTeam = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [team, setTeam] = useState({
    full_name: "",
    email: "",
    mobile: "",
    user_company: "",
    user_salary: "",
    user_type_id: "",
    user_address: "",
    user_branch: "",
    user_insurance: "",
    user_insurance_no: "",
    user_bank: "",
    user_bank_branch: "",
    user_account_no: "",
    user_ifsc_code: "",
    user_image: "",
    user_adhar_card: "",
    user_pan_card: "",
    user_passbook: "",
    user_licence: "",
  });
  const [selectedFile1, setSelectedFile1] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [selectedFile3, setSelectedFile3] = useState(null);
  const [selectedFile4, setSelectedFile4] = useState(null);
  const [selectedFile5, setSelectedFile5] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [company, setCompany] = useState([]);
  const [branch, setBranch] = useState([]);
  const fetchCompany = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/web-fetch-company`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCompany(response.data?.company);
    } catch (error) {
      console.error("Error fetching  team master data", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchBranch = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/web-fetch-branch`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBranch(response.data?.branch);
    } catch (error) {
      console.error("Error fetching  team master data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
    fetchBranch();
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
    if (e.target.name == "mobile") {
      if (validateOnlyDigits(e.target.value)) {
        setTeam({
          ...team,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "user_salary") {
      if (validateOnlyDigits(e.target.value)) {
        setTeam({
          ...team,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setTeam({
        ...team,
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
    const data = new FormData();
    data.append("full_name", team.full_name);
    data.append("email", team.email);
    data.append("mobile", team.mobile);
    data.append("user_company", team.user_company);
    data.append("user_salary", team.user_salary);
    data.append("user_type_id", team.user_type_id);
    data.append("user_address", team.user_address);
    data.append("user_branch", team.user_branch);
    data.append("user_insurance", team.user_insurance);
    data.append("user_insurance_no", team.user_insurance_no);
    data.append("user_bank", team.user_bank);
    data.append("user_bank_branch", team.user_bank_branch);
    data.append("user_account_no", team.user_account_no);
    data.append("user_ifsc_code", team.user_ifsc_code);
    data.append("user_image", selectedFile1);
    data.append("user_adhar_card", selectedFile2);
    data.append("user_pan_card", selectedFile3);
    data.append("user_passbook", selectedFile4);
    data.append("user_licence", selectedFile5);

    setIsButtonDisabled(true);
    axios({
      url: BASE_URL + "/api/web-create-team",
      method: "POST",
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
      navigate(`/master/team-list${location?.search}`);
      setTeam({
        full_name: "",
        email: "",
        mobile: "",
        user_company: "",
        user_salary: "",
        user_type_id: "",
        user_address: "",
        user_branch: "",
        user_insurance: "",
        user_insurance_no: "",
        user_bank: "",
        user_bank_branch: "",
        user_account_no: "",
        user_ifsc_code: "",
        user_image: "",
        user_adhar_card: "",
        user_pan_card: "",
        user_passbook: "",
        user_licence: "",
      });
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
              <span>Add Team </span>
            </div>
            <IconArrowBack
              onClick={() => navigate(`/master/team-list${location?.search}`)}
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
            {/* Full Name  */}
            <div className="col-span-0 lg:col-span-2">
              <FormLabel required>Full Name</FormLabel>
              <input
                type="text"
                name="full_name"
                value={team.full_name}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>

            {/* Company  */}
            <div>
              <FormLabel required>Company</FormLabel>
              <select
                name="user_company"
                value={team.user_company}
                onChange={(e) => onInputChange(e)}
                required
                className={inputClassSelect}
              >
                <option value="">Select Company </option>
                {company.map((option) => (
                  <option key={option.company_name} value={option.company_name}>
                    {option.company_name}
                  </option>
                ))}
              </select>
            </div>
            {/* Branch  */}
            <div>
              <FormLabel required>Branch</FormLabel>
              <select
                name="user_branch"
                value={team.user_branch}
                onChange={(e) => onInputChange(e)}
                required
                className={inputClassSelect}
              >
                <option value="">Select Branch </option>
                {branch.map((option) => (
                  <option key={option.branch_name} value={option.branch_name}>
                    {option.branch_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Address  */}
            <div className="col-span-0 lg:col-span-4">
              <FormLabel required>Address</FormLabel>
              <textarea
                type="text"
                name="user_address"
                value={team.user_address}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
                rows={3}
                multiline
              />
            </div>

            {/* Mobile  */}
            <div>
              <FormLabel required>Mobile</FormLabel>
              <input
                type="tel"
                name="mobile"
                value={team.mobile}
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
                name="email"
                value={team.email}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            {/* Salary  */}
            <div>
              <FormLabel>Salary</FormLabel>
              <input
                type="tel"
                name="user_salary"
                value={team.user_salary}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* user type  */}
            <div>
              <FormLabel required>User Type</FormLabel>
              <select
                name="user_type_id"
                value={team.user_type_id}
                onChange={(e) => onInputChange(e)}
                required
                className={inputClassSelect}
              >
                <option value="">Select User Type </option>
                {userType.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Bank  */}
            <div>
              <FormLabel>Bank</FormLabel>
              <input
                type="text"
                name="user_bank"
                value={team.user_bank}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* Bank Branch  */}
            <div>
              <FormLabel>Bank Branch</FormLabel>
              <input
                type="text"
                name="user_bank_branch"
                value={team.user_bank_branch}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* Bank IFSC  */}
            <div>
              <FormLabel>Bank IFSC</FormLabel>
              <input
                type="text"
                name="user_ifsc_code"
                value={team.user_ifsc_code}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* Account No  */}
            <div>
              <FormLabel>Account No</FormLabel>
              <input
                type="text"
                name="user_account_no"
                value={team.user_account_no}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* Insurance  */}
            <div className="col-span-0 lg:col-span-2">
              <FormLabel>Insurance</FormLabel>
              <input
                type="text"
                name="user_insurance"
                value={team.user_insurance}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* Insurance No  */}
            <div className="col-span-0 lg:col-span-2">
              <FormLabel>Insurance No</FormLabel>
              <input
                type="text"
                name="user_insurance_no"
                value={team.user_insurance_no}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* Photo */}
            <div>
              <FormLabel>Photo</FormLabel>
              <input
                type="file"
                name="user_image"
                onChange={(e) => setSelectedFile1(e.target.files[0])}
                className="w-full px-3 py-1 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-blue-500 file:mr-4 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs  file:bg-[#E1F5FA] file:text-black  cursor-pointer  "
              />
            </div>
            {/* Aadhar Card */}
            <div>
              <FormLabel>Aadhar Card</FormLabel>
              <input
                type="file"
                name="user_adhar_card"
                onChange={(e) => setSelectedFile2(e.target.files[0])}
                className="w-full px-3 py-1 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-blue-500 file:mr-4 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs  file:bg-[#E1F5FA] file:text-black  cursor-pointer "
              />
            </div>
            {/* PAN Card */}
            <div>
              <FormLabel>PAN Card</FormLabel>
              <input
                type="file"
                name="user_pan_card"
                onChange={(e) => setSelectedFile3(e.target.files[0])}
                className="w-full px-3 py-1 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-blue-500 file:mr-4 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs  file:bg-[#E1F5FA] file:text-black  cursor-pointer  "
              />
            </div>
            {/* Pass Book */}
            <div>
              <FormLabel>Pass Book</FormLabel>
              <input
                type="file"
                name="user_passbook"
                onChange={(e) => setSelectedFile4(e.target.files[0])}
                className="w-full px-3 py-1 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-blue-500 file:mr-4 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs  file:bg-[#E1F5FA] file:text-black  cursor-pointer  "
              />
            </div>
            {/* Licence */}
            <div>
              <FormLabel>Licence</FormLabel>
              <input
                type="file"
                name="user_licence"
                onChange={(e) => setSelectedFile5(e.target.files[0])}
                className="w-full px-3 py-1 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-blue-500 file:mr-4 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs  file:bg-[#E1F5FA] file:text-black  cursor-pointer  "
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
              {isButtonDisabled ? "Sumbitting..." : "Sumbit"}
            </button>

            <button
              type="button"
              className={BackButton}
              onClick={() => {
                navigate(`/master/team-list${location?.search}`);
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

export default CreateTeam;
