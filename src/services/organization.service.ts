import { Organization } from "@/dtos/organization";
import { api } from ".";
import { CreateOrganizationRequest } from "@/dtos/create-organization-request";

export const findOrganizations = async (query?: string): Promise<Organization[]> => {
  try {
    const response = await api.get(`/v1/organizations`, {
      params: { query }
    })
    return response.data
  } catch (error) {
    console.error("Erro ao buscar instituições:", error)
    throw error;
  }
}

export const createOrganization = async (notice: CreateOrganizationRequest) => {
  return api.post("v1/organizations", notice);
};

export const updateOrganization = async (id: string, notice: CreateOrganizationRequest) => {
  return api.put(`v1/organizations/${id}`, notice);
};

export const deleteOrganization = async (id: string) => {
  return api.delete(`v1/organizations/${id}`);
};