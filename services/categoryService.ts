import api from "./axiosInstance";

export const getCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCategory = async (categoryData: { name: string; description?: string; household_id?: number; is_active?: boolean }) => {
  try {
    const response = await api.post("/categories", categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (
  id: number,
  categoryData: {
    name?: string;
    description?: string;
    household_id?: number;
    is_active?: boolean;
  }
) => {
  try {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async (id: number) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
