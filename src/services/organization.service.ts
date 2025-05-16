import { api } from ".";

export const findOrganizations = async (query: string) => {
  try {
    const response = await api.get(`/api/v1/organizations`, {
      params: { query }
    })
    return response.data
  } catch (error) {
    console.error("Erro ao buscar instituições:", error)
  }
}