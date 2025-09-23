import api from "@/api/api";

export const fetchPatients = async () => {
  const res = await api.get("/patients");
  return res.data.patients;
};

export const addPatient = async (data: any) => {
  await api.post("/add_patient", data);
};

export const updatePatient = async (id: number, data: any) => {
  await api.patch(`/update_patient/${id}`, data);
};

export const deletePatient = async (id: number) => {
  await api.delete(`/delete_patient/${id}`);
};
