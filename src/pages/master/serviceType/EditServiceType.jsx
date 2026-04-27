import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";
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

const EditServiceType = () => {
  const { id } = useParams();
  const decryptedId = decryptId(id);

  const navigate = useNavigate();
  const location = useLocation();
  const [serviceTypes, setServiceTypes] = useState({
    service_types: "",
    service_types_status: "",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const fetchServiceTypeEdit = async () => {
    try {
      setIsButtonDisabled(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-service-types-by-id/${decryptedId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setServiceTypes(response.data?.serviceTypes);
    } catch (error) {
      console.error("Error fetching serviceTypes edit data", error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  useEffect(() => {
    fetchServiceTypeEdit();
  }, []);

  const onInputChange = (e) => {
    setServiceTypes({
      ...serviceTypes,
      [e.target.name]: e.target.value,
    });
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
      service_types: serviceTypes.service_types,
      service_types_status: serviceTypes.service_types_status,
    };

    setIsButtonDisabled(true);
    axios({
      url: BASE_URL + `/api/web-update-service-types/${decryptedId}`,
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
      navigate(`/master/servicetype-list${location?.search}`);
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
              <span>Edit Service Type</span>
            </div>
            <IconArrowBack
              onClick={() =>
                navigate(`/master/servicetype-list${location?.search}`)
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
          <div className="grid grid-cols-1  md:grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <FormLabel required>Service Type</FormLabel>
              <input
                type="text"
                name="service_types"
                value={serviceTypes.service_types}
                onChange={(e) => onInputChange(e)}
                className={`${inputClass} cursor-not-allowed  `}
                required
                disabled
              />
            </div>
            <div>
              <FormLabel required>Status</FormLabel>
              <select
                name="service_types_status"
                value={serviceTypes.service_types_status}
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
                navigate(`/master/servicetype-list${location?.search}`);
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

export default EditServiceType;
